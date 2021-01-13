#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

PREFIX="web3"

PUBLISHES=("$PREFIX-utils" "$PREFIX-ssh" "$PREFIX-eth-iban" "$PREFIX-core-promievent" "$PREFIX-core-helpers" "$PREFIX-providers-ws" "$PREFIX-providers-ipc" "$PREFIX-providers-http" "$PREFIX-bzz" "$PREFIX-core-subscriptions" "$PREFIX-core-requestmanager" "$PREFIX-core-method" "$PREFIX-core" "$PREFIX-net" "$PREFIX-eth-personal" "$PREFIX-eth-abi" "$PREFIX-eth-contract" "$PREFIX-eth-accounts" "$PREFIX-eth-ens" "$PREFIX-eth" "$PREFIX" )

echo "Publishing ${#PUBLISHES[@]} Packages..."

for i in "${PUBLISHES[@]}"
do
  echo "Publishing $i..."
  cd $SCRIPTPATH/../packages/@redbud-hk/$i && npm publish --access public
done
