---
sidebar_position: 9
sidebar_label: web3.eth.subscribe
---

# web3.eth.subscribe Migration Guide

## Breaking Changes

### Subscribing to events

You subscribe to blockchain events using the `web3.eth.subscribe` API.

However, in web3.js version 1.x, for example, you could subscribe to the `newBlockHeaders` event, in one step, with the following code snippet:

```typescript
var subscription = web3.eth.subscribe('newBlockHeaders', function (error, result) {
	if (!error) console.log(result);
});
```

But, in web3.js Version 4.x, the function signature has changed for `web3.eth.subscribe`. In addition, the way you get notified for `data` and `error` has also changed. It is now in 2 steps: First you subscribe and then you listen to events. Here's an example of how you would subscribe to the same `newBlockHeaders` event in web3.js version 4.x:

```typescript
// in 4.x
const subscription = await web3.eth.subscribe('newHeads');

// note that in version 4.x the way you get notified for `data` and `error` has changed
subscription.on('data', async blockhead => {
	console.log('New block header: ', blockhead);
});
subscription.on('error', error =>
	console.log('Error when subscribing to New block header: ', error),
);
```

#### Differences

In summary, the differences you need to be aware of when subscribing to blockchain events in web3.js version 4.x are:

-   The `subscribe` function signature has changed:
    -   It does not accept a callback function.
    -   It returns a subscription object that you can use to listen to `data` and `error` events.
-   You should now use the `on`, or `once`, method on the newly returned subscription object to listen to `data` and `error` events, instead of passing a callback function directly.
-   You can have multiple event listeners, if you have, for example multiple `on` calls. And you can get the number of listeners in your code by calling `listenerCount(event_name)` or get the listeners with `listeners(event_name)`.

Keep in mind that these differences apply to all blockchain event subscriptions, not just to the `newBlockHeaders` event.

### New Block Headers event

In 1.x, `web3.eth.subscribe('newBlockHeaders')` was used to subscribe to new block headers.

In 4.x, either `web3.eth.subscribe('newHeads')` or `web3.eth.subscribe('newBlockHeaders')` can be used to subscribe to new block headers.

### web3.eth.clearSubscriptions

In 1.x, `web3.eth.clearSubscriptions` returns `true` on success.

In 4.x, `web3.eth.clearSubscriptions` returns an `Array of subscription ids`.

```typescript
// in 1.x
var subscription = web3.eth.subscribe('newBlockHeaders', function (error, result) {
	if (!error) console.log(result);
});
web3.eth.clearSubscriptions(function (error, success) {
	console.log(success); // true
});

// in 4.x
const subscription = await web3.eth.subscribe('newHeads');

// note that in version 4.x the way you get notified for `data` and `error` has changed
newBlocksSubscription.on('data', async blockhead => {
	console.log('New block header: ', blockhead);
});
newBlocksSubscription.on('error', error =>
	console.log('Error when subscribing to New block header: ', error),
);

const ids = await web3.eth.clearSubscriptions();
console.log(ids); // [...] An array of subscription ids that were cleared

// note that you can unsubscribe from a specific subscription by calling unsubscribe()
//	on that subscription object: `await subscription.unsubscribe();` and this would return void if succeeded.
```
