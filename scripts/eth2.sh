#!/usr/bin/env bash

# --------------------------------------------------------------------
# 
# --------------------------------------------------------------------


# Exit immediately on error
set -o errexit

# Run cleanup on exit
trap cleanup EXIT

cleanup(){
  docker stop $(docker ps -a -q)
}

echo " "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "ETH2: Lighthouse Node (requires docker)    "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo " "

nohup docker run -p 9000:9000 -p 127.0.0.1:5052:5052 -v ${HOME}/.lighthouse:/root/.lighthouse1 sigp/lighthouse:v2.1.5 lighthouse --network mainnet beacon --http --http-address 0.0.0.0 > /dev/null 2>&1 &

npm run build

# Test
npm --prefix ./packages/web3-eth2-core run test
npm --prefix ./packages/web3-eth2-beaconchain run test
