---
sidebar_position: 1
sidebar_label: 'Mastering events subcriptions'
---

# Events Subscription

## Subscribing to smart contracts events

```js
import { Web3 } from "web3";

// set a provider - MUST be a WebSocket(WSS) provider
const web3 = new Web3("wss://ethereum-rpc.publicnode.com");

async function subscribe() {
  // create a new contract object, providing the ABI and address
  const contract = new web3.eth.Contract(abi, address);

  // subscribe to the smart contract event
  const subscription = contract.events.EventName();

  // new value every time the event is emitted
  subscription.on("data", console.log);
}

subscribe();
```


## Subscribing to node events

A standard Ethereum node like [Geth supports subscribing to specific events](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#supported-subscriptions). Additionally, there are some Ethereum nodes that provide additional custom subscriptions. As you can find in [Supported Subscriptions](/guides/events_subscriptions/supported_subscriptions) guide, web3.js enables you to subscribe to the standard events out of the box. And it also provides you with the capability to subscribe to custom subscriptions as you can find in the [Custom Subscriptions](/guides/events_subscriptions/custom_subscriptions) guide.

:::important
If you are the developer who provides custom subscriptions to users. We encourage you to develop a web3.js Plugin after you go through the [Custom Subscription](#custom-subscription) section below. You can find how to develop a plugin at [web3.js Plugin Developer Guide](/guides/web3_plugin_guide/plugin_authors)
:::


- `on("data")` - Fires on each incoming log with the log object as argument.
```js
 subcription.on("data", (data) => console.log(data));
```

- `on("changed")` - Fires on each log which was removed from the blockchain. The log will have the additional property "removed: true".
```js
 subcription.on("changed", (changed) => console.log(changed));
```

- `on("error")` - Fires when an error in the subscription occurs.
```js
 subcription.on("error", (error) => console.log(error));
```

- `on("connected")` - Fires once after the subscription successfully connected. Returns the subscription id.
```js
 subcription.on("connected", (connected) => console.log(connected));
```
### Logs

- `logs`: implemented in the class [`LogsSubscription`](/api/web3-eth/class/LogsSubscription)

```js
import { Web3 } from "web3";

const web3 = new Web3("wss://ethereum-rpc.publicnode.com");

async function subscribe() {
  //create subcription
  const subcription = await web3.eth.subscribe("logs");

  //print logs of the latest mined block
  subcription.on("data", (data) => console.log(data));

  //unsubscribe
  //await subcription.unsubscribe();
}

subscribe();
```

### Pending Transactions 

-   `newPendingTransactions`: implemented in the class [`NewPendingTransactionsSubscription`](/api/web3-eth/class/NewPendingTransactionsSubscription).
-   `pendingTransactions`: same as `newPendingTransactions`.

```js
import { Web3 } from "web3";

const web3 = new Web3("wss://ethereum-rpc.publicnode.com");

async function subscribe() {
  //create subcription
  const subcription = await web3.eth.subscribe("pendingTransactions"); //or ("newPendingTransactions")

  //print tx hashs of pending transactions
  subcription.on("data", (data) => console.log(data));

  //unsubscribe 
  //await subcription.unsubscribe();
}

subscribe();
```

### Block headers

-   `newBlockHeaders`: implemented in the class [`NewHeadsSubscription`](/api/web3-eth/class/NewHeadsSubscription).
-   `newHeads` same as `newBlockHeaders`.

```js
import { Web3 } from "web3";

const web3 = new Web3("wss://ethereum-rpc.publicnode.com");

async function subscribe() {
  //create subcription
  const subcription = await web3.eth.subscribe("newBlockHeaders"); //or ("newHeads")

  //print block header everytime a block is mined
  subcription.on("data", (data) => console.log(data));

  //unsubscribe
  //await subcription.unsubscribe();
}

subscribe();
```

### Syncing

-   `syncing`: implemented in the class [`SyncingSubscription`](/api/web3-eth/class/SyncingSubscription)

```js
import { Web3 } from "web3";

const web3 = new Web3("wss://ethereum-rpc.publicnode.com");

async function subscribe() {
  //create subcription
  const subcription = await web3.eth.subscribe("syncing");

  //this will return `true` when the node is syncing 
  //when it’s finished syncing will return `false`, for the `changed` event.
  subcription.on("data", (data) => console.log(data));

  //unsubscribe
  //await subcription.unsubscribe();
}

subscribe();

```


