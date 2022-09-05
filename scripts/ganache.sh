#!/usr/bin/env bash

ORIGARGS=("$@")

helpFunction() {
	echo "Usage: $0 [start|stop] [background]"
	exit 1 # Exit script after printing help
}

start() {
	. scripts/env.sh

	if [ -z "${ORIGARGS[1]}" ]
	then
		docker run --publish 8545:8545 trufflesuite/ganache:latest -m "$WEB3_SYSTEM_TEST_MNEMONIC" -a 5 -p $WEB3_SYSTEM_TEST_PORT --wallet.passphrase "123"
	else
		echo "Starting ganache ..."
		docker run --detach --publish 8545:8545 trufflesuite/ganache:latest -m "$WEB3_SYSTEM_TEST_MNEMONIC" -a 5 -p $WEB3_SYSTEM_TEST_PORT --wallet.passphrase "123"

		echo "Waiting for ganache..."
		npx wait-port "$WEB3_SYSTEM_TEST_PORT"
		echo "Ganache started..."
	fi
}

stop() {
	echo "Stopping ganache ..."
    docker ps -q --filter ancestor="trufflesuite/ganache" | xargs -r docker stop
}

case $1 in
start) start ;;
stop) stop ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
