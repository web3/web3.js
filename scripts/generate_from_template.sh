#!/bin/bash
# generate project templates
#copy templates and add to seperate packages
generateTo() {
    # Get the source files
    source_files=$(find "$1" -mindepth 1 | while read -r file; do basename "$file" ".tmpl"; done)

    # Get the target directories
    target_directories=$(find "$2" -maxdepth 1 -mindepth 1 -type d)
    # Iterate over each target directory and copy the source files
    for dir in $target_directories; do
        for file in $source_files; do
            cp "$1$file.tmpl" "$dir/$file"
        done
    done
}

removeFromPackage() {
    source_files=$(find "$1" -mindepth 1 | while read -r file; do basename "$file" ".tmpl"; done)
    # Iterate over each target directory and copy the source files
    for file in $source_files; do
        find "$2" -maxdepth 1 -mindepth 1 -type d -exec rm "{}/$file" \;
    done
}

# generates common package configs
removeFromPackage "../templates/packages/" "../packages"
generateTo ../templates/packages/ "../packages"

# generates npmrc for packages that need versioning
rm "../.npmrc"
rm "../packages/web3-errors/.npmrc"
rm "../packages/web3-rpc-methods/.npmrc"
cp "../templates/npmrc/.npmrc.tmpl" "../packages/web3-errors/.npmrc"
cp "../templates/npmrc/.npmrc.tmpl" "../packages/web3-rpc-methods/.npmrc"
cp "../templates/npmrc/.npmrc.tmpl" "../.npmrc"

# generate cypress config for cypress tests
# rm "../packages/web3-eth/cypress.config.js"
# rm "../packages/web3-eth-accounts/cypress.config.js"
# rm "../packages/web3-eth-contract/cypress.config.js"
# rm "../packages/web3-providers-http/cypress.config.js"
# cp "../templates/cypress.config.js" "../packages/web3-errors/.npmrc"
# cp "../templates/npmrc/.npmrc.tmpl" "../packages/web3-rpc-methods/.npmrc"
# cp "../templates/npmrc/.npmrc.tmpl" "../.npmrc"

# generate test templates
# generateTo "../packages" "../templates/test/tsconfig.json.tmpl" "test/tsconfig.json"



# generate cypress templates