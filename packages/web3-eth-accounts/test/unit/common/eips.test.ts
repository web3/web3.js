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
import { toBigInt } from 'web3-utils';
import { Chain, Common, Hardfork } from '../../../src/common';

describe('[Common/EIPs]: Initialization / Chain params', () => {
	it('Correct initialization', () => {
		let eips = [2537, 2929];
		const c = new Common({ chain: Chain.Mainnet, eips });
		expect(c.eips()).toEqual(eips);

		eips = [2718, 2929, 2930];
		expect(() => {
			// eslint-disable-next-line no-new
			new Common({ chain: Chain.Mainnet, eips, hardfork: Hardfork.Istanbul });
		}).not.toThrow();

		eips = [2930];
		expect(() => {
			// eslint-disable-next-line no-new
			new Common({ chain: Chain.Mainnet, eips, hardfork: Hardfork.Istanbul });
		}).toThrow();
	});

	it('Initialization errors', () => {
		const UNSUPPORTED_EIP = 1000000;
		const eips = [UNSUPPORTED_EIP];
		expect(() => {
			// eslint-disable-next-line no-new
			new Common({ chain: Chain.Mainnet, eips });
		}).toThrow('not supported');

		/*
    // Manual test since no test triggering EIP config available
    // TODO: recheck on addition of new EIP configs
    // To run manually change minimumHardfork in EIP2537 config to petersburg
    eips = [ 2537, ]
    msg = 'should throw on not meeting minimum hardfork requirements'
    f = () => {
      new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium, eips })
    }
    st.throws(f, /minimumHardfork/, msg)
    */
	});

	it('isActivatedEIP()', () => {
		let c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Istanbul });
		expect(c.isActivatedEIP(2315)).toBe(false);
		c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Istanbul, eips: [2315] });
		expect(c.isActivatedEIP(2315)).toBe(true);
		c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Berlin });
		expect(c.isActivatedEIP(2929)).toBe(true);
		expect(c.isActivatedEIP(2315)).toBe(false);
		expect(c.isActivatedEIP(2537)).toBe(false);
	});

	it('eipBlock', () => {
		const c = new Common({ chain: Chain.Mainnet });

		expect(c.eipBlock(1559)! === toBigInt(12965000)).toBe(true);

		expect(c.eipBlock(0)).toBeNull();
	});
});
