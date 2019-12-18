#!/usr/bin/env bash

# --------------------------------------------------
# Does set local registry up for the dev-environment
# --------------------------------------------------

# stop registry if already running
sh ./scripts/dev/stop.registry.sh

# Launch local registry
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

echo -e "\033[1;33mBe aware to not forget to shut down the registry if no longer in usage with: \nnpm run stop:registry"