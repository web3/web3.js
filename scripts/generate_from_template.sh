#!/bin/bash
# generate project templates
#copy templates and add to seperate packages
generateToPackage() {
    find "../packages" -maxdepth 1 -mindepth 1 -type d -exec cp $1 {}/ \;
}
# generate test templates

# generate cypress templates
generateToPackage "abc"