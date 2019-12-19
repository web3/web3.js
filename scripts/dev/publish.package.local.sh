#!/usr/bin/env bash

# --------------------------------------------------------------------
# Publishes web3 to a local npm proxy registry for testing purposes
# --------------------------------------------------------------------

echo -e "\033[0;31mBe sure the local registry is running!\033[0m"

# Prepare package
sh ./scripts/dev/prepare.package.sh

# Go to tmp package
cd ./package/

# Unpublish the local web3 package
npm unpublish web3@$(node -p "require('./package.json').version") --registry=http://localhost:4873

# Publish package to local verdaccio registry
npm publish --registry=http://localhost:4873
