#!/usr/bin/env bash

# --------------------------------------------------------------------
# Prepares a small test site that uses the packages/web3/dist/min
# --------------------------------------------------------------------

if [ -z "$CI" ]; then

  echo "======================================================================"
  echo "This script prepares a test site for Netlify. Only run in CI.         "
  echo "======================================================================"

  exit 1

fi

echo "======================================================================"
echo "Preparing test site for web3-staging.netlify.app                      "
echo "======================================================================"

# Mark file with current commit and branch
sed -i "s|__COMMIT_HASH__|$COMMIT_REF|g" scripts/html/index.html
sed -i "s|__BRANCH__|$BRANCH|g" scripts/html/index.html

cp packages/web3/dist/web3.min.js scripts/html