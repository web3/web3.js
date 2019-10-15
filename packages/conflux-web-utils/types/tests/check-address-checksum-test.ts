/*
    This file is part of confluxWeb.

    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import BN = require('bn.js');
import {checkAddressChecksum} from 'conflux-web-utils';

// $ExpectType boolean
checkAddressChecksum('0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');

// $ExpectError
checkAddressChecksum([4]);
// $ExpectError
checkAddressChecksum(['string']);
// $ExpectError
checkAddressChecksum(345);
// $ExpectError
checkAddressChecksum(new BN(3));
// $ExpectError
checkAddressChecksum({});
// $ExpectError
checkAddressChecksum(true);
// $ExpectError
checkAddressChecksum(null);
// $ExpectError
checkAddressChecksum(undefined);
