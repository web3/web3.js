---
name: Release
about: Release PR template
---

<!--- Don't forget to assing @nivida and to add the corresponding labels (version, "in progress", "release") -->

## Description

<!--- Add a description if there are new features or behaviors to explain -->


### Compare View

<!--- 
    Replace LAST_TAG with the last released version
    Replace NEW_TAG with the new version
 -->

[LAST_TAG -> NEW_TAG](https://github.com/ethereum/web3.js/compare/LAST_TAG...HEAD)


## Type of change

- [X] Release


## Checklist:

- [ ] I have selected the correct base branch.
- [ ] I have performed a self-review of my own code. 
- [ ] I have commented my code, particularly in hard-to-understand areas.
- [ ] I have made corresponding changes to the documentation.
- [ ] My changes generate no warnings.
- [ ] I have updated or added types for all modules I've changed
- [ ] Any dependent changes have been merged and published in downstream modules.
- [ ] I ran ```npm run lint``` in the root folder with success and pushed the changes.
- [ ] I ran ```npm run test``` in the root folder with success and extended the tests to cover all changes.
- [ ] I ran ```npm run build``` in the root folder and tested it in the browser and with node.
- [ ] I ran ```npm run dtslint``` in the root folder and tested that all my types are correct
- [ ] I have tested my code on an ethereum test network.
