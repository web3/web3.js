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
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import { BN, checkAddressChecksum } from 'web3-utils';

const bigNumber = new BN(3);

checkAddressChecksum('0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51'); // $ExpectType boolean

// $ExpectError
checkAddressChecksum([4]);
// $ExpectError
checkAddressChecksum([ 36 ]);
// $ExpectError
checkAddressChecksum(345);
// $ExpectError
checkAddressChecksum(bigNumber);
// $ExpectError
checkAddressChecksum({});
// $ExpectError
checkAddressChecksum(true);
// $ExpectError
checkAddressChecksum(null);
// $ExpectError
checkAddressChecksum(undefined);
