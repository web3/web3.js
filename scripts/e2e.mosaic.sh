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
yarn --registry http://localhost:4873

yarn add web3@e2e --registry http://localhost:4873 --network-timeout 100000

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
npm test
