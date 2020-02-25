#!/usr/bin/env bash

# This script installs Web3 from virtual registry in a
# Windows env and runs some simple Web3 calls.

# Exit immediately on error
set -o errexit

# Setup mock project to install web3 from virtual registry
mkdir windows_test
cp scripts/js/basic_usage.js windows_test/basic_usage.js
cd windows_test

# Install web3 as dep
npm init --yes
npm install web3@e2e --save --registry http://localhost:4873
node ./basic_usage.js

# Shutdown verdaccio server
cd ..
source verdaccio_pid
kill -9 $VERDACCIO_PID

# Debugging...
ps -ef
