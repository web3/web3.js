#!/usr/bin/env bash

ORIGARGS=("$@")

. scripts/env.sh

helpFunction() {
	echo "Usage: $0 <e2e> <ganache | geth | infura> <http | ws> <chrome | firefox | electron>"
	exit 1 # Exit script after printing help
}

TEST_TYPE=${ORIGARGS[0]}
BACKEND=${ORIGARGS[1]}
MODE=${ORIGARGS[2]}
PROVIDER_URL=${ORIGARGS[3]}
BROWSER=${ORIGARGS[4]}

SUPPORTED_TEST_TYPE=("" "e2e")
SUPPORTED_BACKENDS=("ganache" "geth" "infura")
SUPPORTED_MODE=("http" "ws")
SUPPORTED_BROWSERS=("chrome" "firefox" "electron")

if [[ ! " ${SUPPORTED_TEST_TYPE[*]} " =~ " ${TEST_TYPE} " ]]; then
	helpFunction
fi

if [[ ! " ${SUPPORTED_BACKENDS[*]} " =~ " ${BACKEND} " ]]; then
	helpFunction
fi

if [[ ! " ${SUPPORTED_MODE[*]} " =~ " ${MODE} " ]]; then
	helpFunction
fi

if [[ ! " ${SUPPORTED_BROWSERS[*]} " =~ " ${BROWSER} " ]]; then
	helpFunction
fi

echo "RPC client Provider: " $BACKEND
echo "RPC client Protocol: " $MODE

export WEB3_SYSTEM_TEST_PROVIDER="$MODE://localhost:$WEB3_SYSTEM_TEST_PORT"
export WEB3_SYSTEM_TEST_BACKEND=$BACKEND

cd test/black_box
yarn --update-checksums
yarn

TEST_STRING = "test"

if [ $TEST_TYPE == "e2e"]
then
    TEST_STRING = "$TEST_STRING:e2e"
fi

if [[ ${BACKEND} == "infura" ]]
then
    if [ ! $INFURA_HTTP ] || [ ! $INFURA_WSS ]
    then
        echo "No Infura provider URL specified"
        exit 1
    elif [ $MODE == "http" ]
    then
        if [ $TEST_TYPE == "e2e"]
        then
            WEB3_SYSTEM_TEST_PROVIDER=$INFURA_HTTP yarn "$TEST_STRING:$BACKEND:$MODE:$BROWSER"
        else
            WEB3_SYSTEM_TEST_PROVIDER=$INFURA_HTTP yarn "$TEST_STRING:$BACKEND:$MODE"
        fi
    else
        if [ $TEST_TYPE == "e2e"]
        then
            WEB3_SYSTEM_TEST_PROVIDER=$INFURA_WSS yarn "$TEST_STRING:$BACKEND:$MODE:$BROWSER"
        else
            WEB3_SYSTEM_TEST_PROVIDER=$INFURA_WSS yarn "$TEST_STRING:$BACKEND:$MODE"
        fi
    fi
else
    if [ $TEST_TYPE == "e2e"]
    then
        yarn "$TEST_STRING:$BACKEND:$MODE:$BROWSER"
    else
        yarn "$TEST_STRING:$BACKEND:$MODE"
    fi
fi
