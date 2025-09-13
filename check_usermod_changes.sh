#!/usr/bin/env bash
set -euo pipefail

REMOTE=${1:-origin}
TARGET=${2:-BackendBranch}
CURRENT=$(git rev-parse --abbrev-ref HEAD)

echo "Fetching ${REMOTE}..."
git fetch "${REMOTE}" --prune

echo "Checking for changes in Backend/models/ between ${CURRENT} and ${REMOTE}/${TARGET}..."
# Show files changed between current branch and remote BackendBranch
CHANGED=$(git diff --name-only "${REMOTE}/${TARGET}...${CURRENT}" || true)

if [ -z "$CHANGED" ]; then
  echo "No differences detected between ${CURRENT} and ${REMOTE}/${TARGET}."
  exit 0
fi

echo "All changed files:"
echo "$CHANGED"
echo
MODEL_CHANGES=$(echo "$CHANGED" | grep -E '^Backend/models/' || true)

if [ -n "$MODEL_CHANGES" ]; then
  echo "ERROR: Detected changes in Backend/models/:"
  echo "$MODEL_CHANGES"
  echo
  echo "To restore user modules from remote BackendBranch run:"
  echo "  git checkout ${REMOTE}/${TARGET} -- Backend/models/"
  echo "  git add Backend/models/"
  echo "  git commit -m \"Restore Backend/models/ from ${REMOTE}/${TARGET}\""
  exit 2
else
  echo "OK: No changes in Backend/models/ — user modules are untouched."
  exit 0
fi
