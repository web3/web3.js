#!/usr/bin/env bash

# --------------------------------------------------------------------
# Prepares package folder
# --------------------------------------------------------------------

# Creates temporary package folder
rm -rf ./package
mkdir package

# Copy internal files to package
cp -r ./internal ./package/

# Copy public files to package
cp -r ./public/* ./package/

# Copy `package.json` to package
cp ./package.json ./package/package.json

# Copy `README.md` to package
cp ./README.md ./package/README.md

# Copy `tsconfig.prod.json`
cp ./tsconfig.prod.json ./package/

# Go to package directory
cd ./package

# Build package
npm run build:prod

# Remove not required files
rm -rf ./config
rm -rf ./core
rm -rf ./ethereum
rm -rf ./internal
rm -rf ./index.js
rm -rf ./tsconfig.prod.json

# Move `dist` files to root folder and delete the `dist` folder
mv ./dist/package/* ./

rm -rf ./dist


echo -e "\033[0;32mPackage successfully prepared!\033[0m"
