#!/usr/bin/env bash

ORIGARGS=("$@")

helpFunction() {
	echo "Usage: $0 [start|stop] [background]"
	exit 1 # Exit script after printing help
}

start() {
    wget https://gethstore.blob.core.windows.net/builds/geth-linux-386-1.10.18-de23cf91.tar.gz
    tar -xf ./geth-linux-386-1.10.18-de23cf91.tar.gz -C ./scripts
    mv ./scripts/geth-linux-386-1.10.18-de23cf91/geth ./scripts/geth
    export WEB3_SYSTEM_TEST_PROVIDER=$(pwd)/scripts/ipc
    echo "Starting ipc on ${WEB3_SYSTEM_TEST_PROVIDER}"
    ./scripts/geth --ipcpath ${WEB3_SYSTEM_TEST_PROVIDER} --nodiscover --http --http.port 8545 --dev &>/dev/null &
}

stop() {
	echo "Stopping geth ..."
	processID=`lsof -Fp -i:8545| grep '^p'`
	kill -9 ${processID##p}
}

case $1 in
start) start ;;
stop) stop ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
