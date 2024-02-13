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
		echo "Starting hardhat ..."
		npx hardhat node
	fi
}

stop() {
	echo "Stopping hardhat ..."
	PID=$(lsof -t -i :8545)
	kill $PID

}

case $1 in
start) start ;;
stop) stop ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
