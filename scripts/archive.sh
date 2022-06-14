#!/usr/bin/env bash

ORIGARGS=("$@")


pack() {
	tar -czvf web3.js.tar.gz ./
}

unpack() {
    tar -xf ./web3.js.tar.gz -C ./
}

case $1 in
pack) pack ;;
unpack) unpack ;;
esac
