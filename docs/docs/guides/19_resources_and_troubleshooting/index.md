---
sidebar_position: 19
sidebar_label: '📚 Resources & Troubleshooting'
---

# Resources & Troubleshooting

## Troubleshooting

### ReferenceError: Can't find variable: BigInt using React

Occasionally, users encounter errors in web3.js due to external dependencies, which may seem challenging to resolve within the web3.js framework alone.

**Resolution Steps:**

1. Install `rn-nodeify` as a development dependency:

```bash
yarn add --dev rn-nodeify
```

2. Add the `big-integer` package:

```bash
yarn add big-integer
```

3. Create a file named `shim.js` at the root of your project and include the following polyfill:

```ts
if (typeof BigInt === 'undefined') {
	global.BigInt = require('big-integer');
}
```

4. Import shim.js at the top of your App.js:

```ts
// Make sure you use `import` and not `require`!
import './shim.js';
```

Additional Info:

[Facebook/React-native Issue #28492](https://github.com/facebook/react-native/issues/28492#issuecomment-824698934)

### TypeError: Cannot read property 'prototype' of undefined, js engine: hermes

This error occurs when trying to use Web3.js with React Native. To solve this error, use [the `react-native-quick-crypto` package](https://www.npmjs.com/package/react-native-quick-crypto).

**Resolution Steps:**

1. Install `react-native-quick-crypto` as a dependency:

```bash
yarn add react-native-quick-crypto
```

2. Set up `react-native-quick-crypto`:

```bash
cd ios && pod install
```

3. Ensure that Web3.js is imported using the default import, as using a named import does not work:

```bash
import Web3 from 'web3';
```

## Resources

### [Web3.js v4 course](https://www.youtube.com/watch?v=3ZO_t-Kyr1g&list=PLPn3rQCo3XrP4LbQcOyyHQR8McV7w3HZT)

This comprehensive 14-part video course from ChainSafe equips you with the skills to conquer the blockchain using web3.js v4. Unlock the potential of web3.js v4 and build cutting-edge dApps. This course caters to all skill levels.

[![Web3.js v4 course](https://img.youtube.com/vi/3ZO_t-Kyr1g/0.jpg)](https://www.youtube.com/watch?v=3ZO_t-Kyr1g&list=PLPn3rQCo3XrP4LbQcOyyHQR8McV7w3HZT)

### [Web3.js series](https://www.youtube.com/watch?v=BQ_bDH91S4k&list=PLPn3rQCo3XrNf__8irs4-MjMt4fJqW2I_)

This series of 3 videos takes you on a journey through web3.js. Whether you're a complete beginner or want to refine your skills, these videos have something for you:

1. Getting Started: Kick off your web3 adventure by learning the ropes of web3.js. Master the basics, from installation to making your first call to the blockchain.

2. Essential Tools: Unleash the power of web3.js utilities! From generating random bytes to hashing and checksumming addresses, you'll gain mastery of essential tools for Ethereum development.

3. Sending Transactions: Dive deep into wallets and accounts. Learn how to sign and send transactions to the network, empowering you to interact with the blockchain directly.

[![Web3.js series](https://img.youtube.com/vi/BQ_bDH91S4k/0.jpg)](https://www.youtube.com/watch?v=BQ_bDH91S4k&list=PLPn3rQCo3XrNf__8irs4-MjMt4fJqW2I_)

## Hackathons and Bounties

You'll find the latest hackathons opportunities by following [web3js](https://twitter.com/web3_js) on X.
