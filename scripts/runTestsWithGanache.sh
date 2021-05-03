#!/usr/bin/env bash

# --------------------------------------------------------------------
# Runs insta-mining ganache client
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
echo "Ganache insta-mining                     "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo " "

# Launch ganache, track its PID and wait until port is open
yarn ganache-cli --noVMErrorsOnRPCResponse --mnemonic='receive wool wrestle embark enhance match thought popular note season letter duck' > /dev/null &
client=$!
yarn wait-port 8545

# Test
yarn lerna run test
