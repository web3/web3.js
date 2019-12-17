#!/usr/bin/env bash

# --------------------------------------------------------------------
# Publishes web3 to a local npm proxy registry for testing purposes
# --------------------------------------------------------------------

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

# `tsc`
npm run build

# Creates temporary package folder
mkdir package

# Copy internal dist files to package
cp -r dist/internal package/

# Copy public dist files to package
cp -r dist/public/* package/

# Copy package.json to package
cp ./package.json package/package.json

# Copy README.md to package
cp ./README.md package/README.md

# Go to package directory
cd ./package

# Add module-alias dependency
npm i module-alias --save
rm package-lock.json

# Add module alias config to package.json
npx json -I -f package.json -e 'this._moduleAliases={"internal": "./internal"}'

# Publish package to local verdaccio registry
npm publish --registry=http://localhost:4873

# Remove temporary package folder
rm -rf ./package
