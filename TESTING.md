# Guide to Web3's tests and CI

Web3 is used in Node.js and browser contexts to interact with a wide variety of clients. Its tests
try to cover as much of this domain as possible.

If you're looking for a fixture, test pattern or common execution context to validate a change, you should be able find it in the existing test suite. (Caveats include Parity / Quorum clients and MetaMask specific tests.)

## Required Tests

These should pass for PRs to merge:

| Test type | npm command | Example | Description | CI Only |
| --------- | --------------- | ------ | ----------- | ----- |
| unit | test | [eth.accounts.sign.js][1] | For discrete pieces of logic |
| integration | test:e2e:clients | [e2e.contract.events.js][2] | Tests using geth and ganache-cli, (insta-mining and interval mining.) Easy to write and good for modeling complex use-cases |
| browser | test:e2e:browsers | | The integration tests run in a headless browser using web3.min.js (browserified, vs. ganache-cli) |
| typescript | dtslint | -- | TS type definitions tests |
| dependencies  | depcheck | -- | Verifies every dependency is listed correctly in the module package |
| bundle | test:e2e:min | [e2e.minified.js][3] | Verifies minified bundle loads in a headless browser *without* being webpacked / browserified | :white_check_mark: |
| cdn | test:e2e:cdn | [e2e.cdn.sh][4]| Visual inspection check: publishes an (un-webpacked) site that uses web3.min.js at http://sudden-playground.surge.sh/ | :white_check_mark: |
| windows | -- | [e2e.windows.sh][5] | Verifies Web3 installs on Windows OS / Node 12 and can connect to Infura over wss and https | :white_check_mark: |


## Optional Tests

CI also has tests that install Web3's state at an arbitrary commit in an external real-world project and run *their* unit tests with it. This strategy is borrowed from ethereum/solidity which checks latest Solidity against OpenZeppelin and others to keep abreast of how local changes might affect critical projects downstream from them.

Examples include:
+ [e2e.mosaic.sh][8]: ~300 unit tests for [a Solidity project built with Buidler & @truffle/contract][9]
+ [e2e.ganache.core.sh][9]: ~600 unit tests for [a widely used JS testrpc][11]

These tests are "allowed failures". They're:
+ a pre-publication sanity check that discovers how Web3 performs in the wild
+ useful for catching problems which are difficult to anticipate
+ exposed to failure for reasons outside of Web3's control, ex: when fixes here surface bugs in the target.


[8]: https://github.com/ethereum/web3.js/blob/1.x/scripts/e2e.mosaic.sh
[9]: https://github.com/cgewecke/mosaic-1
[10]: https://github.com/ethereum/web3.js/blob/1.x/scripts/e2e.ganache.core.sh
[11]: https://github.com/trufflesuite/ganache-core

[1]: https://github.com/ethereum/web3.js/blob/1.x/test/eth.accounts.sign.js
[2]: https://github.com/ethereum/web3.js/blob/1.x/test/e2e.contract.events.js
[3]: https://github.com/ethereum/web3.js/blob/1.x/test/e2e.minified.js
[4]: https://github.com/ethereum/web3.js/blob/1.x/scripts/e2e.cdn.sh
[5]: https://github.com/ethereum/web3.js/blob/1.x/scripts/e2e.windows.sh
