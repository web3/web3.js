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

cp packages/web3/dist/web3.min.js scripts/html

cd scripts/html

BUNDLE_SIZE=$(wc -c web3.min.js | awk '{print $1}')

# Mark file with current commit, branch, and bundle size.
sed -i "s|__COMMIT_HASH__|$COMMIT_REF|g" index.html
sed -i "s|__BRANCH__|$BRANCH|g" index.html
sed -i "s|__BUNDLE_SIZE__|$BUNDLE_SIZE|g" index.html

