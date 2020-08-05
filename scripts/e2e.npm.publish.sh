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
npm install -g verdaccio@4.4.4
npm install -g npm-auth-to-token@1.0.0
npm install -g lerna@^3.20.2
npm install -g typescript@^3.9.5
npm install -g webpack@^4.44.1 webpack-cli@^3.3.12 clean-webpack-plugin@^3.0.0

# Launch npm proxy registry and save pid to kill server (req. in Windows env)
verdaccio --config verdaccio.yml &
VERDACCIO_PID=$!
echo "VERDACCIO_PID=$VERDACCIO_PID" > verdaccio_pid

npx wait-port 4873

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

# Lerna version
lerna version minor \
  --force-publish=* \
  --no-git-tag-version \
  --no-push \
  --yes

# Set identity prior to publishing (necessary for Windows)
git config user.email "you@example.com"
git config user.name "Your Name"

# Commit changes because lerna checks git before
git commit -a -m 'virtual-version-bump'

# Lerna publish to e2e tag
lerna publish from-package \
  --dist-tag e2e \
  --registry http://localhost:4873 \
  --ignore-scripts \
  --yes

