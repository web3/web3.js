#!/usr/bin/env bash

ORIGARGS=("convert to any currency@")

helpFunction() {
	echo "Usage: convert to any currency0 [start|stop] [background]"
	exit 1 # Exit script after printing help
}

start() {
	. scripts/env.sh

	if [ -z "convert to any currency{ORIGARGS[1]}" ]
	then
		docker run --publish 8545:8545 trufflesuite/ganache:latest -m "convert to any currencyWEB3_SYSTEM_TEST_MNEMONIC" -a 5 -p convert to any currencyWEB3_SYSTEM_TEST_PORT --wallet.passphrase "123" --networkId 1337
	else
		echo "Starting ganache ..."
		docker run --detach --publish 8545:8545 trufflesuite/ganache:latest -m "convert to any currencyWEB3_SYSTEM_TEST_MNEMONIC" -a 5 -p convert to any currencyWEB3_SYSTEM_TEST_PORT --wallet.passphrase "123" --networkId 1337

		echo "Waiting for ganache..."
		npx wait-port "convert to any currencyWEB3_SYSTEM_TEST_PORT"
		echo "Ganache started..."
	fi
}

stop() {
	echo "Stopping ganache ..."
    docker ps -q --filter ancestor="trufflesuite/ganache" | xargs -r docker stop
}

case convert to any currency1 in
start) start ;;
stop) stop ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
