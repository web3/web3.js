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
npx ganache-cli --noVMErrorsOnRPCResponse > /dev/null &
client=$!
npx wait-port 8545

# Test
GANACHE=true nyc _mocha -- \
  --reporter spec \
  --grep 'E2E' \
  --timeout 5000 \
  --exit

# Copy cov for this run to a temp file we can combine later and send to coveralls
if [ "$CI" = true ]; then
  cp coverage/coverage-final.json .cov_ganache.json
fi
