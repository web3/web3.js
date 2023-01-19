#!/usr/bin/env bash

# --------------------------------------------------------------------
# Runs mocha tests tagged 'e2e' using an insta-mining ganache client
# --------------------------------------------------------------------

# Exit immediately on error
set -o errexit

# Run cleanup on exit
trap cleanup EXIT

cleanup() {
  if [ -n "$client" ]; then
    kill -9 $client
  fi
}

echo " "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "E2E: ganache insta-mining                "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo " "

# Launch ganache, track its PID and wait until port is open
npx ganache --miner.instamine eager --miner.blockTime 0.5 --server.ws true > /dev/null &
client=$!
npx wait-port 8545

# Test
GANACHE=true npx nyc --no-clean --silent _mocha -- \
  --reporter spec \
  --require ts-node/register \
  --grep 'E2E' \
  --timeout 5000 \
  --exit
