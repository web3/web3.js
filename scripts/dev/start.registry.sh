#!/usr/bin/env bash

# -----------------------------------------------------
# Does start the registry and keeps the process running
# -----------------------------------------------------

forever start --colors verdaccio --config verdaccio.yml & echo -e "\033[1;33mLocal registry started!"
