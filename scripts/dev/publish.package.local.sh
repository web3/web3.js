#!/usr/bin/env bash

# --------------------------------------------------------------------
# Publishes web3 to a local npm proxy registry for testing purposes
# --------------------------------------------------------------------

# Unpublish the local web3 package
npm unpublish web3@$(node -p "require('./package.json').version") --registry=http://localhost:4873

# Publish package to local verdaccio registry
npm publish --registry=http://localhost:4873
