#!/usr/bin/env bash

# This script contains conditional installation logic for Travis CI

# CI jobs we'd like to skip default installation for:
# Helpful for E2E tests where the dev deps might cause problems
skip=(
  "e2e_ganache"
  "e2e_mosaic"
  "e2e_windows"
)

if [[ ! " ${skip[@]} " =~ " ${TEST} " ]]; then
  npm install
fi
