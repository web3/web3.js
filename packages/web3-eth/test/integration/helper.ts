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
import { Block, FMT_NUMBER, Web3PromiEvent } from 'web3-common';
import { AbiEventFragment } from 'web3-eth-abi';
import { ReceiptInfo, SendTransactionEvents, TransactionInfo, Web3Eth } from '../../src';
import { BasicAbi } from '../shared_fixtures/build/Basic';

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

export const validateTransaction = (tx: TransactionInfo) => {
	expect(tx.nonce).toBeDefined();
	expect(tx.hash).toBeDefined();
	expect(String(tx.hash)?.length).toBe(66);
	expect(Number(tx.type)).toBe(0);
	expect(tx.blockHash).toBeDefined();
	expect(String(tx.blockHash)?.length).toBe(66);
	expect(Number(tx.blockNumber)).toBeGreaterThan(0);
	expect(tx.transactionIndex).toBeDefined();
	expect(tx.from?.length).toBe(42);
	expect(tx.to?.length).toBe(42);
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
	expect(b.hash).toBeDefined();
	expect(b.parentHash?.length).toBe(66);
	expect(b.sha3Uncles?.length).toBe(66);
	expect(b.transactionsRoot).toHaveLength(66);
	expect(b.receiptsRoot).toHaveLength(66);
	expect(b.logsBloom).toBeDefined();
	expect(b.miner).toHaveLength(42);
	expect(b.difficulty).toBeDefined();
	expect(b.stateRoot).toHaveLength(66);
	expect(b.gasLimit).toBeDefined();
	expect(b.gasUsed).toBeDefined();
	expect(b.timestamp).toBeDefined();
	expect(b.extraData).toBeDefined();
	expect(b.mixHash).toBeDefined();
	expect(b.totalDifficulty).toBeDefined();
	expect(b.baseFeePerGas).toBeDefined();
	expect(b.size).toBeDefined();
	expect(Array.isArray(b.transactions)).toBe(true);
	expect(Array.isArray(b.uncles)).toBe(true);
};
export const validateReceipt = (r: ReceiptInfo) => {
	expect(r.transactionHash).toBeDefined();
	expect(r.transactionIndex).toBeDefined();
	expect(r.blockHash).toBeDefined();
	expect(r.blockNumber).toBeDefined();
	expect(r.from).toBeDefined();
	expect(r.to).toBeDefined();
	expect(r.cumulativeGasUsed).toBeDefined();
	expect(r.gasUsed).toBeDefined();
	expect(r.effectiveGasPrice).toBeDefined();
	expect(r.logs).toBeDefined();
	expect(r.logsBloom).toBeDefined();
	expect(r.status).toBeDefined();
	expect(String(r.transactionHash)).toHaveLength(66);
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
