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
import { Chain, Common, ConsensusAlgorithm, ConsensusType, Hardfork } from '../../../src/common';
import gethGenesisKiln from '../../fixtures/common/geth-genesis-kiln.json';

describe('[Common]: Hardfork logic', () => {
	it('Hardfork access', () => {
		const supportedHardforks = [
			Hardfork.Chainstart,
			Hardfork.Homestead,
			Hardfork.Dao,
			Hardfork.Chainstart,
			Hardfork.SpuriousDragon,
			Hardfork.Byzantium,
			Hardfork.Constantinople,
			Hardfork.Petersburg,
			Hardfork.Istanbul,
			Hardfork.Berlin,
			Hardfork.London,
			Hardfork.ArrowGlacier,
			Hardfork.GrayGlacier,
			Hardfork.Shanghai,
			Hardfork.Merge,
		];
		let c;

		for (const hardfork of supportedHardforks) {
			c = new Common({ chain: Chain.Mainnet, hardfork });
			expect(c.hardfork()).toEqual(hardfork);
		}
	});

	it('getHardforkByBlockNumber() / setHardforkByBlockNumber()', () => {
		let c = new Common({ chain: Chain.Mainnet });

		expect(c.getHardforkByBlockNumber(0)).toEqual(Hardfork.Chainstart);
		expect(c.getHardforkByBlockNumber(1149999)).toEqual(Hardfork.Chainstart);
		expect(c.getHardforkByBlockNumber(1150000)).toEqual(Hardfork.Homestead);
		expect(c.getHardforkByBlockNumber(1400000)).toEqual(Hardfork.Homestead);
		expect(c.getHardforkByBlockNumber(9200000)).toEqual(Hardfork.MuirGlacier);
		expect(c.getHardforkByBlockNumber(12244000)).toEqual(Hardfork.Berlin);
		expect(c.getHardforkByBlockNumber(12965000)).toEqual(Hardfork.London);
		expect(c.getHardforkByBlockNumber(13773000)).toEqual(Hardfork.ArrowGlacier);
		expect(c.getHardforkByBlockNumber(15050000)).toEqual(Hardfork.GrayGlacier);
		// merge is now specified at 15537394 in config
		expect(c.getHardforkByBlockNumber(999999999999)).toEqual(Hardfork.Merge);

		expect(c.setHardforkByBlockNumber(0)).toEqual(Hardfork.Chainstart);
		expect(c.setHardforkByBlockNumber(1149999)).toEqual(Hardfork.Chainstart);
		expect(c.setHardforkByBlockNumber(1150000)).toEqual(Hardfork.Homestead);
		expect(c.setHardforkByBlockNumber(1400000)).toEqual(Hardfork.Homestead);
		expect(c.setHardforkByBlockNumber(12244000)).toEqual(Hardfork.Berlin);
		expect(c.setHardforkByBlockNumber(12965000)).toEqual(Hardfork.London);
		expect(c.setHardforkByBlockNumber(13773000)).toEqual(Hardfork.ArrowGlacier);
		expect(c.setHardforkByBlockNumber(15050000)).toEqual(Hardfork.GrayGlacier);
		// merge is now specified at 15537394 in config
		expect(c.setHardforkByBlockNumber(999999999999)).toEqual(Hardfork.Merge);

		c = new Common({ chain: Chain.Sepolia });
		expect(c.setHardforkByBlockNumber(1735371)).toBe('mergeForkIdTransition');
	});

	it('should throw if no hardfork qualifies', () => {
		const hardforks = [
			{
				name: 'homestead',
				block: 3,
			},
			{
				name: 'tangerineWhistle',
				block: 3,
			},
			{
				name: 'spuriousDragon',
				block: 3,
			},
		];
		const c = Common.custom({ hardforks }, { baseChain: Chain.Sepolia });

		expect(() => {
			c.getHardforkByBlockNumber(0);
		}).toThrow();

		expect(c.setHardforkByBlockNumber(3)).toEqual(Hardfork.SpuriousDragon);
	});

	it('setHardfork(): hardforkChanged event', () => {
		const c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul });
		c.on('hardforkChanged', (hardfork: string) => {
			expect(hardfork).toEqual(Hardfork.Byzantium);
		});
		c.setHardfork(Hardfork.Byzantium);
	});

	it('hardforkBlock()', () => {
		let c = new Common({ chain: Chain.Goerli });
		expect(c.hardforkBlock(Hardfork.Byzantium)!).toEqual(BigInt(0));

		expect(c.hardforkBlock('thisHardforkDoesNotExist')).toBeNull();

		c = new Common({ chain: Chain.Sepolia, hardfork: Hardfork.MergeForkIdTransition });
		expect(c.hardforkBlock()!).toEqual(BigInt(1735371));

		c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul });
		expect(c.hardforkBlock()!).toEqual(BigInt(9069000));

		c = new Common({ chain: Chain.Mainnet });
		expect(c.hardforkBlock(Hardfork.Berlin)!).toEqual(BigInt(12244000));
		expect(c.hardforkBlock(Hardfork.Berlin)!).toEqual(BigInt(12244000));

		// developer note: when Shanghai is set,
		// update this test to next unscheduled hardfork.
		expect(c.hardforkBlock(Hardfork.Shanghai)).toBeNull();
		expect(c.hardforkBlock(Hardfork.Shanghai)).toBeNull();
		expect(c.nextHardforkBlockOrTimestamp(Hardfork.Shanghai)).toBeNull();
	});

	it('isHardforkBlock()', () => {
		let c = new Common({ chain: Chain.Sepolia });
		// eslint-disable-next-line deprecation/deprecation
		expect(c.isHardforkBlock(1450409)).toBe(true);
		// eslint-disable-next-line deprecation/deprecation
		expect(c.isHardforkBlock(1735372)).toBe(false);

		c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium });
		// eslint-disable-next-line deprecation/deprecation
		expect(c.isHardforkBlock(4370000)).toBe(true);
		// eslint-disable-next-line deprecation/deprecation
		expect(c.isHardforkBlock(2463001)).toBe(false);
	});

	it('nextHardforkBlockOrTimestamp()', () => {
		let c = new Common({ chain: Chain.Sepolia, hardfork: Hardfork.MergeForkIdTransition });
		expect(c.nextHardforkBlockOrTimestamp()!).toEqual(BigInt(1677557088));

		expect(c.nextHardforkBlockOrTimestamp('mergeForkIdTransition')!).toEqual(
			BigInt(1677557088),
		);
		expect(c.nextHardforkBlockOrTimestamp(Hardfork.Byzantium)!).toEqual(BigInt(1735371));
		expect(c.nextHardforkBlockOrTimestamp(Hardfork.London)).toEqual(BigInt(1735371));
		c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Chainstart });
		expect(c.nextHardforkBlockOrTimestamp()!).toEqual(BigInt(1561651));
	});

	it('isNextHardforkBlock()', () => {
		const c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Istanbul });
		// eslint-disable-next-line deprecation/deprecation
		expect(c.isNextHardforkBlock(4460644)).toBe(true);
		// eslint-disable-next-line deprecation/deprecation
		expect(c.isNextHardforkBlock(5062605, 'berlin')).toBe(true);
		// eslint-disable-next-line deprecation/deprecation
		expect(c.isNextHardforkBlock(5062605, Hardfork.Berlin)).toBe(true);
		// eslint-disable-next-line deprecation/deprecation
		expect(c.isNextHardforkBlock(13773000, Hardfork.Byzantium)).toBe(false);
		// eslint-disable-next-line deprecation/deprecation
		expect(c.isNextHardforkBlock(13773001, Hardfork.London)).toBe(false);
	});

	it('hardforkIsActiveOnBlock() / activeOnBlock()', () => {
		let c = new Common({ chain: Chain.Goerli });
		expect(c.hardforkIsActiveOnBlock(Hardfork.Istanbul, 1561651)).toBe(true);

		expect(c.hardforkIsActiveOnBlock(Hardfork.London, 5062605)).toBe(true);

		expect(c.hardforkIsActiveOnBlock(Hardfork.Byzantium, 1699999)).toBe(false);

		c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.London });
		// eslint-disable-next-line no-null/no-null
		expect(c.hardforkIsActiveOnBlock(null, 5062605)).toBe(true);

		expect(c.activeOnBlock(5062605)).toBe(true);
		// eslint-disable-next-line no-null/no-null
		expect(c.hardforkIsActiveOnBlock(null, 5062605)).toBe(true);
		// eslint-disable-next-line no-null/no-null
		expect(c.hardforkIsActiveOnBlock(null, 1699999)).toBe(false);
	});

	it('hardforkGteHardfork()', () => {
		let c = new Common({ chain: Chain.Goerli });
		expect(c.hardforkGteHardfork(Hardfork.Constantinople, Hardfork.Byzantium)).toBe(true);

		expect(c.hardforkGteHardfork(Hardfork.Dao, Hardfork.Chainstart)).toBe(false);

		expect(c.hardforkGteHardfork(Hardfork.Byzantium, Hardfork.Byzantium)).toBe(true);

		expect(c.hardforkGteHardfork(Hardfork.SpuriousDragon, Hardfork.Byzantium)).toBe(false);

		c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Byzantium });
		// eslint-disable-next-line no-null/no-null
		expect(c.hardforkGteHardfork(null, Hardfork.SpuriousDragon)).toBe(true);

		expect(c.gteHardfork(Hardfork.SpuriousDragon)).toBe(true);
		// eslint-disable-next-line no-null/no-null
		expect(c.hardforkGteHardfork(null, Hardfork.Byzantium)).toBe(true);
		// eslint-disable-next-line no-null/no-null
		expect(c.hardforkGteHardfork(null, Hardfork.Constantinople)).toBe(false);
	});

	it('hardforkGteHardfork() ropsten', () => {
		const c = new Common({ chain: Chain.Goerli });
		expect(c.hardforkGteHardfork(Hardfork.SpuriousDragon, Hardfork.MuirGlacier)).toBe(false);
	});

	it('_calcForkHash()', () => {
		const chains: [Chain, Uint8Array][] = [
			[
				Chain.Mainnet,
				hexToBytes('d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'),
			],
			[
				Chain.Goerli,
				hexToBytes('bf7e331f7f7c1dd2e05159666b3bf8bc7a8a3a9eb1d518969eab529dd9b88c1a'),
			],
			[
				Chain.Sepolia,
				hexToBytes('25a5cc106eea7138acab33231d7160d69cb777ee0c2c553fcddf5138993e6dd9'),
			],
		];

		let c = new Common({ chain: Chain.Mainnet });
		const mainnetGenesisHash = chains[0][1];
		expect(c._calcForkHash(Hardfork.Chainstart, mainnetGenesisHash)).toBe('0xfc64ec04');

		expect(c._calcForkHash(Hardfork.Homestead, mainnetGenesisHash)).toBe('0x97c2c34c');

		expect(c._calcForkHash(Hardfork.Byzantium, mainnetGenesisHash)).toBe('0xa00bc324');

		for (const [chain, genesisHash] of chains) {
			c = new Common({ chain });
			for (const hf of c.hardforks()) {
				if (typeof hf.forkHash !== 'string') {
					continue;
				}
				expect(c._calcForkHash(hf.name, genesisHash)).toEqual(hf.forkHash);
			}
		}
	});

	it('forkHash()', () => {
		let c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium });
		expect(c.forkHash()).toBe('0xa00bc324');
		expect(c.forkHash(Hardfork.SpuriousDragon)).toBe('0x3edd5b10');
		const genesisHash = hexToBytes(
			'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
		);
		expect(c.forkHash(Hardfork.SpuriousDragon, genesisHash)).toBe('0x3edd5b10');

		c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai });
		// unschedule shanghai on it to test
		c.hardforks()
			.filter(hf => hf.name === Hardfork.Shanghai)
			// eslint-disable-next-line array-callback-return
			.map(hf => {
				// eslint-disable-next-line no-null/no-null, no-param-reassign
				hf.block = null;
				// eslint-disable-next-line no-param-reassign
				hf.timestamp = undefined;
			});
		expect(() => {
			c.forkHash(Hardfork.Shanghai);
		}).toThrow('No fork hash calculation possible');
		expect(() => {
			c.forkHash('thisHardforkDoesNotExist');
		}).toThrow('No fork hash calculation possible');
	});

	it('hardforkForForkHash()', () => {
		const c = new Common({ chain: Chain.Mainnet });

		const res = c.hardforkForForkHash('0x3edd5b10')!;
		expect(res.name).toEqual(Hardfork.SpuriousDragon);

		expect(c.hardforkForForkHash('0x12345')).toBeNull();
	});

	it('HF consensus updates', () => {
		let c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Byzantium });
		expect(c.consensusType()).toEqual(ConsensusType.ProofOfAuthority);
		expect(c.consensusAlgorithm()).toEqual(ConsensusAlgorithm.Clique);
		expect(c.consensusConfig()['period']).toBe(15);

		c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Merge });
		expect(c.consensusType()).toEqual(ConsensusType.ProofOfStake);
		expect(c.consensusAlgorithm()).toEqual(ConsensusAlgorithm.Casper);
		expect(c.consensusConfig()).toEqual({});
	});

	it('Should correctly apply hardfork changes', () => {
		// For sepolia MergeForkIdTransition happens AFTER merge
		let c = new Common({ chain: Chain.Sepolia, hardfork: Hardfork.London });
		expect(c['HARDFORK_CHANGES'][11][0]).toEqual(Hardfork.Merge);
		expect(c['HARDFORK_CHANGES'][12][0]).toEqual(Hardfork.MergeForkIdTransition);

		// Should give correct ConsensusType pre and post merge
		expect(c.consensusType()).toEqual(ConsensusType.ProofOfWork);
		c.setHardfork(Hardfork.Merge);
		expect(c.consensusType()).toEqual(ConsensusType.ProofOfStake);
		c.setHardfork(Hardfork.MergeForkIdTransition);
		expect(c.consensusType()).toEqual(ConsensusType.ProofOfStake);

		// For kiln MergeForkIdTransition happens BEFORE Merge

		c = Common.fromGethGenesis(gethGenesisKiln, {
			chain: 'kiln',
			mergeForkIdPostMerge: false,
		});

		// MergeForkIdTransition change should be before Merge
		expect(c['HARDFORK_CHANGES'][10][0]).toEqual(Hardfork.MergeForkIdTransition);
		expect(c['HARDFORK_CHANGES'][11][0]).toEqual(Hardfork.Merge);

		// Should give correct ConsensusType pre and post merge
		c.setHardfork(Hardfork.London);
		expect(c.consensusType()).toEqual(ConsensusType.ProofOfWork);
		c.setHardfork(Hardfork.Merge);
		expect(c.consensusType()).toEqual(ConsensusType.ProofOfStake);
		c.setHardfork(Hardfork.MergeForkIdTransition);
		expect(c.consensusType()).toEqual(ConsensusType.ProofOfWork);
	});
});
