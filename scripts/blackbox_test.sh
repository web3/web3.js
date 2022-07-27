#!/usr/bin/env bash

# This script installs Web3 from virtual registry in a
# Windows env and runs some simple Web3 calls.

# Exit immediately on error
set -o errexit

echo "Node version"
node --version
# Setup mock project to install web3 from virtual registry
mkdir blackbox_test_app
cp scripts/js/basic_usage.js blackbox_test_app/basic_usage.js
cd blackbox_test_app

# Install web3 as dep
npm install -g create-esnext

npm init --yes esnext
npm install web3 --save --registry http://localhost:4873
node basic_usage.js

# Shutdown verdaccio server
cd ..
source verdaccio_pid
kill -9 $VERDACCIO_PID

# delete temp project
rm -rf blackbox_test_app