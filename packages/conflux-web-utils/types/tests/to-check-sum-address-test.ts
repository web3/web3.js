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

import BN = require('bn.js');
import {toChecksumAddress} from 'conflux-web-utils';

// $ExpectType string
toChecksumAddress('0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');

// $ExpectError
toChecksumAddress([4]);
// $ExpectError
toChecksumAddress(['string']);
// $ExpectError
toChecksumAddress(345);
// $ExpectError
toChecksumAddress(new BN(3));
// $ExpectError
toChecksumAddress({});
// $ExpectError
toChecksumAddress(true);
// $ExpectError
toChecksumAddress(null);
// $ExpectError
toChecksumAddress(undefined);
