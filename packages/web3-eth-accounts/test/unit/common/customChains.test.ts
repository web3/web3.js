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
import { Chain, Common, ConsensusType, CustomChain, Hardfork } from '../../../src/common';

import * as testnet from '../../fixtures/common/testnet.json';
import * as testnet2 from '../../fixtures/common/testnet2.json';
import * as testnet3 from '../../fixtures/common/testnet3.json';

describe('[Common]: Custom chains', () => {
	it('chain -> object: should provide correct access to private network chain parameters', () => {
		const c = new Common({ chain: testnet, hardfork: Hardfork.Byzantium });
		expect(c.chainName()).toBe('testnet');
		expect(c.chainId()).toEqual(BigInt(12345));
		expect(c.networkId()).toEqual(BigInt(12345));
		expect(c.hardforks()[3]['block']).toBe(3);
		expect(c.bootstrapNodes()![1].ip).toBe('10.0.0.2');
	});

	it('chain -> object: should handle custom chain parameters with missing field', () => {
		const chainParams = { ...testnet };
		delete (chainParams as any)['hardforks'];
		expect(() => {
			// eslint-disable-next-line no-new
			new Common({ chain: chainParams });
		}).toThrow('Missing required'); // eslint-disable-line no-new
	});

	it('custom() -> base functionality', () => {
		const mainnetCommon = new Common({ chain: Chain.Mainnet });

		const customChainParams = { name: 'custom', chainId: 123, networkId: 678 };
		const customChainCommon = Common.custom(customChainParams, {
			hardfork: Hardfork.Byzantium,
		});

		// From custom chain params
		expect(customChainCommon.chainName()).toEqual(customChainParams.name);
		expect(customChainCommon.chainId()).toEqual(BigInt(customChainParams.chainId));
		expect(customChainCommon.networkId()).toEqual(BigInt(customChainParams.networkId));

		// Fallback params from mainnet
		expect(customChainCommon.genesis()).toEqual(mainnetCommon.genesis());
		expect(customChainCommon.bootstrapNodes()).toEqual(mainnetCommon.bootstrapNodes());
		expect(customChainCommon.hardforks()).toEqual(mainnetCommon.hardforks());

		// Set only to this Common
		expect(customChainCommon.hardfork()).toBe('byzantium');
	});

	it('custom() -> behavior', () => {
		let common = Common.custom({ chainId: 123 });
		expect(common.networkId()).toEqual(BigInt(1));
		expect(common.chainName()).toBe('custom-chain');

		common = Common.custom(CustomChain.PolygonMumbai);
		expect(common.networkId()).toEqual(BigInt(80001));
		for (const customChain of Object.values(CustomChain)) {
			common = Common.custom(customChain);
			expect(common.chainName()).toEqual(customChain);
		}

		common = Common.custom(CustomChain.PolygonMumbai);
		expect(common.hardfork()).toEqual(common.DEFAULT_HARDFORK);

		common = Common.custom(CustomChain.OptimisticEthereum, { hardfork: Hardfork.Byzantium });
		expect(common.hardfork()).toEqual(Hardfork.Byzantium);

		expect(() => {
			// @ts-expect-error TypeScript complains, nevertheless do the test for JS behavior
			Common.custom('this-chain-is-not-supported');
		}).toThrow('not supported');
	});

	it('customChains parameter: initialization exception', () => {
		expect(() => {
			// eslint-disable-next-line no-new
			new Common({ chain: testnet, customChains: [testnet] });
		}).toThrow(
			'Chain must be a string, number, or bigint when initialized with customChains passed in',
		);
	});

	it('customChains parameter: initialization', () => {
		let c = new Common({
			chain: Chain.Mainnet,
			hardfork: Hardfork.Byzantium,
			customChains: [testnet],
		});
		expect(c.chainName()).toBe('mainnet');
		expect(c.hardforkBlock()!).toEqual(BigInt(4370000));

		c.setChain('testnet');
		expect(c.chainName()).toBe('testnet');
		expect(c.hardforkBlock()!).toEqual(BigInt(4));

		c = new Common({
			chain: 'testnet',
			hardfork: Hardfork.Byzantium,
			customChains: [testnet],
		});
		expect(c.chainName()).toBe('testnet');
		expect(c.hardforkBlock()!).toEqual(BigInt(4));

		const customChains = [testnet, testnet2, testnet3];
		c = new Common({
			chain: 'testnet2',
			hardfork: Hardfork.Istanbul,
			customChains,
		});
		expect(c.chainName()).toBe('testnet2');
		expect(c.hardforkBlock()!).toEqual(BigInt(10));

		c.setChain('testnet');
		expect(c.chainName()).toBe('testnet');
		expect(c.consensusType()).toEqual(ConsensusType.ProofOfWork);
	});
});

describe('custom chain setup with hardforks', () => {
	const undefinedHardforks = [
		{
			name: 'chainstart',
			block: 0,
		},
		{ name: 'homestead' },
		// eslint-disable-next-line no-null/no-null
		{ name: 'byzantium', block: null },
		{ name: 'tangerineWhistle', block: 10 },
	];
	it('with undefined/null block numbers', () => {
		expect(
			// @ts-expect-error -- Disabling type check to verify that error is thrown
			() => Common.custom({ hardforks: undefinedHardforks }),
		).toThrow();

		const nullHardforks = [
			{
				name: 'chainstart',
				block: 0,
			},
			// eslint-disable-next-line no-null/no-null
			{ name: 'homestead', block: null },
			{ name: 'tangerineWhistle', block: 10 },
		];

		const common = Common.custom({ hardforks: nullHardforks });
		common.setHardforkByBlockNumber(10);
		expect('tangerineWhistle').toEqual(common.hardfork());
		common.setHardforkByBlockNumber(3);
		expect('chainstart').toEqual(common.hardfork());
	});
});
