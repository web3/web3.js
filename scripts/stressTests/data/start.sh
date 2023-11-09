#!/usr/bin/env bash
. scripts/env.sh

yarn geth-binary:start:background
export WEB3_SYSTEM_TEST_PROVIDER=$IPC_PATH
export WEB3_SYSTEM_TEST_BACKEND="geth"
yarn generate:accounts
node ./scripts/stressTests/data/index.js

export WEB3_SYSTEM_TEST_PROVIDER=ws://127.0.0.1:8545
node ./scripts/stressTests/data/index.js

yarn geth-binary:stop
