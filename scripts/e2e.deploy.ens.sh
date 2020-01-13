#!/usr/bin/env bash

# Exit immediately on error
set -o errexit

# -----------------------
# Set up truffle project
# -----------------------

# Install truffle and the required ENS npm packages
npm install truffle
npm install @ensdomains/ens
npm install @ensdomains/resolver

# Create a truffle project
truffle init --force

# Remove the default migration file
rm -rf ./migrations/1_initial_migration.js

# Move ENS migration to migrations folder
cp ./scripts/js/ens/1_initial_migration.js ./migrations/

# Overwrite truffle config
rm -rf ./truffle-config.js
cp ./scripts/js/ens/truffle-config.js ./

# --------------
# Start ganache
# --------------

# Run cleanup on exit
trap cleanup EXIT

cleanup() {
  if [ -n "$client" ]; then
    kill -9 $client
  fi
}

# Launch ganache, track its PID and wait until port is open
npx ganache-cli --noVMErrorsOnRPCResponse > /dev/null &
client=$!
npx wait-port 8545

echo " "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Ganache started                          "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo " "

# ------------------
# Migrate contracts
# ------------------

truffle migrate

# --------------------
# Start ENS e2e Tests
# --------------------
GANACHE=true nyc --no-clean --silent _mocha -- \
  --reporter spec \
  --fgrep 'ENS [ @E2E ]'
