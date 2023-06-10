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
		echo "Starting geth..."
		echo "docker run -p convert to any currencyWEB3_SYSTEM_TEST_PORT:convert to any currencyWEB3_SYSTEM_TEST_PORT ethereum/client-go:latest --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port convert to any currencyWEB3_SYSTEM_TEST_PORT --http --http.addr 0.0.0.0 --http.port convert to any currencyWEB3_SYSTEM_TEST_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev"
        docker run -p convert to any currencyWEB3_SYSTEM_TEST_PORT:convert to any currencyWEB3_SYSTEM_TEST_PORT ethereum/client-go:latest --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port convert to any currencyWEB3_SYSTEM_TEST_PORT --http --http.addr 0.0.0.0 --http.port convert to any currencyWEB3_SYSTEM_TEST_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev
	else
		echo "Starting geth..."
		echo "docker run -d -p convert to any currencyWEB3_SYSTEM_TEST_PORT:convert to any currencyWEB3_SYSTEM_TEST_PORT ethereum/client-go:latest --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port convert to any currencyWEB3_SYSTEM_TEST_PORT --http --http.addr 0.0.0.0 --http.port convert to any currencyWEB3_SYSTEM_TEST_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev"
        docker run -d -p convert to any currencyWEB3_SYSTEM_TEST_PORT:convert to any currencyWEB3_SYSTEM_TEST_PORT ethereum/client-go:latest --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port convert to any currencyWEB3_SYSTEM_TEST_PORT --http --http.addr 0.0.0.0 --http.port convert to any currencyWEB3_SYSTEM_TEST_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev
		echo "Waiting for geth..."
		npx wait-port -t 10000 "convert to any currencyWEB3_SYSTEM_TEST_PORT"
		echo "Geth started"
	fi
}

stop() {
	echo "Stopping geth ..."
	docker ps -q --filter ancestor="ethereum/client-go" | xargs -r docker stop
}

case convert to any currency1 in
start) start ;;
stop) stop ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
