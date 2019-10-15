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
import {getSignatureParameters} from 'conflux-web-utils';

// $ExpectType { r: string; s: string; v: number; }
getSignatureParameters(
    '0x90dc0e49b5a80eef86fcedcb863dcc727aeae5c11187c001fd3d18780ead2cc7701ba1986099a49164702f3d8b2c8dbbd45a6d1beb37d212d21fb1be4bb762a400'
);
// $ExpectError
getSignatureParameters(345);
// $ExpectError
getSignatureParameters(new BN(3));
// $ExpectError
getSignatureParameters({});
// $ExpectError
getSignatureParameters(true);
// $ExpectError
getSignatureParameters(['string']);
// $ExpectError
getSignatureParameters([4]);
// $ExpectError
getSignatureParameters(null);
// $ExpectError
getSignatureParameters(undefined);
