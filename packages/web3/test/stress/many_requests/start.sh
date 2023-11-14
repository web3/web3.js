#!/usr/bin/env bash
. scripts/env.sh

export WEB3_SYSTEM_TEST_BACKEND="geth"

./scripts/geth_binary.sh stressStart
export PARALLEL_COUNT=10
export WEB3_SYSTEM_TEST_PROVIDER=$IPC_PATH
node ./packages/web3/test/stress/many_requests/index.js
./scripts/geth_binary.sh stop

./scripts/geth_binary.sh stressStart
export PARALLEL_COUNT=1000
export WEB3_SYSTEM_TEST_PROVIDER=ws://127.0.0.1:8545
node ./packages/web3/test/stress/many_requests/index.js


./scripts/geth_binary.sh stressStart
export PARALLEL_COUNT=100
export WEB3_SYSTEM_TEST_PROVIDER=http://127.0.0.1:8545
node ./packages/web3/test/stress/many_requests/index.js
./scripts/geth_binary.sh stop


request
