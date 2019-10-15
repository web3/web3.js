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
 * @file formatters-test.ts
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import { formatters } from 'web3-core-helpers';

// $ExpectType number
formatters.outputBigNumberFormatter(100);

// $ExpectType string
formatters.inputSignFormatter('0x0');

// $ExpectType string
formatters.inputAddressFormatter('0x0');

// $ExpectType boolean
formatters.isPredefinedBlockNumber('latest');

// $ExpectType string | number
formatters.inputBlockNumberFormatter('0x0');

// $ExpectType object
formatters.outputBlockFormatter({});

// $ExpectType object
formatters.txInputFormatter({});

// $ExpectType object
formatters.inputCallFormatter({});

// $ExpectType object
formatters.inputTransactionFormatter({});

// $ExpectType object
formatters.outputTransactionFormatter({});

// $ExpectType object
formatters.outputTransactionReceiptFormatter({});

// $ExpectType object
formatters.inputLogFormatter({});

// $ExpectType object
formatters.outputLogFormatter({});

// $ExpectType object
formatters.inputPostFormatter({});

// $ExpectType object
formatters.outputPostFormatter({});

// $ExpectType object
formatters.outputSyncingFormatter({});
