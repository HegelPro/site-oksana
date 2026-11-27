#!/usr/bin/env bash
set -Eeuo pipefail

branch=${1:-}
[[ $# == 1 && ( $branch == main || $branch == develop ) ]]
current=$(gh api "repos/$GITHUB_REPOSITORY/git/ref/heads/$branch" --jq '.object.sha')
if [[ $current != "$GITHUB_SHA" ]]; then
  echo "A newer commit superseded this release."
  exit 0
fi

if ! [[ $DEPLOY_HOST =~ ^[A-Za-z0-9.:-]+$ && $DEPLOY_PORT =~ ^[0-9]{1,5}$ &&
        $DEPLOY_USER =~ ^[a-z_][a-z0-9_-]+$ && -n $DEPLOY_SSH_KEY && -n $DEPLOY_KNOWN_HOSTS ]]; then
  echo "::error::Configure the SSH host, port, user, private key and known_hosts for $branch."
  exit 1
fi
[[ $WEB_DIGEST =~ ^sha256:[a-f0-9]{64}$ && $MIGRATE_DIGEST =~ ^sha256:[a-f0-9]{64}$ ]]

umask 077
ssh_dir=$(mktemp -d)
trap 'rm -f "$ssh_dir/key" "$ssh_dir/known_hosts"; rmdir "$ssh_dir"' EXIT
printf '%s\n' "$DEPLOY_SSH_KEY" > "$ssh_dir/key"
printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > "$ssh_dir/known_hosts"
ssh -i "$ssh_dir/key" -l "$DEPLOY_USER" -p "$DEPLOY_PORT" \
  -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes \
  -o "UserKnownHostsFile=$ssh_dir/known_hosts" -o ConnectTimeout=10 \
  -o ServerAliveInterval=15 -o ServerAliveCountMax=3 \
  -- "$DEPLOY_HOST" deploy "$GITHUB_SHA" "$WEB_DIGEST" "$MIGRATE_DIGEST"
