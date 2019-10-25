#!/usr/bin/env bash

# -------------------------------------------------------------------------
# Run @truffle/contract's unit tests using a candidate branch of web3
# which has been published to a proxy npm registry in `e2e.npm.publish.sh`
# -------------------------------------------------------------------------

# Exit immediately on error
set -o errexit

# Launch geth
npm run geth

# Install truffle
git clone https://github.com/trufflesuite/truffle.git
cd truffle
yarn bootstrap

# @truffle/contract
cd packages/contract

# Uninstall / re-install web3
yarn remove web3

npm install web3@e2e \
  --registry http://localhost:4873 \
  --force

# Geth tests
GETH=true npm test
