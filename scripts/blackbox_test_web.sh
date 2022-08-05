#!/usr/bin/env bash

# --------------------------------------------------------------------
# A blackbox test that uses packages/web3/dist/min
# --------------------------------------------------------------------

yarn build:web
cp packages/web3/dist/web3.min.js ./blackbox_test/.

cd blackbox_test

BUNDLE_SIZE=$(wc -c web3.min.js | awk '{print $1}')

# Mark file with current commit, branch, and bundle size. This command will fail on Mac (sed implementation)
sed -i "s|__COMMIT_HASH__|$COMMIT_REF|g" index.html
sed -i "s|__BRANCH__|$BRANCH|g" index.html
sed -i "s|__BUNDLE_SIZE__|$BUNDLE_SIZE|g" index.html

cd ..

rm blackbox_test/web3.min.js