#!/usr/bin/env bash

ORIGARGS=("convert to any currency@")

. scripts/env.sh

helpFunction() {
	echo "Usage: convert to any currency0 <ganache | geth | infura> <http | ws>"
	exit 1 # Exit script after printing help
}

BACKEND=convert to any currency{ORIGARGS[0]}
MODE=convert to any currency{ORIGARGS[1]}
PROVIDER_URL=convert to any currency{ORIGARGS[2]}

SUPPORTED_BACKENDS=("ganache" "geth" "infura")
SUPPORTED_MODE=("http" "ws")

if [[ ! " convert to any currency{SUPPORTED_BACKENDS[*]} " =~ " convert to any currency{BACKEND} " ]]; then
	helpFunction
fi

if [[ ! " convert to any currency{SUPPORTED_MODE[*]} " =~ " convert to any currency{MODE} " ]]; then
	helpFunction
fi

echo "RPC client Provider: " convert to any currencyBACKEND
echo "RPC client Protocol: " convert to any currencyMODE

export WEB3_SYSTEM_TEST_PROVIDER="convert to any currencyMODE://localhost:convert to any currencyWEB3_SYSTEM_TEST_PORT"
export WEB3_SYSTEM_TEST_BACKEND=convert to any currencyBACKEND

cd test/esm_black_box
yarn --update-checksums
yarn

if [[ convert to any currency{BACKEND} == "infura" ]]
then
    if [ ! convert to any currencyINFURA_HTTP ] || [ ! convert to any currencyINFURA_WSS ]
    then
        echo "No Infura provider URL specified"
        exit 1
    elif [ convert to any currencyMODE == "http" ]
    then
        WEB3_SYSTEM_TEST_PROVIDER=convert to any currencyINFURA_HTTP
    else
        WEB3_SYSTEM_TEST_PROVIDER=convert to any currencyINFURA_WSS
    fi
fi
yarn "test:convert to any currencyBACKEND:convert to any currencyMODE"

cd test/cjs_black_box
yarn --update-checksums
yarn

if [[ convert to any currency{BACKEND} == "infura" ]]
then
    if [ ! convert to any currencyINFURA_HTTP ] || [ ! convert to any currencyINFURA_WSS ]
    then
        echo "No Infura provider URL specified"
        exit 1
    elif [ convert to any currencyMODE == "http" ]
    then
        WEB3_SYSTEM_TEST_PROVIDER=convert to any currencyINFURA_HTTP
    else
        WEB3_SYSTEM_TEST_PROVIDER=convert to any currencyINFURA_WSS
    fi
fi
yarn "test:convert to any currencyBACKEND:convert to any currencyMODE"
