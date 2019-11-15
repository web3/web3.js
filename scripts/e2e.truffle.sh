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

yarn config set registry http://localhost:4873

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Updating Web3 across all @truffle  "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

lerna add web3@e2e --registry http://localhost:4873

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Updating @truffle/contract"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"

cd packages/contract

yarn remove web3-core-promievent
yarn remove web3-eth-abi
yarn remove web3-utils

# Geth tests
GETH=true npm test
