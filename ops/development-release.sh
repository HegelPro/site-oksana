#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

readonly config=/etc/site-oksana
readonly state=/var/lib/site-oksana-development
readonly packages=ghcr.io/hegelpro/site-oksana
readonly project=site-oksana-development

die() { printf '%s\n' "$*" >&2; exit 1; }
[[ $EUID == 0 ]] || die "Run the development release command as root."
[[ $# == 4 && $1 == deploy && $2 =~ ^[a-f0-9]{40}$ &&
   $3 =~ ^sha256:[a-f0-9]{64}$ && $4 =~ ^sha256:[a-f0-9]{64}$ ]] ||
  die "Expected deploy <commit> <web digest> <migration digest>."
[[ -r $config/development.env ]] || die "Configure $config/development.env first."

host=$(sed -n 's/^DEV_SITE_ADDRESS=//p' "$config/development.env")
[[ $host =~ ^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$ ]] ||
  die "Set a single bare DNS name as DEV_SITE_ADDRESS."
proxy=$(docker ps --filter label=com.docker.compose.project=site-oksana \
  --filter label=com.docker.compose.service=caddy --format '{{.ID}}')
[[ $proxy =~ ^[a-z0-9]+$ ]] || die "Start the shared Caddy before deploying development."
[[ $(docker inspect --format '{{with index .NetworkSettings.Networks "site-oksana-edge"}}ready{{end}}' "$proxy") == ready ]] ||
  die "Apply the production Compose update to the shared Caddy first."

install -d -m 0700 "$state"
exec 9>"$state/operation.lock"
flock -w 120 9 || die "Another development release is running."

compose() {
  local release=$1
  shift
  docker compose -p "$project" --env-file "$config/development.env" --env-file "$release" \
    -f "$config/compose.development.yaml" "$@"
}

start_web() {
  compose "$1" up -d --no-deps --wait --wait-timeout 90 web
}

candidate=$(mktemp "$state/release.XXXXXX")
trap 'rm -f "$candidate"' EXIT
printf 'RELEASE_SHA=%s\nWEB_IMAGE=%s/dev-web@%s\nMIGRATE_IMAGE=%s/dev-migrate@%s\n' \
  "$2" "$packages" "$3" "$packages" "$4" > "$candidate"

compose "$candidate" config --quiet
compose "$candidate" pull web migrate
compose "$candidate" up -d --wait --wait-timeout 120 postgres
compose "$candidate" run --rm --no-deps migrate
if start_web "$candidate" &&
   timeout 15 docker exec "$proxy" wget -q -O /dev/null http://dev-web:3000/api/ready &&
   status=$(curl --silent --show-error --connect-timeout 5 --max-time 10 \
     --retry 8 --retry-all-errors --retry-delay 3 --retry-max-time 60 \
     --output /dev/null --write-out '%{http_code}' "https://$host/") &&
   [[ $status == 401 ]]; then
  mv "$candidate" "$state/current.env"
  printf 'Deployed development %s\n' "$2"
  exit 0
fi

if [[ -s $state/current.env ]]; then
  start_web "$state/current.env" || die "Development rollout failed and the previous web image needs attention."
else
  compose "$candidate" stop web
fi
die "Development rollout failed; verify the DNS, HTTPS and authentication for $host."
