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
import { hexToBytes } from 'web3-utils';
import { Chain, Common, Hardfork } from '../../../src/common';

import * as timestampJson from '../../fixtures/common/shanghai-time.json';

describe('[Common]: Timestamp Hardfork logic', () => {
	it('shanghai-time', () => {
		const c = Common.fromGethGenesis(timestampJson, {
			chain: 'withdrawals',
		});
		expect(c.getHardforkByBlockNumber(1, undefined, 0)).toEqual(Hardfork.MergeForkIdTransition);
		expect(c.getHardforkByBlockNumber(1, undefined, 1668699476)).toEqual(Hardfork.Shanghai);
		expect(c.getHardforkByBlockNumber(1, undefined, 1668699576)).toEqual(Hardfork.Shanghai);
	});

	it('schedule sharding on shanghai-time', () => {
		const config = {
			...timestampJson.config,
			shardingForkTime: timestampJson.config.shanghaiTime,
		};
		const modifiedJson = { ...timestampJson, config };
		const c = Common.fromGethGenesis(modifiedJson, {
			chain: 'modified',
		});
		expect(c.getHardforkByBlockNumber(1, undefined, 0)).toEqual(Hardfork.MergeForkIdTransition);
		expect(c.nextHardforkBlockOrTimestamp(Hardfork.Shanghai)).toBeNull();
	});

	it('schedule sharding post shanghai-time', () => {
		const config = {
			...timestampJson.config,
			shardingForkTime: timestampJson.config.shanghaiTime + 1000,
		};
		const modifiedJson = { ...timestampJson, config };
		const c = Common.fromGethGenesis(modifiedJson, {
			chain: 'modified',
		});
		expect(c.getHardforkByBlockNumber(1, undefined, 0)).toEqual(Hardfork.MergeForkIdTransition);
		// Should give the shanghai as sharding is schedule a bit post shanghai
		expect(c.getHardforkByBlockNumber(1, undefined, 1668699476)).toEqual(Hardfork.Shanghai);
		expect(c.getHardforkByBlockNumber(1, undefined, 1668699576)).toEqual(Hardfork.Shanghai);
	});

	it('forkHash', () => {
		const mainnet = new Common({ chain: Chain.Mainnet });
		const hfs = mainnet.hardforks();
		const mergeIndex = hfs.findIndex(hf => hf.name === Hardfork.Merge);
		const hardforks = hfs.slice(0, mergeIndex + 1).concat([
			// Add these hardforks as specified here:
			//   https://github.com/ethereum/EIPs/pull/6122/files
			{
				name: 'mergeForkIdTransition',
				block: 18000000,
				forkHash: '0x4fb8a872',
			},
			{
				name: 'shanghai',
				// eslint-disable-next-line no-null/no-null
				block: null,
				timestamp: '1668000000',
				forkHash: '0xc1fdf181',
			},
		]);

		const c = Common.custom({ hardforks }, { baseChain: Chain.Mainnet });
		const mainnetGenesisHash = hexToBytes(
			'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
		);
		for (const hf of c.hardforks()) {
			if (typeof hf.forkHash !== 'string') {
				continue;
			}
			expect(c._calcForkHash(hf.name, mainnetGenesisHash)).toEqual(hf.forkHash);
		}

		c.setHardfork(Hardfork.MergeForkIdTransition);
		expect(c.nextHardforkBlockOrTimestamp()).toEqual(BigInt(1668000000));

		c.setHardfork(Hardfork.Shanghai);
		expect(c.forkHash()).toBe('0xc1fdf181');
		expect(c.hardforkForForkHash('0xc1fdf181')?.name).toEqual(Hardfork.Shanghai);
	});

	it('setForkHashes', () => {
		const mainnet = new Common({ chain: Chain.Mainnet });
		const hfs = mainnet.hardforks();
		const mergeIndex = hfs.findIndex(hf => hf.name === Hardfork.Merge);
		const hardforks = hfs.slice(0, mergeIndex + 1).concat([
			// Add these hardforks as specified here:
			//   https://github.com/ethereum/EIPs/pull/6122/files
			{
				name: 'mergeForkIdTransition',
				block: 18000000,
			},
			{
				name: 'shanghai',
				// eslint-disable-next-line no-null/no-null
				block: null,
				timestamp: '1668000000',
			},
		]);

		const c = Common.custom({ hardforks }, { baseChain: Chain.Mainnet });
		const mainnetGenesisHash = hexToBytes(
			'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
		);

		let noForkHashes = c.hardforks().reduce((acc, hf) => {
			if (hf.forkHash === undefined) {
				// eslint-disable-next-line no-param-reassign
				acc += 1;
			}
			return acc;
		}, 0);
		expect(noForkHashes).toBe(2);

		c.setForkHashes(mainnetGenesisHash);
		noForkHashes = c.hardforks().reduce((acc, hf) => {
			if (hf.forkHash === undefined) {
				// eslint-disable-next-line no-param-reassign
				acc += 1;
			}
			return acc;
		}, 0);
		expect(noForkHashes).toBe(0);
		expect(c.forkHash(Hardfork.Shanghai)).toBe('0xc1fdf181');
	});
});
