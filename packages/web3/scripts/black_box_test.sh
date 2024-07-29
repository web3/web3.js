#!/usr/bin/env bash

ORIGARGS=("$@")

. scripts/env.sh

helpFunction() {
	echo "Usage: $0 <hardhat | geth | infura> <http | ws>"
	exit 1 # Exit script after printing help
}

BACKEND=${ORIGARGS[0]}
MODE=${ORIGARGS[1]}
PROVIDER_URL=${ORIGARGS[2]}

SUPPORTED_BACKENDS=("geth" "infura" "hardhat")
SUPPORTED_MODE=("http" "ws")

if [[ ! " ${SUPPORTED_BACKENDS[*]} " =~ " ${BACKEND} " ]]; then
	helpFunction
fi

if [[ ! " ${SUPPORTED_MODE[*]} " =~ " ${MODE} " ]]; then
	helpFunction
fi

echo "RPC client Provider: " $BACKEND
echo "RPC client Protocol: " $MODE

export WEB3_SYSTEM_TEST_PROVIDER="$MODE://localhost:$WEB3_SYSTEM_TEST_PORT"
export WEB3_SYSTEM_TEST_BACKEND=$BACKEND

cd test/esm_black_box
yarn --update-checksums
yarn

if [[ ${BACKEND} == "infura" ]]
then
    if [ ! $INFURA_MAINNET_HTTP ] || [ ! $INFURA_MAINNET_WS ]
    then
        echo "No Infura provider URL specified"
        exit 1
    elif [ $MODE == "http" ]
    then
        WEB3_SYSTEM_TEST_PROVIDER=$INFURA_MAINNET_HTTP
    else
        WEB3_SYSTEM_TEST_PROVIDER=$INFURA_MAINNET_WS
    fi
fi
yarn "test:$BACKEND:$MODE"

cd test/cjs_black_box
yarn --update-checksums
yarn

if [[ ${BACKEND} == "infura" ]]
then
    if [ ! $INFURA_MAINNET_HTTP ] || [ ! $INFURA_MAINNET_WS ]
    then
        echo "No Infura provider URL specified"
        exit 1
    elif [ $MODE == "http" ]
    then
        WEB3_SYSTEM_TEST_PROVIDER=$INFURA_MAINNET_HTTP
    else
        WEB3_SYSTEM_TEST_PROVIDER=$INFURA_MAINNET_WS
    fi
fi
yarn "test:$BACKEND:$MODE"
