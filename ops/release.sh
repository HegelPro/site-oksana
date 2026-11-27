#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

readonly config=/etc/site-oksana
readonly state=/var/lib/site-oksana
readonly packages=ghcr.io/hegelpro/site-oksana
readonly tag=site-oksana-db

die() { printf '%s\n' "$*" >&2; exit 1; }
[[ $EUID == 0 ]] || die "Run the release command as root."
[[ -r $config/production.env ]] || die "Configure $config/production.env first."
install -d -m 0700 "$state"
exec 9>"$state/operation.lock"
flock -w 120 9 || die "Another site operation is running."

compose() {
  local release=$1
  shift
  docker compose -p site-oksana --env-file "$config/production.env" --env-file "$release" \
    -f "$config/compose.yaml" -f "$config/compose.production.yaml" "$@"
}

require_release() {
  [[ -s $state/current.env ]] || die "There is no successful production release."
}

domain() {
  local host
  host=$(sed -n 's/^SITE_ADDRESS=//p' "$config/production.env")
  [[ $host =~ ^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$ ]] || die "Set a single bare DNS name as SITE_ADDRESS."
  printf '%s\n' "$host"
}

backup_settings() {
  [[ -r $config/backup.env ]] || die "Configure encrypted offsite backups before deploying."
  set -a
  # The administrator installs this shell environment with mode 0600.
  source "$config/backup.env"
  set +a
  [[ ${RESTIC_REPOSITORY:-} == s3:* && -s ${RESTIC_PASSWORD_FILE:-} ]] ||
    die "Configure the S3 restic repository and password file."
}

backup_database() (
  local release=$1 temp
  backup_settings
  temp=$(mktemp -d "$state/backup.XXXXXX")
  trap 'rm -f "$temp/site-oksana.dump"; rmdir "$temp"' EXIT
  compose "$release" exec -T postgres sh -ec 'exec pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' \
    > "$temp/site-oksana.dump"
  [[ -s $temp/site-oksana.dump ]] || die "PostgreSQL returned an empty backup."
  timeout 300 restic backup --tag "$tag" --stdin --stdin-filename site-oksana.dump \
    < "$temp/site-oksana.dump"
)

verify_restore() (
  local release=$1 temp database created=false
  backup_settings
  temp=$(mktemp -d "$state/restore.XXXXXX")
  database="oksana_restore_$(date +%s)_$$"
  trap 'if $created; then compose "$release" exec -T postgres dropdb -U postgres --if-exists "$database"; fi; rm -f "$temp/site-oksana.dump"; rmdir "$temp"' EXIT
  compose "$release" exec -T postgres createdb -U postgres "$database"
  created=true
  timeout 300 restic dump --tag "$tag" latest /site-oksana.dump > "$temp/site-oksana.dump"
  compose "$release" exec -T postgres pg_restore -U postgres --single-transaction --exit-on-error \
    -d "$database" < "$temp/site-oksana.dump"
  compose "$release" exec -T postgres psql -X -v ON_ERROR_STOP=1 -U postgres -d "$database" \
    -c 'SELECT count(*) AS restored_leads FROM public.leads;'
)

smoke() {
  local host=$1 path result
  for path in /api/ready /; do
    result=$(curl --fail --silent --show-error --connect-timeout 5 --max-time 10 \
      --retry 12 --retry-all-errors --retry-delay 3 --retry-max-time 75 \
      --output /dev/null --write-out '%{http_code}' "https://$host$path") || return
    [[ $result == 200 ]] || return 1
  done
}

start_web() {
  compose "$1" up -d --no-deps --wait --wait-timeout 90 web
}

