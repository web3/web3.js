#!/usr/bin/env bash

wget https://gethstore.blob.core.windows.net/builds/geth-linux-386-1.10.18-de23cf91.tar.gz
tar -xf ./geth-linux-386-1.10.18-de23cf91.tar.gz -C ./scripts
mv ./scripts/geth-linux-386-1.10.18-de23cf91/geth ./scripts/geth
rm ./geth-linux-386-1.10.18-de23cf91.tar.gz
rm -rf ./scripts/geth-linux-386-1.10.18-de23cf91
