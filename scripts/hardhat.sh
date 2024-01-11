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
		echo "sup hardhat ..."
        npx hardhat node
	else
		echo "Starting hardhat ..."
        npx hardhat node

		echo "Waiting for hardhat..."
		# npx wait-port "$WEB3_SYSTEM_TEST_PORT"
		echo "hardhat started..."
	fi
}

stop() {
	echo "Stopping ganache ..."
    docker ps -q --filter ancestor="trufflesuite/ganache" | xargs -r docker stop
}

case $1 in
start) start ;;
# stop) stop ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
