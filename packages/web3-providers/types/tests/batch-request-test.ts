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

import {AbstractWeb3Module} from 'web3-core';
import {AbstractMethod} from 'web3-core-method';
import {BatchRequest} from 'web3-providers';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';

const batchRequest = new BatchRequest(
    new AbstractWeb3Module('http://localhost:7545')
);

// $ExpectType void
batchRequest.add(
    new AbstractMethod(
        'rpc_method',
        1,
        Utils,
        formatters,
        new AbstractWeb3Module('http://localhost:7545')
    )
);

// $ExpectType Promise<{ methods: AbstractMethod[]; response: object[]; } | Error[]>
batchRequest.execute();
