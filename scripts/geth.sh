#!/usr/bin/env bash

ORIGARGS=("$@")

helpFunction() {
	echo "Usage: $0 [start|stop] [background]"
	exit 1 # Exit script after printing help
}

start() {
	. scripts/env.sh

	if [ -z "${ORIGARGS[1]}" ]; then
		echo "Starting geth..."
		echo "docker run -p $WEB3_SYSTEM_TEST_HTTP_PORT:$WEB3_SYSTEM_TEST_HTTP_PORT -p $WEB3_SYSTEM_TEST_WS_PORT:$WEB3_SYSTEM_TEST_WS_PORT --name web3-geth-client ethereum/client-go --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port $WEB3_SYSTEM_TEST_WS_PORT --http --http.addr 0.0.0.0 --http.port $WEB3_SYSTEM_TEST_HTTP_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev"
		docker run -p $WEB3_SYSTEM_TEST_HTTP_PORT:$WEB3_SYSTEM_TEST_HTTP_PORT -p $WEB3_SYSTEM_TEST_WS_PORT:$WEB3_SYSTEM_TEST_WS_PORT ethereum/client-go --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port $WEB3_SYSTEM_TEST_WS_PORT --http --http.addr 0.0.0.0 --http.port $WEB3_SYSTEM_TEST_HTTP_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev
	else
		echo "Starting geth..."
		echo "docker run -p $WEB3_SYSTEM_TEST_HTTP_PORT:$WEB3_SYSTEM_TEST_HTTP_PORT -p $WEB3_SYSTEM_TEST_WS_PORT:$WEB3_SYSTEM_TEST_WS_PORT --name web3-geth-client ethereum/client-go --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port $WEB3_SYSTEM_TEST_WS_PORT --http --http.addr 0.0.0.0 --http.port $WEB3_SYSTEM_TEST_HTTP_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev"
		docker run -d -p $WEB3_SYSTEM_TEST_HTTP_PORT:$WEB3_SYSTEM_TEST_HTTP_PORT -p $WEB3_SYSTEM_TEST_WS_PORT:$WEB3_SYSTEM_TEST_WS_PORT ethereum/client-go --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port $WEB3_SYSTEM_TEST_WS_PORT --http --http.addr 0.0.0.0 --http.port $WEB3_SYSTEM_TEST_HTTP_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev
		echo "Waiting for geth..."
		npx wait-port "$WEB3_SYSTEM_TEST_HTTP_PORT"
	fi
}

stop() {
	echo "Stopping geth ..."
	docker stop web3-geth-client
}

case $1 in
start) start ;;
stop) stop ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
