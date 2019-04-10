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
 * @file batch-request-test.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>, Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {AbstractConfluxWebModule} from 'conflux-web-core';
import {AbstractMethod} from 'conflux-web-core-method';
import {BatchRequest} from 'conflux-web-providers';
import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';

const batchRequest = new BatchRequest(
    new AbstractConfluxWebModule('http://localhost:7545')
);

// $ExpectType void
batchRequest.add(new AbstractMethod('eth_coinbase', 1, Utils, new formatters(), new AbstractConfluxWebModule('http://localhost:7545')));

// $ExpectType Promise<{ methods: AbstractMethod[]; response: any[]; } | Error[]>
batchRequest.execute();
