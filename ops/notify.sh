#!/usr/bin/env bash
set -Eeuo pipefail
source /etc/site-oksana/backup.env
[[ ${OPS_ALERT_TO:-} =~ ^[^[:space:]@]+@[^[:space:]@]+$ ]]
unit=${1:?systemd service required}
printf 'To: %s\nSubject: site-oksana operation failed (%s)\n\nInspect systemctl status %s on the VPS.\n' \
  "$OPS_ALERT_TO" "$unit" "$unit" | /usr/sbin/sendmail -t
