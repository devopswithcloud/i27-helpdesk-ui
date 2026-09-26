#!/usr/bin/env bash
# Creates/updates the i27-ui-env Secret from .env.local and rolls the deployment.
# Run from the i27-helpdesk-ui directory:
#   bash k8s/secrets.sh

set -euo pipefail

kubectl create secret generic i27-ui-env \
  --from-env-file=.env.local \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl rollout restart deployment/i27-ui 2>/dev/null || true
