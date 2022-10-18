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
import { Web3Context } from 'web3-core';
import { UnableToPopulateNonceError } from 'web3-errors';
import { ethRpcMethods } from 'web3-rpc-methods';
import { Address, BlockNumberOrTag, EthExecutionAPI } from 'web3-types';
import { DataFormat, DEFAULT_RETURN_FORMAT, format } from 'web3-utils';
import { isNullish } from 'web3-validator';

export const getTransactionNonce = async <ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address?: Address,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
) => {
	if (isNullish(address)) {
		// TODO if (web3.eth.accounts.wallet) use address from local wallet
		throw new UnableToPopulateNonceError();
	}

	return format(
		{ eth: 'uint' },
		await ethRpcMethods.getTransactionCount(web3Context.requestManager, address, blockNumber),
		returnFormat,
	);
};
