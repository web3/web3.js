#!/usr/bin/env bash

# -----------------------------
# Travis CI matrix job selector
# -----------------------------

# Exit immediately on error
set -o errexit

if [ "$TEST" = "unit" ]; then

  npm run build:all:dev
  npm run test:unit

elif [ "$TEST" = "build_and_lint" ]; then

  npm run build:all:release
  npm run dtslint

elif [ "$TEST" = "unit_and_e2e_clients" ]; then

  npm run build:all:dev
  npm run test:e2e:ganache
  npm run test:e2e:geth:insta
  npm run test:e2e:geth:auto
  npm run test:unit
  npm run coveralls

elif [ "$TEST" = "e2e_browsers" ]; then

  npm run build:web3:minified
  npm run test:e2e:chrome
  npm run test:e2e:firefox

elif [ "$TEST" = "e2e_truffle" ]; then

  npm run test:e2e:publish
  npm run test:e2e:truffle

fi
