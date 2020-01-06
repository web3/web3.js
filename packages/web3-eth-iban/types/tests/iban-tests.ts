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
 * @file iban-tests.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import { Iban, IndirectOptions } from 'web3-eth-iban';

const iban = 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS';
const address = '0x45cd08334aeedd8a06265b2ae302e3597d8faa28';

// $ExpectType Iban
const ibanClass = new Iban(iban);

// $ExpectType boolean
ibanClass.isDirect();
// $ExpectType boolean
ibanClass.isIndirect();
// $ExpectType string
ibanClass.checksum();
// $ExpectType string
ibanClass.institution();
// $ExpectType string
ibanClass.client();
// $ExpectType string
ibanClass.toAddress();
// $ExpectType string
Iban.toAddress(iban);

// $ExpectError
Iban.toAddress(345);
// $ExpectError
Iban.toAddress({});
// $ExpectError
Iban.toAddress(true);
// $ExpectError
Iban.toAddress(['string']);
// $ExpectError
Iban.toAddress([4]);
// $ExpectError
Iban.toAddress(null);
// $ExpectError
Iban.toAddress(undefined);

// $ExpectType string
Iban.toIban(address);

// $ExpectError
Iban.toIban(345);
// $ExpectError
Iban.toIban({});
// $ExpectError
Iban.toIban(true);
// $ExpectError
Iban.toIban(['string']);
// $ExpectError
Iban.toIban([4]);
// $ExpectError
Iban.toIban(null);
// $ExpectError
Iban.toIban(undefined);

// $ExpectType Iban
Iban.fromAddress(address);

// $ExpectError
Iban.fromAddress(345);
// $ExpectError
Iban.fromAddress({});
// $ExpectError
Iban.fromAddress(true);
// $ExpectError
Iban.fromAddress(['string']);
// $ExpectError
Iban.fromAddress([4]);
// $ExpectError
Iban.fromAddress(null);
// $ExpectError
Iban.fromAddress(undefined);

// $ExpectType Iban
Iban.fromBban('ETHXREGGAVOFYORK');

// $ExpectError
Iban.fromBban(345);
// $ExpectError
Iban.fromBban({});
// $ExpectError
Iban.fromBban(true);
// $ExpectError
Iban.fromBban(['string']);
// $ExpectError
Iban.fromBban([4]);
// $ExpectError
Iban.fromBban(null);
// $ExpectError
Iban.fromBban(undefined);

const indirectOptions: IndirectOptions = {
    institution: 'XREG',
    identifier: 'GAVOFYORK'
};

// $ExpectType Iban
Iban.createIndirect(indirectOptions);

// $ExpectError
Iban.createIndirect(345);
// $ExpectError
Iban.createIndirect('string');
// $ExpectError
Iban.createIndirect(true);
// $ExpectError
Iban.createIndirect(['string']);
// $ExpectError
Iban.createIndirect([4]);
// $ExpectError
Iban.createIndirect(null);
// $ExpectError
Iban.createIndirect(undefined);

// $ExpectType boolean
Iban.isValid(iban);

// $ExpectError
Iban.isValid(345);
// $ExpectError
Iban.isValid({});
// $ExpectError
Iban.isValid(true);
// $ExpectError
Iban.isValid(['string']);
// $ExpectError
Iban.isValid([4]);
// $ExpectError
Iban.isValid(null);
// $ExpectError
Iban.isValid(undefined);
