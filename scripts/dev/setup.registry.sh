#!/usr/bin/env bash

# --------------------------------------------------
# Does set local registry up for the dev-environment
# --------------------------------------------------

# Launch local registry
sh ./scripts/dev/start.registry.sh

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


echo -e "\033[0;32mLocal registry successfully configured!\033[0m"
