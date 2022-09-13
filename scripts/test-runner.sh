#!/usr/bin/env bash

ORIGARGS=("$@")

. scripts/env.sh

helpFunction() {
	echo "Usage: $0 <geth | ganache> <http | ws> [node | electron | firefox | chrome]"
	exit 1 # Exit script after printing help
}

BACKEND=${ORIGARGS[0]}
MODE=${ORIGARGS[1]}
ENGINE=${ORIGARGS[2]}

SUPPORTED_BACKENDS=("geth" "ganache")
SUPPORTED_MODE=("http" "ws" "ipc")
# if you will add a new browser please also add it in the system_test_utils.ts => isBrowser
SUPPORTED_ENGINES=("node" "electron" "firefox" "chrome" "")

if [[ ! " ${SUPPORTED_BACKENDS[*]} " =~ " ${BACKEND} " ]]; then
	helpFunction
fi

if [[ ! " ${SUPPORTED_MODE[*]} " =~ " ${MODE} " ]]; then
	helpFunction
fi

if [[ ! " ${SUPPORTED_ENGINES[*]} " =~ " ${ENGINE} " ]]; then
	helpFunction
fi

echo "Node software used for tests: " $BACKEND
echo "Node running on: " "$MODE://127.0.0.1:$WEB3_SYSTEM_TEST_PORT"

export WEB3_SYSTEM_TEST_PROVIDER="$MODE://127.0.0.1:$WEB3_SYSTEM_TEST_PORT"
export WEB3_SYSTEM_TEST_BACKEND=$BACKEND
export WEB3_SYSTEM_TEST_ENGINE=$ENGINE

TEST_COMMAND=""

if [[ $MODE == "ipc" ]]; then
        export WEB3_SYSTEM_TEST_PROVIDER=$IPC_PATH
        BACKEND=geth-binary
fi

if [[ $ENGINE == "node" ]] || [[ $ENGINE == "" ]]; then
	TEST_COMMAND="test:integration"
else
	TEST_COMMAND="lerna run test:e2e:$ENGINE --stream"
fi


yarn "$BACKEND:start:background" && yarn generate:accounts && yarn $TEST_COMMAND && yarn "$BACKEND:stop"
