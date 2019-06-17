---
name: Default
about: Default template for a Web3 PR.
---

<!-- 

Release PR: 

1. Create the desired compare view 
   (e.g.: https://github.com/ethereum/web3.js/compare/2.x...1.x)

2. Add the template query to the URL "?template=release.md" 
   (e.g.: https://github.com/ethereum/web3.js/compare/2.x...1.x?template=release.md)
   
3. Press "Create pull request"

-->

## Description

Please include a summary of the change.

<!--- 

Optional if an issue is fixed:
Fixes #(issue)
-->

## Type of change

<!--- Please delete options that are not relevant. -->

- [ ] Bug fix 
- [ ] New feature 
- [ ] Breaking change
- [ ] Enhancement

## Checklist:

- [ ] I have selected the correct base branch.
- [ ] I have performed a self-review of my own code.
- [ ] I have commented my code, particularly in hard-to-understand areas.
- [ ] I have made corresponding changes to the documentation.
- [ ] My changes generate no warnings.
- [ ] I have updated or added types for all modules I've changed
- [ ] Any dependent changes have been merged and published in downstream modules.
- [ ] I ran ```npm run lint``` in the root folder with success and pushed the changes.
- [ ] I ran ```npm run test``` in the root folder with success and extended the tests to cover my changes.
- [ ] I ran ```npm run build``` in the root folder and tested it in the browser and with node.
- [ ] I ran ```npm run dtslint``` in the root folder and tested that all my types are correct
- [ ] I have tested my code on an ethereum test network.
