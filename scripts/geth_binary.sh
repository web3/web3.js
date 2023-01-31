#!/usr/bin/env bash
# TODO: use this code in #5185
ORIGARGS=("$@")
. scripts/env.sh

helpFunction() {
	echo "Usage: $0 [start|stop] [background]"
	exit 1 # Exit script after printing help
}
getOS(){
    case "$OSTYPE" in
      solaris*) OS="SOLARIS" ;;
      darwin*)  OS="OSX" ;;
      linux*)   OS="LINUX" ;;
      bsd*)     OS="BSD" ;;
      msys*)    OS="WINDOWS" ;;
      cygwin*)  OS="ALSO WINDOWS" ;;
      *)        OS="unknown: $OSTYPE" ;;
    esac
}
getDownloadLink(){
    case "$OS" in
      SOLARIS*) LINK="-" ;;
      OSX*)  LINK="https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.10.26-e5eb32ac.tar.gz" ;;
      LINUX*)   LINK="https://gethstore.blob.core.windows.net/builds/geth-linux-386-1.10.26-e5eb32ac.tar.gz" ;;
      BSD*)     LINK="https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.10.26-e5eb32ac.tar.gz" ;;
      WINDOWS*)    LINK="https://gethstore.blob.core.windows.net/builds/geth-windows-386-1.10.26-e5eb32ac.exe" ;;
      "ALSO WINDOWS"*)  LINK="https://gethstore.blob.core.windows.net/builds/geth-windows-386-1.10.26-e5eb32ac.exe" ;;
      *)        LINK="-" ;;
    esac
}
setArchiveFolder(){
    for entry in $TMP_FOLDER/*
    do
      FOLDER=$entry
    done
}
download(){
    if [ ! -e "$TMP_FOLDER/geth" ]
    then
        getOS
        getDownloadLink

        if [[ ! -e "$TMP_FOLDER" ]]; then
            mkdir "$TMP_FOLDER"
        fi

        wget -O "$TMP_FOLDER/geth.tar.gz" "$LINK"
        tar -xf "$TMP_FOLDER/geth.tar.gz" -C "$TMP_FOLDER"
        rm "$TMP_FOLDER/geth.tar.gz"
        setArchiveFolder
        echo "$FOLDER"
        mv "$FOLDER/geth" "$TMP_FOLDER/geth"
        rm -rf "$FOLDER"
    fi
}

start() {
    download
	if [ -z "${ORIGARGS[1]}" ]; then
		echo "Starting geth..."
		echo "geth --ipcpath $IPC_PATH --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port $WEB3_SYSTEM_TEST_PORT --http --http.addr 0.0.0.0 --http.port $WEB3_SYSTEM_TEST_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev --dev.period=0 "
		${TMP_FOLDER}/geth --ipcpath $IPC_PATH --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port $WEB3_SYSTEM_TEST_PORT --http --http.addr 0.0.0.0 --http.port $WEB3_SYSTEM_TEST_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev --dev.period=0 --dev.gaslimit=80000000
	else
		echo "Starting geth..."
		echo "geth --ipcpath $IPC_PATH --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port $WEB3_SYSTEM_TEST_PORT --http --http.addr 0.0.0.0 --http.port $WEB3_SYSTEM_TEST_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev --dev.period=0  &>/dev/null &"
		${TMP_FOLDER}/geth --ipcpath $IPC_PATH --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port $WEB3_SYSTEM_TEST_PORT --http --http.addr 0.0.0.0 --http.port $WEB3_SYSTEM_TEST_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev --dev.period=0 --dev.gaslimit=80000000 &>/dev/null &
		echo "Waiting for geth..."
		npx wait-port "$WEB3_SYSTEM_TEST_PORT"
	fi
}

stop() {
	echo "Stopping geth ..."
    processID=`lsof -Fp -i:${WEB3_SYSTEM_TEST_PORT}| grep '^p'`
	kill -9 ${processID##p}
}

case $1 in
start) start ;;
stop) stop ;;
download) download ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
