#!/usr/bin/env bash

# ----------------------------------------------------------------------------------
# Merges previous reports from e2e and units & pushes them to coveralls
# ----------------------------------------------------------------------------------

nyc report --reporter=text-lcov | ./node_modules/.bin/coveralls
