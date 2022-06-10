/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * ## setProvider
 *
 * ```ts
 * web3.setProvider(myProvider)
 * web3.eth.setProvider(myProvider)
 * ...
 * ```
 *
 * Will change the provider for its module.
 *
 * **_NOTE:_** When called on the umbrella package web3 it will also set the provider for all sub modules web3.eth  etc.
 *
 * See details: {@link Web3.setProvider}
 *
 * #### Example: Local Geth Node
 * ```ts
 * import { Web3 } from "web3";
 * let web3: Web3 = new Web3('http://localhost:8545');
 * // or
 * let web3: Web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
 *
 * // change provider
 * web3.setProvider('ws://localhost:8546');
 * // or
 * web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
 *
 * //todo add IPC provider
 * ```
 *
 * @param provider A valid provider
 *
 * #### Example: Remote Geth Node
 *
 * ```ts
 * // Using a remote node provider, like Alchemy (https://www.alchemyapi.io/supernode), is simple.
 * import { Web3 } from "web3";
 * let web3: Web3 = new Web3("https://eth-mainnet.alchemyapi.io/v2/your-api-key");
 * ```
 *
 * ## providers
 *
 * ```ts
 * web3.providers
 * web3.eth.providers
 * ```
 * Contains the current available providers.
 *
 * #### Value
 *  `Object` with the following providers:
 *
 *
 *  + `Object` - `HttpProvider`: HTTP provider, does not support subscriptions.
 *
 *
 *  + `Object` - `WebSocketProvider`: The WebSocket provider is the standard for usage in legacy browsers.
 *
 *
 *  + `Object` - `IpcProvider`: The IPC provider is used in node.js dapps when running a local node. Gives the most secure connection.
 *
 *
 * #### Configuration
 *
 * ```ts
 *
 * //===
 * //Http
 * //===
 *
 * import Web3HttpProvider, { HttpProviderOptions } from "web3-providers-http";
 *
 * let options: HttpProviderOptions = {
 * 	providerOptions: {
 * 		keepalive: true,
 * 		credentials: "omit",
 * 		headers: {
 * 			"Access-Control-Allow-Origin": "*",
 * 		},
 * 	},
 * };
 *
 *
 * var provider = new Web3HttpProvider("http://localhost:8545", options);
 * web3.setProvider(provider);
 *
 * //===
 * //WebSockets
 * //===
 * import Web3WsProvider, {
 * 	ClientOptions,
 * 	ClientRequestArgs,
 * 	ReconnectOptions,
 * } from "web3-providers-ws";
 *
 *
 * let clientOptions: ClientOptions = {
 * 	// Useful for credentialed urls, e.g: ws://username:password@localhost:8546
 * 	headers: {
 * 		authorization: "Basic username:password",
 * 	},
 * 	maxPayload: 100000000,
 * };
 *
 * // Enable auto reconnection
 * let reconnectOptions: ReconnectOptions = {
 * 	autoReconnect: true,
 * 	delay: 5000, // ms
 * 	maxAttempts: 5,
 * };
 *
 * //clientOptions and reconnectOptions are optional
 * //clientOptions: ClientOptions | ClientRequestArgs
 * let ws = new Web3WsProvider(
 * "ws://localhost:8546",
 * clientOptions,
 * reconnectOptions
 * );
 * web3.setProvider(ws);
 *
 * ```
 *
 * See details: {@link Web3.providers}
 *
 * #### Example
 * ```ts
 * import Web3 from 'web3';
 * // use the given Provider or instantiate a new websocket provider
 * let web3 = new Web3(Web3.givenProvider || 'ws://remotenode.com:8546');
 * // or
 * let web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://remotenode.com:8546'));
 *
 * // Using the IPC provider in node.js
 * var web3 = new Web3(new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc')); // mac os path
 * // on windows the path is: "\\\\.\\pipe\\geth.ipc"
 * // on linux the path is: "/users/myuser/.ethereum/geth.ipc"
 * ```
 */
/**
 * This comment _supports3_ [Markdown](https://marked.js.org/)
 */
import { Web3 } from './web3';

export * from './web3';

export default Web3;
