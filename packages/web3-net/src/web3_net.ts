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

import { DataFormat, DEFAULT_RETURN_FORMAT } from 'web3-common';
import { Web3Context } from 'web3-core';
import * as rpcMethodsWrappers from './rpc_method_wrappers';
import { Web3NetAPI } from './web3_net_api';

export class Web3Net extends Web3Context<Web3NetAPI> {
	public async getId<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getId(this, returnFormat);
	}

	public async getPeerCount<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getPeerCount(this, returnFormat);
	}

	public async isListening() {
		return rpcMethodsWrappers.isListening(this);
	}
}
