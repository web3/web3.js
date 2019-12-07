#!/usr/bin/env bash

# -------------------------------------------------------------------------------------
# Runs basic min bundle loading check on chrome headless
# -------------------------------------------------------------------------------------

# Exit immediately on error
set -o errexit

echo " "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "E2E: web3/dist/web3.min.js (Chrome).     "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo " "

BROWSER_BUNDLE_TEST="publishedDist" karma start \
  --single-run \
  --browsers ChromeHeadless

echo " "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "E2E: web3/dist/web3.min.js (Chrome).     "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo " "

BROWSER_BUNDLE_TEST="gitRepoDist" karma start \
  --single-run \
  --browsers ChromeHeadless
