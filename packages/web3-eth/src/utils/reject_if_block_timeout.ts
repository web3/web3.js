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
import { EthExecutionAPI, Bytes } from 'web3-types';
import { Web3Context } from 'web3-core';
import { rejectIfConditionAtInterval } from 'web3-utils';

import { TransactionBlockTimeoutError } from 'web3-errors';
import { NUMBER_DATA_FORMAT } from '../constants';
// eslint-disable-next-line import/no-cycle
import { getBlockNumber } from '../rpc_method_wrappers';

export function rejectIfBlockTimeout(
	web3Context: Web3Context<EthExecutionAPI>,
	starterBlockNumber: number,
	interval: number,
	transactionHash?: Bytes,
): [NodeJS.Timer, Promise<never>] {
	return rejectIfConditionAtInterval(async () => {
		const lastBlockNumber = await getBlockNumber(web3Context, NUMBER_DATA_FORMAT);
		const numberOfBlocks = lastBlockNumber - starterBlockNumber;
		if (numberOfBlocks >= web3Context.transactionBlockTimeout) {
			return new TransactionBlockTimeoutError({
				starterBlockNumber,
				numberOfBlocks,
				transactionHash,
			});
		}
		return undefined;
	}, interval);
}
