#!/usr/bin/env bash

helpFunction() {
	echo "Usage: $0 [start|stop] [background]"
	exit 1 # Exit script after printing help
}

start() {
	source scripts/env.sh
	WEB3_SYSTEM_TEST_BACKEND="ganache"

	echo "Starting gancahe ..."
	echo "npx ganache ethereum -m \"$WEB3_SYSTEM_TEST_PASSWORD\" -a 5 -p $WEB3_SYSTEM_TEST_HTTP_PORT &"
	npx ganache ethereum -m "$WEB3_SYSTEM_TEST_PASSWORD" -a 5 -p $WEB3_SYSTEM_TEST_HTTP_PORT >/dev/null &

	echo "Waiting for ganache..."
	npx wait-port "$WEB3_SYSTEM_TEST_HTTP_PORT"
	sleep 2
	echo "Ganache started..."

	echo "Fetching accounts..."
	accounts=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":"id","method":"eth_accounts","params":[]}' "http://localhost:$WEB3_SYSTEM_TEST_HTTP_PORT")
	echo "Got response: \n $accounts"
	echo "Setting env variable \"WEB3_SYSTEM_TEST_ACCOUNTS\""
	WEB3_SYSTEM_TEST_ACCOUNTS=$(node -e "console.log(JSON.stringify(JSON.parse(process.argv[1]).result))" -- $accounts)
	echo $WEB3_SYSTEM_TEST_ACCOUNTS
}

stop() {
	echo "Stopping ganache ..."
	pkill -f ganache
}

case $1 in
start) start ;;
stop) stop ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
