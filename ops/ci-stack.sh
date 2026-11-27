#!/usr/bin/env bash
set -Eeuo pipefail
[[ ${GITHUB_ACTIONS:-} == true && ${GITHUB_RUN_ID:-} =~ ^[0-9]+$ ]]
root=$(cd -- "$(dirname -- "$0")/.." && pwd)
project=site-oksana-ci-$GITHUB_RUN_ID-${GITHUB_RUN_ATTEMPT:-1}
work=$(mktemp -d)
export CI_POLICY_FILE=$work/policy.md
export CI_DEV_SITE_FILE=$work/development.caddy
base=http://127.0.0.1:3100
printf '%s\n' 'Synthetic CI policy for an isolated database.' > "$CI_POLICY_FILE"
chmod 0644 "$CI_POLICY_FILE"
cat > "$work/test.env" <<'EOF'
SITE_ADDRESS=:80
SITE_ORIGIN=http://127.0.0.1:3100
POSTGRES_PASSWORD=ci-database-credential
APP_DB_PASSWORD=ci-application-credential
PUBLIC_LEADS_ENABLED=true
PUBLIC_INDEXABLE=true
PRIVACY_VERSION=ci-policy
PRIVACY_POLICY_PATH=/policy/policy.md
LEAD_EMAIL_ENABLED=false
EOF
cat > "$work/development.env" <<'EOF'
DEV_SITE_ADDRESS=dev.example.test
DEV_POSTGRES_PASSWORD=ci-development-database-credential
DEV_APP_DB_PASSWORD=ci-development-application-credential
WEB_IMAGE=site-oksana-ci-web
MIGRATE_IMAGE=site-oksana-ci-migrate
EOF

preview_password=ci-preview-only
hash=$(docker run --rm caddy:2-alpine caddy hash-password --plaintext "$preview_password")
sed -e 's|dev.example.com|http://dev.example.test|' -e "s|REPLACE_WITH_BCRYPT_HASH|$hash|" \
  "$root/ops/development.caddy.example" > "$CI_DEV_SITE_FILE"

compose() {
  docker compose -p "$project" --env-file "$work/test.env" \
    -f "$root/compose.yaml" -f "$root/ops/compose.ci.yaml" "$@"
}

development() {
  docker compose -p "$project-development" --env-file "$work/development.env" \
    -f "$root/ops/compose.development.yaml" "$@"
}

cleanup() {
  if [[ $1 != 0 ]]; then
    compose logs --tail 100 || true
    development logs --tail 100 || true
  fi
  development down -v || true
  compose down -v || true
  docker network rm site-oksana-edge || true
  rm -f "$CI_POLICY_FILE" "$CI_DEV_SITE_FILE" "$work/test.env" "$work/development.env"
  rmdir "$work"
}
trap 'cleanup "$?"' EXIT

SITE_ADDRESS=example.test WEB_IMAGE=site-oksana-ci-web MIGRATE_IMAGE=site-oksana-ci-migrate \
  docker compose --env-file "$work/test.env" -f "$root/compose.yaml" \
  -f "$root/ops/compose.production.yaml" config --quiet
compose config --quiet
development config --quiet
docker network create site-oksana-edge
compose run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
compose up -d --wait --wait-timeout 120 postgres
compose run --rm --no-deps migrate
compose run --rm --no-deps migrate
compose up -d --no-deps --wait --wait-timeout 90 web
compose up -d --no-deps caddy
curl -fsS --max-time 10 --retry 8 --retry-all-errors "$base/api/ready"
robots=$(curl -fsS --max-time 10 "$base/robots.txt")
sitemap=$(curl -fsS --max-time 10 "$base/sitemap.xml")
[[ $robots == *"Sitemap: $base/sitemap.xml"* ]]
[[ $sitemap == *"$base/courses/yoga-ayurveda-14-days"* && $sitemap != *"/courses/course-01"* ]]

cd "$root"
E2E_BASE_URL="$base" E2E_REAL_LEADS=true pnpm test:e2e

development up -d --wait --wait-timeout 120 postgres
development run --rm --no-deps migrate
development up -d --wait --wait-timeout 90 web
preview_status=$(curl -sS --max-time 10 -o /dev/null -w '%{http_code}' \
  -H 'Host: dev.example.test' "$base/api/ready")
[[ $preview_status == 401 ]]
preview_headers=$(curl -fsSI --max-time 10 -H 'Host: dev.example.test' \
  --user "preview:$preview_password" "$base/")
grep -qi '^x-robots-tag: noindex, nofollow' <<< "$preview_headers"
curl -fsS --max-time 10 -H 'Host: dev.example.test' \
  --user "preview:$preview_password" "$base/api/ready"
curl -fsS --max-time 10 -H 'Host: dev.example.test' -H 'Origin: https://dev.example.test' \
  -H 'Content-Type: application/json' --user "preview:$preview_password" \
  --data '{"courseSlug":"yoga-ayurveda-14-days","name":"Тест","phone":"+1 202 555 0100","email":"preview@example.test","consent":true,"privacyVersion":"development-test","submissionId":"879d374b-af80-4229-8248-9dd8b172c82d"}' \
  "$base/api/leads"
preview_record=$(development exec -T postgres psql -X -v ON_ERROR_STOP=1 -U postgres -d oksana_development -At -c \
  "SELECT count(*), coalesce(min(email), ''), coalesce(min(consent_version), ''), coalesce(min(mail_status), '') FROM public.leads")
[[ $preview_record == '1|preview@example.test|development-test|skipped' ]]

compose restart postgres
compose up -d --wait --wait-timeout 120 postgres
record=$(compose exec -T postgres psql -X -v ON_ERROR_STOP=1 -U postgres -d oksana -At -c \
  "SELECT count(*), coalesce(min(course_slug), ''), coalesce(min(consent_version), ''), coalesce(min(mail_status), '') FROM public.leads")
[[ $record == '1|yoga-ayurveda-14-days|ci-policy|skipped' ]]
