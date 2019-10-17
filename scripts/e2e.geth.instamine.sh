#!/usr/bin/env bash

# --------------------------------------------------------------------
# Runs mocha tests tagged 'e2e' using an insta-mining geth dev client
# --------------------------------------------------------------------


# Exit immediately on error
set -o errexit

# Run cleanup on exit
trap cleanup EXIT

cleanup(){
  docker stop geth-client
}

echo " "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "E2E: geth insta-mining (requires docker) "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo " "

# Launch client w/ two unlocked accounts.
# + accounts[0] default geth unlocked bal = ~infinity
# + accounts[1] unlocked, bal=50 eth, signing password = 'left-hand-of-darkness'
geth-dev-assistant --accounts 1 --tag 'stable'

# Test
GETH_INSTAMINE=true istanbul cover _mocha -- \
  --reporter spec \
  --grep 'E2E' \
  --timeout 15000 \
  --exit

# Copy cov for this run to a temp file we can combine later and send to coveralls
if [ "$CI" = true ]; then
  cp coverage/coverage.raw.json .cov_geth_insta.json
fi

