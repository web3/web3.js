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
import { Web3PromiEvent } from 'web3-common';
import { ReceiptInfo, SendTransactionEvents, Web3Eth } from '../../src';

type SendFewTxParams = {
	web3Eth: Web3Eth;
	to: string;
	from: string;
	value: string;
	times?: number;
};
export type Resolve = (value?: ReceiptInfo) => void;
export const sendFewTxes = async ({
	web3Eth,
	to,
	value,
	from,
	times = 3,
}: SendFewTxParams): Promise<ReceiptInfo[]> => {
	const res = [];
	for (let i = 0; i < times; i += 1) {
		const tx: Web3PromiEvent<ReceiptInfo, SendTransactionEvents> = web3Eth.sendTransaction({
			to,
			value,
			from,
		});
		res.push(
			// eslint-disable-next-line no-await-in-loop
			(await new Promise((resolve: Resolve) => {
				// tx promise is handled separately
				// eslint-disable-next-line no-void
				void tx.on('receipt', (params: ReceiptInfo) => {
					expect(params.status).toBe(BigInt(1));
					resolve(params);
				});
			})) as ReceiptInfo,
		);
	}
	return res;
};
