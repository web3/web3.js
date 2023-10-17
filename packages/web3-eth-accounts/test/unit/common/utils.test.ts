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
import { Common } from '../../../src/common/common';
import { Hardfork } from '../../../src/common';
import { parseGethGenesis } from '../../../src/common/utils';
import testnet from '../../fixtures/common/testnetValid.json';
import invalidSpuriousDragon from '../../fixtures/common/invalid-spurious-dragon.json';
import poa from '../../fixtures/common/poa.json';
import postMerge from '../../fixtures/common/post-merge.json';
import noExtraData from '../../fixtures/common/no-extra-data.json';
import gethGenesisKiln from '../../fixtures/common/geth-genesis-kiln.json';
import postMergeHardfork from '../../fixtures/common/post-merge-hardfork.json';

describe('[Utils/Parse]', () => {
	const kilnForkHashes: any = {
		chainstart: '0xbcadf543',
		homestead: '0xbcadf543',
		tangerineWhistle: '0xbcadf543',
		spuriousDragon: '0xbcadf543',
		byzantium: '0xbcadf543',
		constantinople: '0xbcadf543',
		petersburg: '0xbcadf543',
		istanbul: '0xbcadf543',
		berlin: '0xbcadf543',
		london: '0xbcadf543',
		mergeForkIdTransition: '0x013fd1b5',
		merge: '0x013fd1b5',
	};

	it('should parse geth params file', () => {
		const params = parseGethGenesis(testnet, 'rinkeby');
		expect(params.genesis.nonce).toBe('0x0000000000000042');
	});

	it('should throw with invalid Spurious Dragon blocks', () => {
		expect(() => {
			parseGethGenesis(invalidSpuriousDragon, 'bad_params');
		}).toThrow();
	});

	it('should import poa network params correctly', () => {
		let params = parseGethGenesis(poa, 'poa');
		expect(params.genesis.nonce).toBe('0x0000000000000000');
		expect(params.consensus).toEqual({
			type: 'poa',
			algorithm: 'clique',
			clique: { period: 15, epoch: 30000 },
		});
		poa.nonce = '00';
		params = parseGethGenesis(poa, 'poa');
		expect(params.genesis.nonce).toBe('0x0000000000000000');
		expect(params.hardfork).toEqual(Hardfork.London);
	});

	it('should generate expected hash with london block zero and base fee per gas defined', () => {
		const params = parseGethGenesis(postMerge, 'post-merge');
		expect(params.genesis.baseFeePerGas).toEqual(postMerge.baseFeePerGas);
	});

	it('should successfully parse genesis file with no extraData', () => {
		const params = parseGethGenesis(noExtraData, 'noExtraData');
		expect(params.genesis.extraData).toBe('0x');
		expect(params.genesis.timestamp).toBe('0x10');
	});

	it('should successfully parse kiln genesis and set forkhash', () => {
		const common = Common.fromGethGenesis(gethGenesisKiln, {
			chain: 'customChain',
			genesisHash: hexToBytes(
				'51c7fe41be669f69c45c33a56982cbde405313342d9e2b00d7c91a7b284dd4f8',
			),
			mergeForkIdPostMerge: false,
		});
		expect(common.hardforks().map(hf => hf.name)).toEqual([
			'chainstart',
			'homestead',
			'tangerineWhistle',
			'spuriousDragon',
			'byzantium',
			'constantinople',
			'petersburg',
			'istanbul',
			'berlin',
			'london',
			'mergeForkIdTransition',
			'merge',
		]);
		for (const hf of common.hardforks()) {
			/* eslint-disable @typescript-eslint/no-use-before-define */
			expect(hf.forkHash).toEqual(kilnForkHashes[hf.name]);
		}

		expect(common.hardfork()).toEqual(Hardfork.Merge);

		// Ok lets schedule shanghai at block 0, this should force merge to be scheduled at just after
		// genesis if even mergeForkIdTransition is not confirmed to be post merge
		// This will also check if the forks are being correctly sorted based on block
		Object.assign(gethGenesisKiln.config, { shanghaiTime: Math.floor(Date.now() / 1000) });
		const common1 = Common.fromGethGenesis(gethGenesisKiln, {
			chain: 'customChain',
		});
		// merge hardfork is now scheduled just after shanghai even if mergeForkIdTransition is not confirmed
		// to be post merge
		expect(common1.hardforks().map(hf => hf.name)).toEqual([
			'chainstart',
			'homestead',
			'tangerineWhistle',
			'spuriousDragon',
			'byzantium',
			'constantinople',
			'petersburg',
			'istanbul',
			'berlin',
			'london',
			'merge',
			'mergeForkIdTransition',
			'shanghai',
		]);

		expect(common1.hardfork()).toEqual(Hardfork.Shanghai);
	});

	it('should successfully parse genesis with hardfork scheduled post merge', async () => {
		const common = Common.fromGethGenesis(postMergeHardfork, {
			chain: 'customChain',
		});
		expect(common.hardforks().map(hf => hf.name)).toEqual([
			'chainstart',
			'homestead',
			'tangerineWhistle',
			'spuriousDragon',
			'byzantium',
			'constantinople',
			'petersburg',
			'istanbul',
			'muirGlacier',
			'berlin',
			'london',
			'merge',
			'shanghai',
		]);

		expect(common.getHardforkByBlockNumber(0)).toEqual(Hardfork.London);
		expect(common.getHardforkByBlockNumber(1, BigInt(2))).toEqual(Hardfork.Merge);
		// shanghai is at timestamp 8
		expect(common.getHardforkByBlockNumber(8)).toEqual(Hardfork.London);
		expect(common.getHardforkByBlockNumber(8, BigInt(2))).toEqual(Hardfork.Merge);
		expect(common.getHardforkByBlockNumber(8, undefined, 8)).toEqual(Hardfork.Shanghai);
		// should be post merge at shanghai
		expect(common.getHardforkByBlockNumber(8, BigInt(2), 8)).toEqual(Hardfork.Shanghai);
		// if not post merge, then should error
		expect(() => {
			common.getHardforkByBlockNumber(8, BigInt(1), 8);
		}).toThrow();

		expect(common.hardfork()).toEqual(Hardfork.Shanghai);
	});
});
