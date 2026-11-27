#!/usr/bin/env bash
set -Eeuo pipefail
[[ $EUID == 0 ]] || { echo "Run ops/install.sh as root."; exit 1; }
root=$(cd -- "$(dirname -- "$0")/.." && pwd)
config=/etc/site-oksana

install -d -m 0755 "$config" "$config/privacy" "$config/caddy-sites"
install -d -m 0700 /var/lib/site-oksana /var/lib/site-oksana-development
install -m 0644 "$root/compose.yaml" "$root/ops/compose.production.yaml" \
  "$root/ops/compose.development.yaml" "$root/ops/development-policy.md" \
  "$root/ops/development.caddy.example" "$root/Caddyfile" "$config/"
[[ -e $config/production.env ]] || install -m 0600 "$root/ops/production.env.example" "$config/production.env"
[[ -e $config/development.env ]] || install -m 0600 "$root/ops/development.env.example" "$config/development.env"
[[ -e $config/backup.env ]] || install -m 0600 "$root/ops/backup.env.example" "$config/backup.env"
install -m 0755 "$root/ops/release.sh" /usr/local/sbin/site-oksana-release
install -m 0755 "$root/ops/development-release.sh" /usr/local/sbin/site-oksana-development-release
install -m 0755 "$root/ops/ssh-deploy.sh" /usr/local/sbin/site-oksana-ssh
install -m 0755 "$root/ops/notify.sh" /usr/local/sbin/site-oksana-notify
install -m 0644 "$root"/ops/systemd/* /etc/systemd/system/
docker network inspect site-oksana-edge >/dev/null 2>&1 || docker network create site-oksana-edge >/dev/null
systemctl daemon-reload
