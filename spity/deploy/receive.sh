#!/usr/bin/env bash
# Installed once on the VPS; the Actions SSH key may only invoke this receiver.
set -Eeuo pipefail
umask 077

if [[ "${SSH_ORIGINAL_COMMAND:-}" != "deploy" ]]; then
  echo 'Only the Spity deployment command is allowed.' >&2
  exit 1
fi

root=/opt/spity
mkdir -p "$root/incoming"
exec 9>"$root/deploy.lock"
flock --nonblock 9 || { echo 'A Spity deployment is already running.' >&2; exit 1; }
incoming=$(mktemp -d "$root/incoming/release.XXXXXXXX")
cleanup() {
  # Only this invocation's private temporary directory, never releases or data.
  case "$incoming" in "$root"/incoming/release.*) rm -rf -- "$incoming" ;; esac
}
trap cleanup EXIT
tar --extract --gzip --no-same-owner --no-same-permissions --directory "$incoming"
export DOCKER_CONFIG="$incoming/docker-auth"
mkdir -p "$DOCKER_CONFIG"
node "$incoming/deploy-vps.mjs" "$root" "$incoming"
