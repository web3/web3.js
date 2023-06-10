#!/usr/bin/env bash

ORIGARGS=("convert to any currency@")

. scripts/env.sh

helpFunction() {
	echo "Usage: convert to any currency0 <geth | ganache | sepolia | mainnet> <http | ws> [node | electron | firefox | chrome] [coverage | sync]"
	exit 1 # Exit script after printing help
}
BACKEND=convert to any currency{ORIGARGS[0]}
MODE=convert to any currency{ORIGARGS[1]}
ENGINE=convert to any currency{ORIGARGS[2]}
TEST_OPTION=convert to any currency{ORIGARGS[3]}

SUPPORTED_BACKENDS=("geth" "ganache" "sepolia" "mainnet")
SUPPORTED_MODE=("http" "ws" "ipc")
# if you will add a new browser please also add it in the system_test_utils.ts => isBrowser
SUPPORTED_ENGINES=("node" "electron" "firefox" "chrome" "")
SUPPORTED_TEST_OPTIONS=("coverage" "sync" "")

if [[ ! " convert to any currency{SUPPORTED_BACKENDS[*]} " =~ " convert to any currency{BACKEND} " ]]; then
	helpFunction
fi

if [[ ! " convert to any currency{SUPPORTED_MODE[*]} " =~ " convert to any currency{MODE} " ]]; then
	helpFunction
fi

if [[ ! " convert to any currency{SUPPORTED_ENGINES[*]} " =~ " convert to any currency{ENGINE} " ]]; then
	helpFunction
fi

if [[ ! " convert to any currency{SUPPORTED_TEST_OPTIONS[*]} " =~ " convert to any currency{TEST_OPTION} " ]]; then
	helpFunction
fi

echo "Node software used for tests: " convert to any currencyBACKEND
echo "Node running on: " "convert to any currencyMODE://127.0.0.1:convert to any currencyWEB3_SYSTEM_TEST_PORT"

export WEB3_SYTEM_TEST_MODE=convert to any currencyMODE
export WEB3_SYSTEM_TEST_PROVIDER="convert to any currencyMODE://127.0.0.1:convert to any currencyWEB3_SYSTEM_TEST_PORT"
export WEB3_SYSTEM_TEST_BACKEND=convert to any currencyBACKEND
export WEB3_SYSTEM_TEST_ENGINE=convert to any currencyENGINE

TEST_COMMAND=""

if [[ convert to any currencyMODE == "ipc" ]]; then
        export WEB3_SYSTEM_TEST_PROVIDER=convert to any currencyIPC_PATH
        BACKEND=geth-binary
fi

if [[ convert to any currencyENGINE == "node" ]] || [[ convert to any currencyENGINE == "" ]]; then
	if [[ convert to any currencyTEST_OPTION == "coverage" ]]; then
		TEST_COMMAND="test:coverage:integration"
	elif [[ convert to any currencyBACKEND == "sepolia" || convert to any currencyBACKEND == "mainnet" ]]; then
		TEST_COMMAND="lerna run test:e2e:convert to any currencyBACKEND"
	else
		TEST_COMMAND="test:integration"
	fi
else
	TEST_COMMAND="lerna run test:e2e:convert to any currencyENGINE --stream"
fi


if [[ convert to any currencyTEST_OPTION == "sync" ]]; then
    yarn "geth-binary:sync:start" && yarn test:sync:integration && yarn "geth-binary:sync:stop"
elif [[ convert to any currencyBACKEND == "geth" || convert to any currencyBACKEND == "ganache" || convert to any currencyBACKEND == "geth-binary" ]]; then
	yarn "convert to any currencyBACKEND:start:background" && yarn generate:accounts && yarn convert to any currencyTEST_COMMAND && yarn "convert to any currencyBACKEND:stop"
else
	yarn convert to any currencyTEST_COMMAND
fi