deploy() (
  [[ $# == 3 && $1 =~ ^[a-f0-9]{40}$ && $2 =~ ^sha256:[a-f0-9]{64}$ && $3 =~ ^sha256:[a-f0-9]{64}$ ]] ||
    die "Expected deploy <commit> <web digest> <migration digest>."
  local sha=$1 web=$2 migrate=$3 candidate previous host
  host=$(domain)
  backup_settings
  timeout 30 restic cat config >/dev/null
  candidate=$(mktemp "$state/release.XXXXXX")
  previous="$candidate.previous"
  trap 'rm -f "$candidate" "$previous"' EXIT
  printf 'RELEASE_SHA=%s\nWEB_IMAGE=%s/web@%s\nMIGRATE_IMAGE=%s/migrate@%s\n' \
    "$sha" "$packages" "$web" "$packages" "$migrate" > "$candidate"
  compose "$candidate" config --quiet
  compose "$candidate" pull web migrate
  local existing_db=false
  if docker volume inspect site-oksana_postgres_data >/dev/null 2>&1; then existing_db=true; fi
  compose "$candidate" up -d --wait --wait-timeout 120 postgres
  if $existing_db; then backup_database "$candidate"; fi
  if [[ -s $state/current.env ]]; then
    cp "$state/current.env" "$previous"
  fi
  compose "$candidate" run --rm --no-deps migrate
  if start_web "$candidate" &&
    compose "$candidate" up -d --no-deps caddy &&
    smoke "$host"; then
    if [[ -s $previous ]]; then mv "$previous" "$state/previous.env"; fi
    mv "$candidate" "$state/current.env"
    printf 'Deployed %s\n' "$sha"
    return
  fi
  if [[ -s $state/current.env ]]; then
    start_web "$state/current.env" && smoke "$host" ||
      die "Release failed and the previous web image needs operator attention."
  else
    compose "$candidate" stop web
  fi
  die "Release failed its health check."
)

rollback() {
  require_release
  [[ -s $state/previous.env ]] || die "There is no previous release."
  local host
  host=$(domain)
  if start_web "$state/previous.env" && smoke "$host"; then
    mv "$state/current.env" "$state/rolled-back.env"
    mv "$state/previous.env" "$state/current.env"
  else
    start_web "$state/current.env" && smoke "$host" || die "The current image needs operator attention."
    die "The previous image failed its health check."
  fi
}

check_host() {
  require_release
  local usage waiting host docker_root path
  docker_root=$(docker info --format '{{.DockerRootDir}}')
  for path in "$state" "$docker_root"; do
    usage=$(df -P "$path" | awk 'NR==2 {gsub(/%/, "", $5); print $5}')
    [[ $usage =~ ^[0-9]+$ && $usage -lt 80 ]] || die "Disk usage reached the 80 percent warning threshold at $path."
  done
  host=$(domain)
  smoke "$host"
  waiting=$(compose "$state/current.env" exec -T postgres sh -ec '
    exec psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -At -c \
      "SELECT count(*) FROM public.leads WHERE status = '\''new'\'' AND
      (mail_status = '\''failed'\'' OR (mail_status = '\''pending'\'' AND created_at < now() - interval '\''15 minutes'\''));"
  ')
  [[ $waiting == 0 ]] || die "$waiting new application(s) need manual notification review."
}

case ${1:-} in
  deploy) shift; deploy "$@" ;;
  rollback) [[ $# == 1 ]] || die "Unexpected arguments."; rollback ;;
  refresh)
    [[ $# == 1 ]] || die "Unexpected arguments."
    require_release
    compose "$state/current.env" config --quiet
    compose "$state/current.env" run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
    start_web "$state/current.env"
    compose "$state/current.env" up -d --no-deps --force-recreate caddy
    smoke "$(domain)"
    ;;
  backup)
    [[ $# == 1 ]] || die "Unexpected arguments."
    require_release
    backup_database "$state/current.env"
    backup_settings
    timeout 120 restic forget --tag "$tag" --keep-daily 7 --keep-weekly 4
    ;;
  restore-check) [[ $# == 1 ]] || die "Unexpected arguments."; require_release; verify_restore "$state/current.env" ;;
  check) [[ $# == 1 ]] || die "Unexpected arguments."; check_host ;;
  *) die "Usage: site-oksana-release {deploy|rollback|refresh|backup|restore-check|check}" ;;
esac
