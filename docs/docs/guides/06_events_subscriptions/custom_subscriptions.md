---
sidebar_position: 2
sidebar_label: 'Custom Subscriptions'
---

# Custom Subscription

You can extend the `Web3Subscription` class to create custom subscriptions. This way you can subscribe to custom events emitted by the provider.

:::note
This guide is most likely for advanced users who are connecting to a node that provides additional custom subscriptions. For normal users, the standard subscriptions are supported out of the box as you can find in [Supported Subscriptions](/guides/events_subscriptions).
:::

:::important
If you are the developer who provides custom subscriptions to users. We encourage you to develop a web3.js Plugin after you follow the guide below. However, you can find how to develop a plugin at [web3.js Plugin Developer Guide](/guides/web3_plugin_guide/plugin_authors).

And even if you are not the developer who provides this custom subscription, we encourage you to write a web3.js plugin for the custom subscription, and publish it to the npm package registry. This way you can help the community. And they might contribute to your repository by helping for things like: feature addition, maintenance, and bug detection.
:::

## Implementing the Subscription

### Extending `Web3Subscription`

To create a custom subscription, start by extending the `Web3Subscription` class. However, `Web3Subscription` is generically typed. And, generally, you need only to provide the first two types which are:

-   `EventMap` - The event map for events emitted by the subscription
-   `ArgsType` - The arguments passed to the subscription

For example:

```ts
class MyCustomSubscription extends Web3Subscription<
	{
		// here provide the type of the `data` that will be emitted by the node
		data: string;
	},
	// here specify the types of the arguments that will be passed to the node when subscribing
	{
		customArg: string;
	}
> {
	// ...
}
```

### Specify the Subscription Arguments

You need to specify the exact data that will be passed to the provider. You do this by overriding `_buildSubscriptionParams` in your class. It could be something as follow:

```ts
protected _buildSubscriptionParams() {
  // the `someCustomSubscription` below is the name of the subscription provided by the node you are connected to.
  return ['someCustomSubscription', this.args];
}
```

With the implementation above, the call that will be made to the provider will be as follow:

```ts
{
  id: '[GUID-STRING]', // something like: '3f839900-afdd-4553-bca7-b4e2b835c687'
  jsonrpc: '2.0',
  method: 'eth_subscribe',
  // The `someCustomSubscription` below is the name of the subscription provided by the node you are connected to.
  // And the `args` is the variable that has the type you provided at the second generic type
  //  at your class definition. That is in the snippet above: `{customArg: string}`.
  // And its value is what you provided when you will call:
  //  `web3.subscriptionManager.subscribe('custom', args)`
  params: ['someCustomSubscription', args],
}
```

## Additional Custom Processing

You may need to do some processing in the constructor. Or you may need to do some formatting for the data before it will be fired by the event emitter. In this section you can check how to do either one of those or both.

### Custom Constructor

You can optionally write a constructor, in case you need to do some additional initialization or processing.
And here is an example constructor implementation:

```ts
constructor(
  args: {customArg: string},
  options: {
    subscriptionManager: Web3SubscriptionManager;
    returnFormat?: DataFormat;
  }
) {
  super(args, options);

  // Additional initialization
}
```

The constructor passes the arguments to the Web3Subscription parent class.

You can access the subscription manager via `this.subscriptionManager`.

### Custom formatting

In case you need to format the data received from the node before it will be emitted, you just need to override the protected method `formatSubscriptionResult` in your class. It will be something like the following. However, the data type could be whatever provided by the node and it is what you should already provided at the first generic type when you extended `Web3Subscription`:

```ts
protected formatSubscriptionResult(data: string) {
  const formattedData = format(data);
  return formattedData;
}
```

## Subscribing and Unsubscribing

To subscribe, you need to pass the custom subscriptions to the `Web3`. And then you can call the `subscribe` method for your custom subscription, as in the following sample:

```ts
const CustomSubscriptions = {
	// the key (`custom`) is what you choose to use when you call `web3.subscriptionManager.subscribe`.
	// the value (`CustomSubscription`) is your class name.
	custom: MyCustomSubscription,
	// you can have as many custom subscriptions as you like...
	// custom2: MyCustomSubscription2,
	// custom3: MyCustomSubscription3,
};

const web3 = new Web3({
	provider, // the provider that support the custom event that you like to subscribe to.
	registeredSubscriptions: CustomSubscriptions,
});

// subscribe at the provider:
// Note: this will internally initialize a new instance of `MyCustomSubscription`,
// call `_buildSubscriptionParams`, and then send the `eth_subscribe` RPC call.
const sub = web3.subscriptionManager.subscribe('custom', args);

// listen to the emitted event:
// Note: the data will be optionally formatted at `formatSubscriptionResult`, before it is emitted here.
sub.on('data', result => {
	// This will be called every time a new data arrived from the provider to this subscription
});
```

To unsubscribe:

```ts
// this will send `eth_unsubscribe` to stop the subscription.
await sub.unsubscribe();
```

## Putting it Together

Here is the full example for a custom subscription implementation:

```ts
// Subscription class
class MyCustomSubscription extends Web3Subscription<
	{
		// here provide the type of the `data` that will be emitted by the node
		data: string;
	},
	// here specify the types of the arguments that will be passed to the node when subscribing
	{
		customArg: string;
	}
> {
	protected _buildSubscriptionParams() {
		// the `someCustomSubscription` below is the name of the subscription provided by the node your are connected to.
		return ['someCustomSubscription', this.args];
	}

	protected formatSubscriptionResult(data: string) {
		return format(data);
	}

	constructor(
		args: { customArg: string },
		options: {
			subscriptionManager: Web3SubscriptionManager;
			returnFormat?: DataFormat;
		},
	) {
		super(args, options);

		// Additional initialization
	}
}

// Usage

const args = {
	customArg: 'hello custom',
};

const CustomSubscriptions = {
	// the key (`custom`) is what you chose to use when you call `web3.subscriptionManager.subscribe`.
	// the value (`MyCustomSubscription`) is your class name.
	custom: MyCustomSubscription,
	// you can have as many custom subscriptions as you like...
	// custom2: MyCustomSubscription2,
	// custom3: MyCustomSubscription3,
};

const web3 = new Web3({
	provider, // the provider that support the custom event that you like to subscribe to.
	registeredSubscriptions: CustomSubscriptions,
});

const sub = web3.subscriptionManager.subscribe('custom', args);

sub.on('data', result => {
	// New data
});

/* Unsubscribe:
If you want to subscribe later based on some code logic:

if () { await sub.subscribe(); }
*/
```

## Key points

### Subscription definition

-   Extend the `Web3Subscription` class to create a custom subscription.
-   Specify in the generic typing the event data and subscription argument types.
-   Override `_buildSubscriptionParams()` to define the RPC parameters.
-   Optionally add a custom constructor for initialization logic.
-   Optionally format results with `format SubscriptionResult()` before emitting data.

### Subscription usage

-   Register the subscription by passing it in `Web3` constructor options.
-   Subscribe/unsubscribe using the `subscriptionManager`.
-   Listen to subscription events like `'data'` for new results.

## Conclusion

In summary, web3.js subscriptions provide a flexible way to subscribe to custom provider events. By extending `Web3Subscription`, implementing the key methods, and registering with `Web3`, you can create tailored subscriptions for whatever custom events the provider can emit. The subscriptions API handles the underlying JSON-RPC calls and allows custom processing and formatting of results.
