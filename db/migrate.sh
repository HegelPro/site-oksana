#!/bin/sh
set -eu

: "${APP_DB_PASSWORD:?APP_DB_PASSWORD is required}"
export LC_ALL=C

set -- "${MIGRATIONS_DIR:-/db/migrations}"/*.sql
if [ ! -f "$1" ]; then
  echo "No PostgreSQL migrations found" >&2
  exit 1
fi

# Build the psql input before connecting so shell errors cannot leave an incomplete run.
manifest=$(mktemp)
trap 'rm -f "$manifest"' 0

cat >"$manifest" <<'SQL'
SET LOCAL lock_timeout = '15s';
SELECT pg_advisory_xact_lock(1830385778);

CREATE SCHEMA IF NOT EXISTS oksana_migrations;
REVOKE ALL ON SCHEMA oksana_migrations FROM PUBLIC;
CREATE TABLE IF NOT EXISTS oksana_migrations.applied (
  version text PRIMARY KEY,
  checksum text NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT now()
);

SELECT NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'oksana_app') AS create_app_role
\gset
\if :create_app_role
  \getenv app_password APP_DB_PASSWORD
  SELECT format('CREATE ROLE oksana_app LOGIN PASSWORD %L', :'app_password')
  \gexec
  \unset app_password
\endif
SQL

previous_number=
for migration do
  version=$(basename "$migration" .sql)
  case "$version" in
    *[!a-z0-9_]*)
      echo "Invalid migration name: $version" >&2
      exit 1
      ;;
    [0-9][0-9][0-9]_?*) ;;
    *)
      echo "Use a three-digit prefix for migration: $version" >&2
      exit 1
      ;;
  esac
  number=${version%%_*}
  if [ "$number" = "$previous_number" ]; then
    echo "Duplicate migration number: $number" >&2
    exit 1
  fi
  previous_number=$number
  checksum=$(sha256sum "$migration")
  checksum=${checksum%% *}

  {
    printf '%s\n' "\\set version '$version'" "\\set checksum '$checksum'"
    cat <<'SQL'
SELECT
  NOT EXISTS (
    SELECT FROM oksana_migrations.applied WHERE version = :'version'
  ) AS pending,
  EXISTS (
    SELECT FROM oksana_migrations.applied
    WHERE version = :'version' AND checksum <> :'checksum'
  ) AS changed
\gset
\if :changed
  \warn Applied migration has changed: :version
  DO $$ BEGIN RAISE EXCEPTION 'Applied migration checksum differs'; END; $$;
\endif
\if :pending
  \echo Applying :version
SQL
    printf '%s\n' "\\i '$migration'"
    cat <<'SQL'
  INSERT INTO oksana_migrations.applied (version, checksum)
  VALUES (:'version', :'checksum');
\endif
SQL
  } >>"$manifest"
done

psql -X -w --set=ON_ERROR_STOP=1 --single-transaction --file="$manifest"
