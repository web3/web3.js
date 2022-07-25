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

import { DataFormat, DEFAULT_RETURN_FORMAT } from 'web3-utils';
import { Web3Context } from 'web3-core';
import * as rpcMethodsWrappers from './rpc_method_wrappers';
import { Web3NetAPI } from './web3_net_api';

export class Net extends Web3Context<Web3NetAPI> {
	/**
	 * Gets the current network ID
	 *
	 * @param returnFormat - Return format
	 * @returns A Promise of the network ID.
	 * @example
	 * ```ts
	 * const net = new Net(Net.givenProvider || 'ws://some.local-or-remote.node:8546');
	 * await net.getId();
	 * > 1
	 * ```
	 */
	public async getId<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getId(this, returnFormat);
	}

	/**
	 * Get the number of peers connected to.
	 *
	 * @param returnFormat - Return format
	 * @returns A promise of the number of the peers connected to.
	 * @example
	 * ```ts
	 * const net = new Net(Net.givenProvider || 'ws://some.local-or-remote.node:8546');
	 * await net.getPeerCount();
	 * > 0
	 * ```
	 */
	public async getPeerCount<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getPeerCount(this, returnFormat);
	}

	/**
	 * Check if the node is listening for peers
	 *
	 * @returns A promise of a boolean if the node is listening to peers
	 * @example
	 * ```ts
	 * const net = new Net(Net.givenProvider || 'ws://some.local-or-remote.node:8546');
	 * await net.isListening();
	 * > true
	 * ```
	 */
	public async isListening() {
		return rpcMethodsWrappers.isListening(this);
	}
}
