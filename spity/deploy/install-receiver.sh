#!/usr/bin/env bash
# One-time setup through the administrator's existing SSH access.
# Does not start containers, run migrations, reset data or change nginx.
set -Eeuo pipefail
umask 077
bundle=${1:?Usage: bash install-receiver.sh BUNDLE_DIRECTORY}
root=/opt/spity
[[ "$(id -un)" == ubuntu ]] || { echo 'Run as the existing ubuntu deploy user.' >&2; exit 1; }
[[ -f "$root/repo/spity/.env.production" ]] || { echo 'Existing production env missing.' >&2; exit 1; }
[[ ! -e "$root/automation/receive.sh" && ! -e "$root/automation/production.json" ]] || { echo 'Receiver configuration already exists; inspect before updating it.' >&2; exit 1; }
key=$(<"$bundle/actions.pub")
key=${key%$'\r'}
[[ "$key" =~ ^ssh-ed25519\ [A-Za-z0-9+/=]+\ spity-github-actions$ ]] || { echo 'Unexpected public key.' >&2; exit 1; }
install -d -m 700 "$root/automation" "$root/incoming" "$root/releases" "$root/backups"
install -m 700 "$bundle/receive.sh" "$root/automation/receive.sh"
install -m 600 "$bundle/production.json.example" "$root/automation/production.json"
install -d -m 700 /home/ubuntu/.ssh
authorized=/home/ubuntu/.ssh/authorized_keys
if [[ -f "$authorized" ]]; then
  cp -p "$authorized" "$root/automation/authorized_keys.before-spity"
fi
touch "$authorized"
chmod 600 "$authorized"
printf 'restrict,command="/opt/spity/automation/receive.sh" %s\n' "$key" >> "$authorized"
echo 'Spity receiver installed. Existing applications and data were not modified.'
