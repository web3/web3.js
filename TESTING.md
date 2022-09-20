# Guide to Web3's tests and CI

Web3 is used in Node.js and browser contexts to interact with a wide variety of clients. Its tests
try to cover as much of this domain as possible.

If you're looking for a fixture, test pattern or common execution context to validate a change, you should be able to find it in the existing test suite. (Caveats include Parity / Quorum clients and MetaMask specific tests.)

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
| cdn | test:e2e:cdn | [e2e.cdn.sh][4]| Visual inspection check: publishes an (un-webpacked) site that uses web3.min.js at https://web3-staging.netlify.app/ | :white_check_mark: |
| windows | -- | [e2e.windows.sh][5] | Verifies Web3 installs on Windows OS / Node 12 and can connect to Infura over wss and https | :white_check_mark: |


## Optional Tests

CI also has tests that install Web3's state at an arbitrary commit in an external real-world project and run *their* unit tests with it. This strategy is borrowed from ethereum/solidity which checks the latest Solidity against OpenZeppelin and others to keep abreast of how local changes might affect critical projects downstream from them.

Examples include:
+ [e2e.mosaic.sh][8]: ~300 unit tests for [a Solidity project built with Buidler & @truffle/contract][9]
+ [e2e.ganache.core.sh][9]: ~600 unit tests for [a widely used JS testrpc][11]

These tests are "allowed failures". They're:
+ a pre-publication sanity check that discovers how Web3 performs in the wild
+ useful for catching problems which are difficult to anticipate
+ exposed to failure for reasons outside of Web3's control, ex: when fixes here surface bugs in the target.

## Implementation Details

**Code coverage**

Coverage is measured by aggregating the results of tests run in the `unit_and_e2e_clients`
CI job.

**Tests which use an Ethereum client**

The npm script `test:e2e:clients` greps all tests with an `[ @E2E ]` tag
in their mocha test description and runs them against:
+ ganache-cli
+ geth stable (POA, single instance, instamining)
+ geth stable (POA, single instance, mining at 2s intervals)

These tests are grouped in files prefixed by "e2e", ex: `test/e2e.method.call.js`.

Additionally, there are conventional unit tests postfixed `.ganache.js` which spin up a ganache
server programmatically within mocha. This pattern is useful if you want to
control client configuration for a specific case, test against multiple independent providers, etc.

**"Real world" tests**

The tests which install Web3's current state in an external real-world project and
run their unit tests accomplish this by publishing the monorepo to an ephemeral private
npm registry which is spun up in CI using [verdaccio][14]. (Implementation details can
be seen in [scripts/e2e.npm.publish.sh][15])

The real world target is then cloned and npm or yarn are used to replace its existing
Web3 version with the version published to the private registry. A simple example can be seen at
[scripts/e2e.ganache.core.sh][10].

In practice, complex projects can have many versions of Web3 nested in their dependency tree.
It's important to coerce all of them to the virtually published package's version for the test to be valid.
This can be done with [scripts/js/resolutions.js][18] which modifies the target's
`package.json` to take advantage of Yarn's [selective dependency resolutions][17].
An example of its use can be seen at [scripts/e2e.mosaic.sh][8].

[14]: https://verdaccio.org/docs/en/installation
[15]: https://github.com/ethereum/web3.js/blob/1.x/scripts/e2e.npm.publish.sh
[17]: https://classic.yarnpkg.com/en/docs/selective-version-resolutions/
[18]: https://github.com/ethereum/web3.js/blob/1.x/scripts/js/resolutions.js

[8]: https://github.com/ethereum/web3.js/blob/1.x/scripts/e2e.mosaic.sh
[9]: https://github.com/cgewecke/mosaic-1
[10]: https://github.com/ethereum/web3.js/blob/1.x/scripts/e2e.ganache.core.sh
[11]: https://github.com/trufflesuite/ganache-core

[1]: https://github.com/ethereum/web3.js/blob/1.x/test/eth.accounts.sign.js
[2]: https://github.com/ethereum/web3.js/blob/1.x/test/e2e.contract.events.js
[3]: https://github.com/ethereum/web3.js/blob/1.x/test/e2e.minified.js
[4]: https://github.com/ethereum/web3.js/blob/1.x/scripts/e2e.cdn.sh
[5]: https://github.com/ethereum/web3.js/blob/1.x/scripts/e2e.windows.sh
