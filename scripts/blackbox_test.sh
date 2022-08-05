#!/usr/bin/env bash

# This script installs Web3 from virtual registry
# env and runs some simple Web3 calls.

# Exit immediately on error
set -o errexit

echo "Node version"
node --version

# Setup mock project to install web3 from virtual registry

cp -r fixtures blackbox_test
cd blackbox_test

npm config set loglevel verbose
# Install web3 as dep
npm install --registry http://localhost:4873
npm list --depth=0
ts-node basic_usage.ts

# Shutdown verdaccio server
cd ..
source verdaccio_pid
kill -9 $VERDACCIO_PID

rm -rf blackbox_test/fixtures