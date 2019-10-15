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
import {padRight} from 'conflux-web-utils';

const bigNumber = new BN(3);

// $ExpectType string
padRight('0x3456ff', 20);
// $ExpectType string
padRight(0x3456ff, 20);
// $ExpectType string
padRight('Hello', 20, 'x');

// $ExpectError
padRight(bigNumber, 20);
// $ExpectError
padRight(['string'], 20);
// $ExpectError
padRight([4], 20);
// $ExpectError
padRight({}, 20);
// $ExpectError
padRight(true, 20);
// $ExpectError
padRight(null, 20);
// $ExpectError
padRight(undefined, 20);
// $ExpectError
padRight('0x3456ff', bigNumber);
// $ExpectError
padRight('0x3456ff', ['string']);
// $ExpectError
padRight('0x3456ff', [4]);
// $ExpectError
padRight('0x3456ff', {});
// $ExpectError
padRight('0x3456ff', true);
// $ExpectError
padRight('0x3456ff', null);
// $ExpectError
padRight('0x3456ff', undefined);
// $ExpectError
padRight('Hello', 20, bigNumber);
// $ExpectError
padRight('Hello', 20, ['string']);
// $ExpectError
padRight('Hello', 20, [4]);
// $ExpectError
padRight('Hello', 20, {});
// $ExpectError
padRight('Hello', 20, true);
// $ExpectError
padRight('Hello', 20, null);
