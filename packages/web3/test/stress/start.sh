#!/usr/bin/env bash
. scripts/env.sh

export WEB3_SYSTEM_TEST_BACKEND="geth"
export TS_NODE_PREFER_TS_EXTS=true

./scripts/geth_binary.sh stressStart

yarn generate:accounts

export WEB3_SYSTEM_TEST_PROVIDER=$IPC_PATH
npx ts-node ./packages/web3/test/stress/index.ts

export WEB3_SYSTEM_TEST_PROVIDER=ws://127.0.0.1:8545
npx ts-node ./packages/web3/test/stress/index.ts

./scripts/geth_binary.sh stop
