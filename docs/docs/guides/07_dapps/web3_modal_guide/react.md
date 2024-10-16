---
sidebar_position: 1
sidebar_label: 'Web3Modal with React'
---

# Web3Modal with React and web3js

## Live code editor

<iframe width="100%" height="700px"  src="https://stackblitz.com/edit/vitejs-vite-cg7ctd?embed=1&file=src%2FApp.tsx"></iframe>

## Installation

For this guide we will be creating a new project will need to install dependancies. We will be using vite to locally host the app, React and web3modal-web3js

```bash
npm install web3modal-web3js react react-dom
npm install --save-dev vite @vitejs/plugin-react
```

## Implementation

Within the root of the project create `index.html`

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>React Web3 example</title>
	</head>
	<body>
		<div id="app"></div>
		<script type="module" src="/src/main.tsx"></script>
	</body>
</html>
```

Now we will add the Web3modal code within `src/Web3modal.tsx`

```typescript
import { createWeb3Modal, defaultConfig } from 'web3modal-web3/react';

// 1. Get projectId, Your Project ID can be obtained from walletconnect.com
const projectId = 'YOUR_PROJECT_ID';

// 2. Set chains
const mainnet = {
	chainId: 1,
	name: 'Ethereum',
	currency: 'ETH',
	explorerUrl: 'https://etherscan.io',
	rpcUrl: 'https://cloudflare-eth.com',
};

// 3. Create a metadata object
const metadata = {
	name: 'My Website',
	description: 'My Website description',
	url: 'https://mywebsite.com', // origin must match your domain & subdomain
	icons: ['https://avatars.mywebsite.com/'],
};

// 4. Create web3 config
const web3Config = defaultConfig({
	/*Required*/
	metadata,

	/*Optional*/
	enableEIP6963: true, // true by default
	enableInjected: true, // true by default
	enableCoinbase: true, // true by default
	rpcUrl: '...', // used for the Coinbase SDK
	defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
	web3Config,
	chains: [mainnet],
	projectId,
	enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export default function App() {
	return <YourApp />;
}
```

Set up vite configs within root `vite.config.js`

```javascript
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
});
```

And finally add react to the app `src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

ReactDOM.createRoot(document.getElementById('app')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
```

You are finished and have successfully created Web3modal with React!

:::info

-   For additional information take a look into the interactive code editor above.
-   Learn more about Web3modal [here](https://docs.walletconnect.com/web3modal/about)
    :::
