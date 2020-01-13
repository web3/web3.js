#!/usr/bin/env bash

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

# Start ganache
sh ./scripts/e2e.ganache.start.sh

# Migrate contracts
truffle migrate

# Start ENS e2e tests
GANACHE=true nyc --no-clean --silent _mocha -- \
  --reporter spec \
  --fgrep 'ENS [ @E2E ]'
