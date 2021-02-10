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
GANACHE=true nyc --no-clean --silent _mocha -- \
  --reporter spec \
  --require ts-node/register \
  --grep "E2E|should return instance of StateManager on start|should handle events properly via the data event handler|should call get whisper version (shh_version)" \
  --timeout 5000 \
  --exit
