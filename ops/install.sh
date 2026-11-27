#!/usr/bin/env bash
set -Eeuo pipefail
[[ $EUID == 0 ]] || { echo "Run ops/install.sh as root."; exit 1; }
root=$(cd -- "$(dirname -- "$0")/.." && pwd)
config=/etc/site-oksana

install -d -m 0755 "$config" "$config/privacy"
install -d -m 0700 /var/lib/site-oksana
install -m 0644 "$root/compose.yaml" "$root/ops/compose.production.yaml" "$root/Caddyfile" "$config/"
[[ -e $config/production.env ]] || install -m 0600 "$root/ops/production.env.example" "$config/production.env"
[[ -e $config/backup.env ]] || install -m 0600 "$root/ops/backup.env.example" "$config/backup.env"
install -m 0755 "$root/ops/release.sh" /usr/local/sbin/site-oksana-release
install -m 0755 "$root/ops/ssh-deploy.sh" /usr/local/sbin/site-oksana-ssh
install -m 0755 "$root/ops/notify.sh" /usr/local/sbin/site-oksana-notify
install -m 0644 "$root"/ops/systemd/* /etc/systemd/system/
systemctl daemon-reload
