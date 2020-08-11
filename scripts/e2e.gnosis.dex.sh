# -------------------------------------------------------------------------------------------
# Run gnosis/dex-react using a candidate branch of web3 which has been published to a
# proxy npm registry in `e2e.npm.publish.sh`
#
# The test's purpose is to verify web3 latest state runs successfully on an actively
# developed production project which uses.
# + react
# + webpack production build
# + typescript compilation
# + ~200 jest tests
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
git clone https://github.com/gnosis/dex-react.git
scripts/js/resolutions.js dex-react
cd dex-react

# Install via registry and verify
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Installing updated web3 via virtual registry "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

yarn --registry http://localhost:4873

yarn list web3
yarn list web3-utils
yarn list web3-core
yarn list web3-core-promievent

cat ./package.json

# Build
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Running gnosis/dex-react: build             "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

APP_ID=1 npm run build

# Test
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Running gnosis/dex-react: test              "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

APP_ID=1 npm test
