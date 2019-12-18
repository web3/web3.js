#!/usr/bin/env bash

# ----------------------------
# Does stop the local registry
# ----------------------------

ps -ef | grep 'verdaccio' | grep -v grep | awk '{print $2}' | xargs kill -9
