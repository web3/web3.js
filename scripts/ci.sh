#!/usr/bin/env bash

# -----------------------------
# Travis CI matrix job selector
# -----------------------------

if [ "$TEST" = "unit" ]; then

  npm run test:unit

elif [ "$TEST" = "unit_and_e2e" ]; then

  npm run test:e2e:all
  npm run test:unit
  npm run coveralls

fi
