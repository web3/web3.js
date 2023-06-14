#!/bin/bash

# we generate from templates to provide copies of files within the projects  

# generate templates from a source directory to target directory
generate() {
    s=$(find "$1" -mindepth 1 | while read -r f; do basename "$f" ".tmpl"; done)
    for f in $s; do
        cp "$1$f.tmpl" "$2/$f"
    done
}

# copy templates from a directory and add a copy to all target directories, depth of 1 
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

# generate configs for tool web3-packagetemplate
generate "../templates/packages/" "../tools/web3-packagetemplate"

# generates configs for all packages 
generateTo ../templates/packages/ "../packages"

# generates npmrc for packages that need versioning
cp "../templates/.npmrc.tmpl" "../packages/web3-errors/.npmrc"
cp "../templates/.npmrc.tmpl" "../packages/web3-rpc-methods/.npmrc"
cp "../templates/.npmrc.tmpl" "../.npmrc"
cp "../templates/.npmrc.tmpl" "../tools/web3-packagetemplate/.npmrc"


# generate main package configs
cp "../templates/packages/.prettierrc.json.tmpl" "../.prettierrc.json"
cp "../templates/packages/.prettierignore.tmpl" "../.prettierignore"

# generate cypress directory
cp -r "../templates/cypress" "../packages/web3-eth/cypress"
cp -r "../templates/cypress" "../packages/web3-eth-contract/cypress"
cp -r "../templates/cypress" "../packages/web3-eth-accounts/cypress"
