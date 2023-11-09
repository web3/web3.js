#!/usr/bin/env bash
. scripts/env.sh

export WEB3_SYSTEM_TEST_BACKEND="geth"

./scripts/geth_binary.sh stressStart

yarn generate:accounts

export WEB3_SYSTEM_TEST_PROVIDER=$IPC_PATH
node ./scripts/stressTests/data/index.js

export WEB3_SYSTEM_TEST_PROVIDER=ws://127.0.0.1:8545
node ./scripts/stressTests/data/index.js

./scripts/geth_binary.sh stop
