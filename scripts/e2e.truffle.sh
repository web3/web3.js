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
echo "Updating @truffle/interface-adapter"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

# @truffle/interface-adapter
cd packages/interface-adapter
yarn remove web3

yarn add web3@e2e \
  --registry http://localhost:4873 \
  --force
  --flat

# @truffle/contract
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Updating @truffle/contract"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>"

cd ../contract
yarn remove web3
yarn remove web3-core-promievent
yarn remove web3-eth-abi
yarn remove web3-utils

yarn add web3@e2e \
  --registry http://localhost:4873 \
  --force

# Geth tests
GETH=true npm test
