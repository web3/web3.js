---
sidebar_position: 1
sidebar_label: 'Event Listening'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Providers Events Listening

Some providers are, by design, always connected. Therefor, they can communicate changes with the user through events. Actually, among the 3 providers, `HttpProvider` is the only one that does not support event. And the other 2:
[WebSocketProvider](/api/web3-providers-ws/class/WebSocketProvider) and [IpcProvider](/api/web3-providers-ipc/class/IpcProvider) enable the user to listen to emitted events.

Actually, the events can be categorized as follows ([according to EIP 1193](https://eips.ethereum.org/EIPS/eip-1193#rationale)):

-   Communicate arbitrary messages: `message`
-   Changes to the Provider’s ability to make RPC requests;
    -   `connect`
    -   `disconnect`
-   Common Client and/or Wallet state changes that any non-trivial application must handle:
    -   `chainChanged`
    -   `accountsChanged`

Below a sample code for listening and remove listening to EIP 1193 events:

<Tabs groupId="prog-lang" queryString>

  <TabItem value="javascript" label="JavaScript" 
  	attributes={{className: "javascript-tab"}}>

```javascript
const { Web3 } = require('web3');

const web3 = new Web3(/* PROVIDER*/);

web3.provider.on('message',()=>{
  // ...
})

web3.provider.on('connect',()=>{
  // ...
})

web3.provider.on('disconnect',()=>{
  // ...
})

web3.provider.on('accountsChanged',()=>{
  // ...
})

web3.provider.on('chainChanged',()=>{
  // ...
})

// it is possible to catch errors that could happen in the underlying connection Socket with the `error` event
// and it is also used to catch the error when max reconnection attempts exceeded
//  as in section: /docs/guides/web3_providers_guide/#error-message
web3.provider.on('error',()=>{
  // ...
})

// ...

// for every event above `once` can be used to register to the event only once
web3.provider.once('SUPPORTED_EVENT_NAME',()=>{
  // ...
})

// And to unregister a listener `removeListener` could be called
web3.provider.removeListener('SUPPORTED_EVENT_NAME',()=>{
  // ...
})
```

  </TabItem>
  
  <TabItem value="typescript" label="TypeScript" default
  	attributes={{className: "typescript-tab"}}>

```typescript
import { Web3 } from 'web3'

const web3 = new Web3(/* PROVIDER*/);

web3.provider.on('message',()=>{
  // ...
})

web3.provider.on('connect',()=>{
  // ...
})

web3.provider.on('disconnect',()=>{
  // ...
})

web3.provider.on('accountsChanged',()=>{
  // ...
})

web3.provider.on('chainChanged',()=>{
  // ...
})

// it is possible to catch errors that could happen in the underlying connection Socket with the `error` event
// and it is also used to catch the error when max reconnection attempts is exceeded
//  as in section: /docs/guides/web3_providers_guide/#error-message
web3.provider.on('error',()=>{
  // ...
})

// ...

// for every event above `once` can be used to register to the event only once
web3.provider.once('SUPPORTED_EVENT_NAME',()=>{
  // ...
})

// And to unregister a listener `removeListener` could be called
web3.provider.removeListener('SUPPORTED_EVENT_NAME',()=>{
  // ...
})
```

  </TabItem>
</Tabs>

However, the underlying `SocketConnection` of both `WebSocketProvider` and `IpcProvider` could be accessed. This enables the user to access any special properties of the used Socket. As well as, registering to the custom server events directly. Actually the Socket used at `WebSocketProvider` is [isomorphic-ws](https://github.com/heineiuo/isomorphic-ws). And the Socket used at `IpcProvider` is [net.Server](https://nodejs.org/api/net.html#class-netserver)
