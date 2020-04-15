#!/usr/bin/env bash

# --------------------------------------------------------------------
# Publishes a small test site that uses the packages/web3/dist/min
# --------------------------------------------------------------------

if [ -z "$CI" ]; then

  echo "======================================================================"
  echo "This script publishes a test site with surge.sh. Only run in CI."
  echo "======================================================================"

  exit 1

fi

echo "======================================================================"
echo "Publishing test site with surge.sh. See link below.                   "
echo "======================================================================"

# Mark file with current commit and branch
sed -i "s/__COMMIT_HASH__/$TRAVIS_COMMIT/g" scripts/html/index.html
sed -i "s/__BRANCH__/$TRAVIS_PULL_REQUEST_BRANCH/g" scripts/html/index.html

cp packages/web3/dist/web3.min.js scripts/html
cd scripts
(echo "" && exit && cat ) | npx surge --domain sudden-playground.surge.sh html

# Might be running locally in development
rm html/web3.min.js

# Sometimes surge.sh fails with an auth error because it's generated a name which
# is already taken (or something?) This test is just meant to be a visual
# inspection check if/when there are doubts - we don't want it crash CI alot.
exit 0
