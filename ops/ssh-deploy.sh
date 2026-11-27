#!/bin/sh
set -efu
case ${1:-production} in
  production) release=/usr/local/sbin/site-oksana-release ;;
  development) release=/usr/local/sbin/site-oksana-development-release ;;
  *) exit 1 ;;
esac
set -- ${SSH_ORIGINAL_COMMAND:-}
if [ "$#" -ne 4 ] || [ "$1" != deploy ]; then
  echo "Only the release command is available." >&2
  exit 1
fi
exec sudo -n "$release" "$@"
