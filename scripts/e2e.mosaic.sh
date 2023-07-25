# -------------------------------------------------------------------------------------------
# Run mosaicdao/mosaic-1 fork (w/ buidler truffle5 plugin) using a candidate
# branch of web3 which has been published to a proxy npm registry in `e2e.npm.publish.sh`
#
# This test's purpose is to watch web3 execute a long, complex test suite
# It uses buidler-adapted fork of mosaicdao because that tool is simpler and
# more modular than Truffle and lets us resolve arbitrary versions of web3 more easily.
# --------------------------------------------------------------------------------------------

# Exit immediately on error
set -o errexit

# To mimic `npm install web3` correctly, this test does not install Web3's dev deps.
# However, we need the npm package `semver` to coerce yarn resolutions correctly.
# It must be installed as a dev dep or Node complains. We also need web3's package.json
# to resolve the current version + patch increment. So some file renaming is necessary here...
cp package.json original.package.json
rm package.json
rm package-lock.json
npm init --yes
npm install --save-dev semver

# Install mosaic and set yarn resolutions to virtually published patch version
git clone https://github.com/cgewecke/mosaic-1.git
scripts/js/resolutions.js mosaic-1
cd mosaic-1

# Install via registry and verify
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Installing updated web3 via virtual registry "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

git submodule update --init --recursive

yarn add "web3@^1.0.0-beta.36" --dev --registry http://localhost:4873

yarn --registry http://localhost:4873

yarn add web3@e2e --registry http://localhost:4873 --network-timeout 600000

yarn list web3
yarn list web3-utils
yarn list web3-core
yarn list web3-core-promievent

cat ./package.json

# Test
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Running mosaicdao/mosaic-1 unit tests.      "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

# Launch ganache
./tools/run_ganache_cli.sh </dev/null 1>/dev/null 2>&1 &
sleep 10

# Compile and test
npx buidler compile

# make links to web3@1.x
rm -rf node_modules/web3-utils
ln -s ../node_modules/web3-utils node_modules/web3-utils

rm -rf node_modules/web3-providers-ws
ln -s ../node_modules/web3-providers-ws node_modules/web3-providers-ws

rm -rf node_modules/web3-eth-accounts
ln -s ../node_modules/web3-eth-accounts node_modules/web3-eth-accounts

rm -rf node_modules/web3-shh
ln -s ../node_modules/web3-shh node_modules/web3-shh

rm -rf node_modules/web3-core
ln -s ../node_modules/web3-core node_modules/web3-core

rm -rf node_modules/web3-net
ln -s ../node_modules/web3-net node_modules/web3-net

rm -rf node_modules/web3-eth
ln -s ../node_modules/web3-eth node_modules/web3-eth

rm -rf node_modules/web3-eth-abi
ln -s ../node_modules/web3-eth-abi node_modules/web3-eth-abi

rm -rf node_modules/web3-eth-contract
ln -s ../node_modules/web3-eth-contract node_modules/web3-eth-contract

rm -rf node_modules/web3-eth-personal
ln -s ../node_modules/web3-eth-personal node_modules/web3-eth-personal

rm -rf node_modules/web3-eth-ens
ln -s ../node_modules/web3-eth-ens node_modules/web3-eth-ens

rm -rf node_modules/web3-validator
ln -s ../node_modules/web3-validator node_modules/web3-validator

rm -rf node_modules/web3-provider-http
ln -s ../node_modules/web3-provider-http node_modules/web3-provider-http

rm -rf node_modules/web3-eth-iban
ln -s ../node_modules/web3-eth-iban node_modules/web3-eth-iban

rm -rf node_modules/web3-bzz
ln -s ../node_modules/web3-bzz node_modules/web3-bzz

rm -rf node_modules/web3
rm -rf node_modules/@truffle/interface-adapter/node_modules/web3
ln -s ../node_modules/web3 node_modules/web3
ln -s ../node_modules/web3 node_modules/@truffle/interface-adapter/node_modules/web3

# run test
npm test
