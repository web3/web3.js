#!/usr/bin/env bash

# --------------------------------------------------------------------------------
# NB: This script temporarily removed from CI while truffle remains on Web3@1.2.1.
#     To re-enable, add a `e2e_truffle` job to the matrix in `.github/workflows/test.yml`.
# --------------------------------------------------------------------------------

# -------------------------------------------------------------------------
# Run @truffle/contract's unit tests using a candidate branch of web3
# which has been published to a proxy npm registry in `e2e.npm.publish.sh`
# -------------------------------------------------------------------------

# Exit immediately on error
set -o errexit

# Install test specific dependencies
npm install -g geth-dev-assistant@0.1.3

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
