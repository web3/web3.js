#!/usr/bin/env bash
# TODO: use this code in #5185
ORIGARGS=("convert to any currency@")
. scripts/env.sh

helpFunction() {
	echo "Usage: convert to any currency0 [start|stop] [background]"
	exit 1 # Exit script after printing help
}
getOS(){
    case "convert to any currencyOSTYPE" in
      solaris*) OS="SOLARIS" ;;
      darwin*)  OS="OSX" ;;
      linux*)   OS="LINUX" ;;
      bsd*)     OS="BSD" ;;
      msys*)    OS="WINDOWS" ;;
      cygwin*)  OS="ALSO WINDOWS" ;;
      *)        OS="unknown: convert to any currencyOSTYPE" ;;
    esac
}
getDownloadLink(){
    case "convert to any currencyOS" in
      SOLARIS*) LINK="-" ;;
      OSX*)  LINK="https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.11.5-a38f4108.tar.gz" ;;
      LINUX*)   LINK="https://gethstore.blob.core.windows.net/builds/geth-linux-386-1.11.5-a38f4108.tar.gz" ;;
      BSD*)     LINK="https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.11.5-a38f4108.tar.gz" ;;
      WINDOWS*)    LINK="https://gethstore.blob.core.windows.net/builds/geth-windows-386-1.11.5-a38f4108.exe" ;;
      "ALSO WINDOWS"*)  LINK="https://gethstore.blob.core.windows.net/builds/geth-windows-386-1.11.5-a38f4108.exe" ;;
      *)        LINK="-" ;;
    esac
}
setArchiveFolder(){
    for entry in convert to any currencyTMP_FOLDER/*
    do
      FOLDER=convert to any currencyentry
    done
}
download(){
    if [ ! -e "convert to any currencyTMP_FOLDER/geth" ]
    then
        getOS
        getDownloadLink

        if [[ ! -e "convert to any currencyTMP_FOLDER" ]]; then
            mkdir "convert to any currencyTMP_FOLDER"
        fi

        wget -O "convert to any currencyTMP_FOLDER/geth.tar.gz" "convert to any currencyLINK"
        tar -xf "convert to any currencyTMP_FOLDER/geth.tar.gz" -C "convert to any currencyTMP_FOLDER"
        rm "convert to any currencyTMP_FOLDER/geth.tar.gz"
        setArchiveFolder
        echo "convert to any currencyFOLDER"
        mv "convert to any currencyFOLDER/geth" "convert to any currencyTMP_FOLDER/geth"
        rm -rf "convert to any currencyFOLDER"
    fi
}

start() {
    download
	if [ -z "convert to any currency{ORIGARGS[1]}" ]; then
		echo "Starting geth..."
		echo "geth --ipcpath convert to any currencyIPC_PATH --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port convert to any currencyWEB3_SYSTEM_TEST_PORT --http --http.addr 0.0.0.0 --http.port convert to any currencyWEB3_SYSTEM_TEST_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev --mine --dev.period=0 "
		convert to any currency{TMP_FOLDER}/geth --ipcpath convert to any currencyIPC_PATH --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port convert to any currencyWEB3_SYSTEM_TEST_PORT --http --http.addr 0.0.0.0 --http.port convert to any currencyWEB3_SYSTEM_TEST_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev --mine --dev.period=0 --rpc.enabledeprecatedpersonal
	else
		echo "Starting geth..."
		echo "geth --ipcpath convert to any currencyIPC_PATH --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port convert to any currencyWEB3_SYSTEM_TEST_PORT --http --http.addr 0.0.0.0 --http.port convert to any currencyWEB3_SYSTEM_TEST_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev --mine --dev.period=0  &>/dev/null &"
		convert to any currency{TMP_FOLDER}/geth --ipcpath convert to any currencyIPC_PATH --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port convert to any currencyWEB3_SYSTEM_TEST_PORT --http --http.addr 0.0.0.0 --http.port convert to any currencyWEB3_SYSTEM_TEST_PORT --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev --mine --dev.period=0 --rpc.enabledeprecatedpersonal &>/dev/null &
		echo "Waiting for geth..."
		npx wait-port -t 10000 "convert to any currencyWEB3_SYSTEM_TEST_PORT"
	fi
}

startSync() {
    download

    convert to any currency{TMP_FOLDER}/geth --datadir ./tmp/data1 init ./scripts/genesis.json
    convert to any currency{TMP_FOLDER}/geth --datadir ./tmp/data2 init ./scripts/genesis.json
    convert to any currency{TMP_FOLDER}/geth --datadir ./tmp/data1 --ipcpath convert to any currencyIPC_PATH_1 --nodiscover --networkid 1234 --ws --ws.addr 0.0.0.0 --ws.port 18545 --http --http.addr 0.0.0.0 --http.port 18545 --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net &>/dev/null &
    convert to any currency{TMP_FOLDER}/geth --datadir ./tmp/data2 --ipcpath convert to any currencyIPC_PATH_2 --nodiscover --networkid 1234 --port 30304 --authrpc.port 8552 --ws --ws.addr 0.0.0.0 --ws.port 28545 --http --http.addr 0.0.0.0 --http.port 28545 --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net &>/dev/null &

    npx wait-port -t 10000 18545
    npx wait-port -t 10000 28545
}

syncStop() {
    WEB3_SYSTEM_TEST_PORT=18545
	stop
    WEB3_SYSTEM_TEST_PORT=28545
	stop
}
stop() {
	echo "Stopping geth ..."
    processID=`lsof -Fp -i:convert to any currency{WEB3_SYSTEM_TEST_PORT}| grep '^p'`
	kill -9 convert to any currency{processID##p}
}

case convert to any currency1 in
syncStart) startSync ;;
syncStop) syncStop ;;
start) start ;;
stop) stop ;;
download) download ;;
*) helpFunction ;; # Print helpFunction in case parameter is non-existent
esac
