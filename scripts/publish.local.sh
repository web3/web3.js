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

# --------------------------------------------------------------------
# Prepare package folder
# --------------------------------------------------------------------

# Creates temporary package folder
rm -rf ./package
mkdir package

# Copy internal files to package
cp -r ./internal ./package/

# Copy public files to package
cp -r ./public/* ./package/

# Copy `package.json` to package
cp ./package.json ./package/package.json

# Copy `README.md` to package
cp ./README.md ./package/README.md

# Copy `tsconfig.prod.json`
cp ./tsconfig.prod.json ./package/

# Go to package directory
cd ./package

# Build package
npm run build:prod

# Remove not required files
rm -rf ./config
rm -rf ./core
rm -rf ./ethereum
rm -rf ./internal
rm -rf ./index.js
rm -rf ./tsconfig.prod.json

# Move `dist` files to root folder and delete the `dist` folder
mv ./dist/package/* ./
rm -rf ./dist

# --------------------------------------------------------------------
# Publish package
# --------------------------------------------------------------------

# Unpublish the local web3 package
npm unpublish web3@$(node -p "require('./package.json').version") --registry=http://localhost:4873

# Publish package to local verdaccio registry
npm publish --registry=http://localhost:4873
