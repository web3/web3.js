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
import { Block, TransactionInfo, TransactionReceipt } from 'web3-types';
import { DEFAULT_RETURN_FORMAT, FMT_NUMBER } from 'web3-utils';
import { Web3PromiEvent } from 'web3-core';
import { AbiEventFragment } from 'web3-eth-abi';
import { SendTransactionEvents, Web3Eth } from '../../src';
import { BasicAbi } from '../shared_fixtures/build/Basic';

type SendFewTxParams = {
	web3Eth: Web3Eth;
	to: string;
	from: string;
	value: string;
	times?: number;
};
export type Resolve = (value?: TransactionReceipt) => void;
export const sendFewTxes = async ({
	web3Eth,
	to,
	value,
	from,
	times = 3,
}: SendFewTxParams): Promise<TransactionReceipt[]> => {
	const res: TransactionReceipt[] = [];
	for (let i = 0; i < times; i += 1) {
		const tx: Web3PromiEvent<
			TransactionReceipt,
			SendTransactionEvents<typeof DEFAULT_RETURN_FORMAT>
		> = web3Eth.sendTransaction({
			to,
			value,
			from,
		});
		res.push(
			// eslint-disable-next-line no-await-in-loop
			(await new Promise((resolve: Resolve) => {
				// tx promise is handled separately
				// eslint-disable-next-line no-void
				void tx.on('receipt', (params: TransactionReceipt) => {
					expect(params.status).toBe(BigInt(1));
					resolve(params);
				});
			})) as TransactionReceipt,
		);
	}

	return res;
};

const regexHex20 = /0[xX][0-9a-fA-F]{40}/i;
const regexHex32 = /0[xX][0-9a-fA-F]{64}/i;

type ExpectOptions = {
	type?: number;
};
export const validateTransaction = (
	tx: TransactionInfo,
	expectOptions: ExpectOptions = { type: 0 },
) => {
	expect(tx.nonce).toBeDefined();
	expect(tx.hash).toMatch(regexHex32);
	expect(Number(tx.type)).toBe(expectOptions.type);
	expect(tx.blockHash).toMatch(regexHex32);
	expect(Number(tx.blockNumber)).toBeGreaterThan(0);
	expect(tx.transactionIndex).toBeDefined();
	expect(tx.from).toMatch(regexHex20);
	expect(tx.to).toMatch(regexHex20);
	expect(Number(tx.value)).toBe(1);
	expect(tx.input).toBe('0x');
	expect(tx.r).toBeDefined();
	expect(tx.s).toBeDefined();
	expect(Number(tx.gas)).toBeGreaterThan(0);
};
export const validateBlock = (b: Block) => {
	expect(b.nonce).toBeDefined();
	expect(Number(b.baseFeePerGas)).toBeGreaterThan(0);
	expect(b.number).toBeDefined();
	expect(b.hash).toMatch(regexHex32);
	expect(b.parentHash).toMatch(regexHex32);
	expect(b.sha3Uncles).toMatch(regexHex32);
	expect(b.transactionsRoot).toMatch(regexHex32);
	expect(b.receiptsRoot).toMatch(regexHex32);
	expect(b.logsBloom).toBeDefined();
	expect(b.miner).toMatch(regexHex20);
	expect(b.difficulty).toBeDefined();
	expect(b.stateRoot).toMatch(regexHex32);
	expect(b.gasLimit).toBeDefined();
	expect(b.gasUsed).toBeDefined();
	expect(b.timestamp).toBeDefined();
	expect(b.extraData).toBeDefined();
	expect(b.mixHash).toMatch(regexHex32);
	expect(b.totalDifficulty).toBeDefined();
	expect(b.baseFeePerGas).toBeDefined();
	expect(b.size).toBeDefined();
	expect(Array.isArray(b.transactions)).toBe(true);
	expect(Array.isArray(b.uncles)).toBe(true);
};
export const validateReceipt = (r: TransactionReceipt) => {
	expect(r.transactionHash).toMatch(regexHex32);
	expect(r.transactionIndex).toBeDefined();
	expect(r.blockHash).toMatch(regexHex32);
	expect(r.blockNumber).toBeDefined();
	expect(r.from).toMatch(regexHex20);
	expect(r.to).toMatch(regexHex20);
	expect(r.cumulativeGasUsed).toBeDefined();
	expect(r.gasUsed).toBeDefined();
	expect(r.effectiveGasPrice).toBeDefined();
	expect(r.logs).toBeDefined();
	expect(r.logsBloom).toBeDefined();
	expect(r.status).toBeDefined();
	expect(r.transactionHash).toMatch(regexHex32);
	expect(Number(r.gasUsed)).toBeGreaterThan(0);
};

export const mapFormatToType: { [key: string]: string } = {
	[FMT_NUMBER.NUMBER]: 'number',
	[FMT_NUMBER.HEX]: 'string',
	[FMT_NUMBER.STR]: 'string',
	[FMT_NUMBER.BIGINT]: 'bigint',
};
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const eventAbi: AbiEventFragment = BasicAbi.find((e: any) => {
	return e.name === 'StringEvent' && (e as AbiEventFragment).type === 'event';
})! as AbiEventFragment;
