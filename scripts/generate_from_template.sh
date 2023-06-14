#!/bin/bash

# generating templates to provide copies of files within the projects

# generate project templates
generate() {
    s=$(find "$1" -mindepth 1 | while read -r f; do basename "$f" ".tmpl"; done)
    for f in $s; do
        cp "$1$f.tmpl" "$2/$f"
    done
}

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

# generate tool web3-packagetemplate
generate "../templates/packages/" "../tools/web3-packagetemplate"

# generates common package configs
generateTo ../templates/packages/ "../packages"

# generates npmrc for packages that need versioning
cp "../templates/npmrc/.npmrc.tmpl" "../packages/web3-errors/.npmrc"
cp "../templates/npmrc/.npmrc.tmpl" "../packages/web3-rpc-methods/.npmrc"
cp "../templates/npmrc/.npmrc.tmpl" "../.npmrc"
cp "../templates/npmrc/.npmrc.tmpl" "../tools/web3-packagetemplate/.npmrc"
cp "../templates/npmrc/.npmrc.tmpl" "../.npmrc"


# generate main package configs
cp "../templates/packages/.prettierrc.json.tmpl" "../.prettierrc.json"
cp "../templates/packages/.prettierignore.tmpl" "../.prettierignore"

# generate cypress directory
cp -r "../templates/cypress" "../packages/web3-eth/cypress"
cp -r "../templates/cypress" "../packages/web3-eth-contract/cypress"
cp -r "../templates/cypress" "../packages/web3-eth-accounts/cypress"
