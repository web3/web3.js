#!/usr/bin/env bash

ORIGARGS=("$@")

. scripts/env.sh

# Exit immediately on error
set -o errexit

helpFunction() {
	echo "Usage: $0 <ganache | geth | infura> <http | ws>"
	exit 1 # Exit script after printing help
}

BACKEND=${ORIGARGS[0]}
MODE=${ORIGARGS[1]}

SUPPORTED_BACKENDS=("ganache" "geth" "infura")
SUPPORTED_MODE=("http" "ws")

if [[ ! " ${SUPPORTED_BACKENDS[*]} " =~ " ${BACKEND} " ]]; then
	helpFunction
fi

if [[ ! " ${SUPPORTED_MODE[*]} " =~ " ${MODE} " ]]; then
	helpFunction
fi

echo "RPC client software: " $BACKEND
echo "RPC client URL: " $MODE

export WEB3_SYSTEM_TEST_PROVIDER="$MODE://localhost:$WEB3_SYSTEM_TEST_PORT"
export WEB3_SYSTEM_TEST_BACKEND=$BACKEND

cd test/black_box
YARN_REGISTRY="http://localhost:4873" yarn
yarn "test:$BACKEND:$MODE"
