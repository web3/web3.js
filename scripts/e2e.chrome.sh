#!/usr/bin/env bash

# -------------------------------------------------------------------------------------
# Runs mocha tests tagged 'e2e' vs chrome headless + insta-mining ganache client
# -------------------------------------------------------------------------------------

# Exit immediately on error
set -o errexit

# Run cleanup on exit
trap cleanup EXIT

cleanup() {
    processID=`lsof -Fp -i:8545| grep '^p'`
    kill -9 ${processID##p}
}

echo " "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "E2E: chrome headless browser             "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo " "

# Launch ganache, track its PID and wait until port is open
npx ganache --miner.instamine eager --miner.blockTime 0.5 --server.ws true > /dev/null &
client=$!
npx wait-port 8545

# Test
npx karma start \
  --single-run \
  --browsers ChromeHeadless
