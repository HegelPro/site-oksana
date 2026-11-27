#!/bin/sh
set -efu
set -- ${SSH_ORIGINAL_COMMAND:-}
if [ "$#" -ne 4 ] || [ "$1" != deploy ]; then
  echo "Only the release command is available." >&2
  exit 1
fi
exec sudo -n /usr/local/sbin/site-oksana-release "$@"
