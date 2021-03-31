# ----------------------------------------------------------------------------------------
# Run trufflesuite/ganache-core using a candidate branch of web3 which has been published
# to a proxy npm registry in `e2e.npm.publish.sh`
#
# This test's purpose is to watch web3 execute a long, complex test suite
# ----------------------------------------------------------------------------------------

# Exit immediately on error
set -o errexit

# Install ganache-core
git clone https://github.com/trufflesuite/ganache-core
cd ganache-core
git checkout tags/v2.13.0

# Install via registry and verify
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Installing updated web3 via virtual registry "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

npm config set fetch-retry-mintimeout 100000
npm config set fetch-retry-maxtimeout 600000

npm install
npm uninstall --save-dev web3
npm install --save-dev web3@e2e --registry http://localhost:4873

npm list web3
npm list web3-utils
npm list web3-core
npm list web3-core-promievent

cat ./package.json

# Test
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Running trufflesuite/ganache-core unit tests.      "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

npm run build

# There are three failing ganache tests:
# 1. "should return instance of StateManager on start":
#    Checks whether the object returned by the server is an
#    instanceof StateManager. Also fails locally & doesn't
#    seem web3 related.
# 2. "should handle events properly via the data event handler":
#    Upstream issue. Also fails locally & doesn't
#    seem web3 related.
# 3."should call get whisper version (shh_version)"
#   this is due to the deprecation of the shh package
# Skipping them with grep / invert.
TEST_BUILD=node npx mocha \
  --grep "should return instance of StateManager on start|should handle events properly via the data event handler|Whisper" \
  --invert \
  --check-leaks \
  --recursive \
  --globals _scratch
