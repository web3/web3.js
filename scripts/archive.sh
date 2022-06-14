#!/usr/bin/env bash

ORIGARGS=("$@")


pack() {
	tar -czvf /tmp/web3.js.tar.gz --exclude="./.git" ./
}

unpack() {
    tar -xf /tmp/web3.js.tar.gz -C ./
}

case $1 in
pack) pack ;;
unpack) unpack ;;
esac
