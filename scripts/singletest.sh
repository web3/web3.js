#!/bin/bash
# Command to run single test
# Usage: 
# npm run test:single ARG1 ARG2

# ARG1 : test name
# ARG2 : Optional module name to compilate. After changes in module files it need to be recompiled 

# Example: 
# npm run test:single utils.isAddress web3-utils


echo "RUN SINGLE TEST"
echo "First arg is testname second arg is package name to compile"
echo "If you did some changes in code package must be recompiled but it takes time"

if [ "$2" != "" ]; then 
  echo "Compiling: packages/$2..."
  npm run compile --prefix packages/$2
fi

echo "SCRIPTS COMPILED"
npm run test --file test/$1
