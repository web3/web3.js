#!/usr/bin/env bash

# This script installs Web3 from virtual registry in a
# Windows env and runs some simple Web3 calls.

# Exit immediately on error
set -o errexit

echo "Node version"
node --version
# Setup mock project to install web3 from virtual registry
mkdir blackbox_test_app
cp scripts/js/basic_usage.ts blackbox_test_app/basic_usage.ts
cd blackbox_test_app

# Install web3 as dep
npm init --yes
npm install cross-fetch
npm install web3@alpha web3-core@alpha web3-types@alpha --save --registry http://localhost:4873
npm list --depth=0
ts-node basic_usage.ts

# Shutdown verdaccio server
cd ..
source verdaccio_pid
kill -9 $VERDACCIO_PID

# delete temp project
rm -rf blackbox_test_app