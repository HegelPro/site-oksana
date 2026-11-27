#!/usr/bin/env bash
set -Eeuo pipefail
[[ ${GITHUB_ACTIONS:-} == true && ${GITHUB_RUN_ID:-} =~ ^[0-9]+$ ]]
root=$(cd -- "$(dirname -- "$0")/.." && pwd)
project=site-oksana-ci-$GITHUB_RUN_ID-${GITHUB_RUN_ATTEMPT:-1}
work=$(mktemp -d)
export CI_POLICY_FILE=$work/policy.md
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

compose() {
  docker compose -p "$project" --env-file "$work/test.env" \
    -f "$root/compose.yaml" -f "$root/ops/compose.ci.yaml" "$@"
}

cleanup() {
  if [[ $1 != 0 ]]; then compose logs --tail 100 || true; fi
  compose down -v || true
  rm -f "$CI_POLICY_FILE" "$work/test.env"
  rmdir "$work"
}
trap 'cleanup "$?"' EXIT

SITE_ADDRESS=example.test WEB_IMAGE=site-oksana-ci-web MIGRATE_IMAGE=site-oksana-ci-migrate \
  docker compose --env-file "$work/test.env" -f "$root/compose.yaml" \
  -f "$root/ops/compose.production.yaml" config --quiet
compose config --quiet
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
compose restart postgres
compose up -d --wait --wait-timeout 120 postgres
record=$(compose exec -T postgres psql -X -v ON_ERROR_STOP=1 -U postgres -d oksana -At -c \
  "SELECT count(*), coalesce(min(course_slug), ''), coalesce(min(consent_version), ''), coalesce(min(mail_status), '') FROM public.leads")
[[ $record == '1|yoga-ayurveda-14-days|ci-policy|skipped' ]]
