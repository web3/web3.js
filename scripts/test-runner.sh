#!/usr/bin/env bash

ORIGARGS=("$@")

. scripts/env.sh

helpFunction() {
	echo "Usage: $0 <geth | hardhat | sepolia | mainnet> <http | ws> [node | electron | firefox | chrome] [coverage | sync]"
	exit 1 # Exit script after printing help
}
BACKEND=${ORIGARGS[0]}
MODE=${ORIGARGS[1]}
ENGINE=${ORIGARGS[2]}
TEST_OPTION=${ORIGARGS[3]}

SUPPORTED_BACKENDS=("geth" "hardhat" "sepolia" "mainnet" "geth-manual")
SUPPORTED_MODE=("http" "ws" "ipc")
# if you will add a new browser please also add it in the system_test_utils.ts => isBrowser
SUPPORTED_ENGINES=("node" "electron" "firefox" "chrome" "")
SUPPORTED_TEST_OPTIONS=("coverage" "sync" "manual" "")

if [[ ! " ${SUPPORTED_BACKENDS[*]} " =~ " ${BACKEND} " ]]; then
	helpFunction
fi

if [[ ! " ${SUPPORTED_MODE[*]} " =~ " ${MODE} " ]]; then
	helpFunction
fi

if [[ ! " ${SUPPORTED_ENGINES[*]} " =~ " ${ENGINE} " ]]; then
	helpFunction
fi

if [[ ! " ${SUPPORTED_TEST_OPTIONS[*]} " =~ " ${TEST_OPTION} " ]]; then
	helpFunction
fi

echo "Node software used for tests: " $BACKEND
echo "Node running on: " "$MODE://127.0.0.1:$WEB3_SYSTEM_TEST_PORT"

export WEB3_SYSTEM_TEST_MODE=$MODE
export WEB3_SYSTEM_TEST_PROVIDER="$MODE://127.0.0.1:$WEB3_SYSTEM_TEST_PORT"
export WEB3_SYSTEM_TEST_BACKEND=$BACKEND
export WEB3_SYSTEM_TEST_ENGINE=$ENGINE

TEST_COMMAND=""

if [[ $MODE == "ipc" ]]; then
        export WEB3_SYSTEM_TEST_PROVIDER=$IPC_PATH
        if [[ $BACKEND != "geth-manual" ]]; then
                BACKEND=geth-binary
        fi
fi



if [[ $ENGINE == "node" ]] || [[ $ENGINE == "" ]]; then
    if [[ $TEST_OPTION == "manual" ]]; then
    	TEST_COMMAND="test:integration:stress"
	elif [[ $TEST_OPTION == "coverage" ]]; then
		TEST_COMMAND="test:coverage:integration"
	elif [[ $BACKEND == "sepolia" || $BACKEND == "mainnet" ]]; then
		TEST_COMMAND="lerna run test:e2e:$BACKEND"
	else
		TEST_COMMAND="test:integration"
	fi
else
     if [[ $TEST_OPTION == "manual" ]]; then
        TEST_COMMAND="lerna run test:e2e:$ENGINE:stress --stream"
    else
	    TEST_COMMAND="lerna run test:e2e:$ENGINE --stream"
	fi
fi


if [[ $BACKEND == "geth" || $BACKEND == "geth-binary" || $BACKEND == "geth-manual" ]]; then
    yarn "$BACKEND:start:background" && yarn generate:accounts && yarn $TEST_COMMAND && yarn "$BACKEND:stop"
elif [[ $BACKEND == "hardhat" ]]; then
    yarn $TEST_COMMAND && yarn "$BACKEND:stop"
else
    yarn $TEST_COMMAND
fi
