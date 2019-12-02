#!/usr/bin/env bash

# --------------------------------------------------------------------
# Publishes web3 to a local npm proxy registry in CI so the package
# can be E2E tested by installing it in another project
# --------------------------------------------------------------------

# Exit immediately on error
set -o errexit

if [ -z "$CI" ]; then

  echo "======================================================================"
  echo "This script publishes web3 to an npm proxy registry. Only run in CI."
  echo "======================================================================"

  exit 1

fi

# To model publication correctly, this script needs to run
# without web3's dev deps being installed. It installs
# what it needs here.
npm install -g verdaccio@4.3.4
npm install -g npm-auth-to-token@1.0.0
npm install -g geth-dev-assistant@0.1.3
npm install -g lerna@3.18.3

# Launch npm proxy registry
verdaccio --config verdaccio.yml & npx wait-port 4873

# `npm add user`
curl -XPUT \
   -H "Content-type: application/json" \
   -d '{ "name": "test", "password": "test" }' \
   'http://localhost:4873/-/user/org.couchdb.user:test'

# `npm login`
npm-auth-to-token \
  -u test \
  -p test \
  -e test@test.com \
  -r http://localhost:4873

# Prep branch for Lerna's git-checks
BRANCH=$TRAVIS_PULL_REQUEST_BRANCH
if [ -z "$BRANCH" ]; then

  BRANCH=$TRAVIS_BRANCH

fi

git checkout $BRANCH --

# Lerna version
lerna version patch \
  --force-publish=* \
  --no-git-tag-version \
  --no-push \
  --allow-branch $BRANCH \
  --yes

# Commit changes because lerna checks git before
git commit -a -m 'virtual-version-bump'

# Lerna publish to e2e tag
lerna publish from-package \
  --dist-tag e2e \
  --registry http://localhost:4873 \
  --yes

