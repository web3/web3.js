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

import {AbstractConfluxWebModule} from 'conflux-web-core';
import {formatters} from 'conflux-web-core-helpers';

// $ExpectType number
formatters.outputBigNumberFormatter(100);

// $ExpectType string
formatters.inputSignFormatter('0x0');

// $ExpectType string
formatters.inputAddressFormatter('0x0');

// $ExpectType boolean
formatters.isPredefinedEpochNumber('latest_state');

// $ExpectType string
formatters.inputDefaultEpochNumberFormatter('0x0', new AbstractConfluxWebModule('http://localhost:8545'));

// $ExpectType string | number
formatters.inputBlockAddressFormatter('0x0');

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
