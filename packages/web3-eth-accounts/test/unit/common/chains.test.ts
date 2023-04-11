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
import { Chain, Common, ConsensusAlgorithm, ConsensusType, Hardfork } from '../../../src/common';

describe('[Common/Chains]: Initialization / Chain params', () => {
	it('Should initialize with chain provided', () => {
		let c = new Common({ chain: 'mainnet' });
		expect(c.chainName()).toBe('mainnet');
		expect(c.chainId()).toEqual(BigInt(1));
		expect(c.networkId()).toEqual(BigInt(1));
		expect(c.hardfork()).toEqual(Hardfork.Merge);
		expect(c.hardfork()).toEqual(c.DEFAULT_HARDFORK);

		c = new Common({ chain: 1 });
		expect(c.chainName()).toBe('mainnet');
	});

	it('Should initialize with chain provided by Chain enum', () => {
		const c = new Common({ chain: Chain.Mainnet });
		expect(c.chainName()).toBe('mainnet');
		expect(c.chainId()).toEqual(BigInt(1));
		expect(c.networkId()).toEqual(BigInt(1));
		expect(c.hardfork()).toEqual(Hardfork.Merge);
		expect(c.hardfork()).toEqual(c.DEFAULT_HARDFORK);
	});

	it('Should initialize with chain and hardfork provided', () => {
		const c = new Common({ chain: 'mainnet', hardfork: 'byzantium' });
		expect(c.hardfork()).toBe('byzantium');
	});

	it('Should initialize with chain and hardfork provided by Chain and Hardfork enums', () => {
		const c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium });
		expect(c.hardfork()).toBe('byzantium');
	});

	it('Should handle initialization errors', () => {
		let f = function () {
			// eslint-disable-next-line no-new
			new Common({ chain: 'chainnotexisting' });
		};
		expect(f).toThrow('not supported'); // eslint-disable-line no-new

		f = function () {
			// eslint-disable-next-line no-new
			new Common({ chain: 'mainnet', hardfork: 'hardforknotexisting' });
		};
		expect(f).toThrow('not supported'); // eslint-disable-line no-new
	});

	it('Should provide correct access to chain parameters', () => {
		let c = new Common({ chain: 'mainnet', hardfork: 'chainstart' });
		expect(c.hardforks()[3]['block']).toBe(2463000);
		expect(c.consensusType()).toEqual(ConsensusType.ProofOfWork);
		expect(c.consensusAlgorithm()).toEqual(ConsensusAlgorithm.Ethash);
		expect(c.consensusConfig()).toEqual({});

		c = new Common({ chain: 'goerli', hardfork: 'chainstart' });
		expect(c.hardforks()[3]['block']).toBe(0);
		expect(c.consensusType()).toEqual(ConsensusType.ProofOfAuthority);
		expect(c.consensusAlgorithm()).toEqual(ConsensusAlgorithm.Clique);
		expect(c.consensusConfig().epoch).toBe(30000);
	});

	it('Should provide DNS network information in a uniform way', () => {
		const configs = ['mainnet', 'goerli'];
		for (const network of configs) {
			const c = new Common({ chain: network });
			const dnsNetworks = c.dnsNetworks();
			expect(Array.isArray(dnsNetworks)).toBe(true);
			expect(typeof dnsNetworks[0]).toBe('string');
		}
	});
});

describe('[Common]: isSupportedChainId static method', () => {
	it('Should return true for supported chainId', () => {
		expect(Common.isSupportedChainId(BigInt(1))).toBe(true);
	});

	it('Should return false for unsupported chainId', () => {
		expect(Common.isSupportedChainId(BigInt(0))).toBe(false);
	});
});

describe('[Common]: copy()', () => {
	it('listener tests', () => {
		const common = new Common({ chain: 'mainnet' });
		// Add two listeners
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		common.on('hardforkChanged', () => {});
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		common.on('hardforkChanged', () => {});
		const commonCopy = common.copy();
		expect(common.listenerCount('hardforkChanged')).toBe(2);
		expect(commonCopy.listenerCount('hardforkChanged')).toBe(0);
	});
});
