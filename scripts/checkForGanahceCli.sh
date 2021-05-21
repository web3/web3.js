#!/bin/bash

if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
    exit 0
else
    exit 1
fi
