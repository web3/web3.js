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
 * @file provider-detector-test.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import {ProviderDetector, HttpProvider} from 'web3-providers';

const options = {
    timeout: 20000,
    headers: [
        {
            name: 'Access-Control-Allow-Origin', value: '*'
        }
    ]
};
const httpProvider = new HttpProvider('http://localhost:8545', options);

const providerDetector = new ProviderDetector();

// $ExpectType HttpProvider | IpcProvider | WebsocketProvider | undefined
providerDetector.detect();

// $ExpectType boolean
providerDetector.isIpcProviderWrapper(httpProvider);

// $ExpectType provider
providerDetector.addSubscriptionsToIpcProviderWrapper(httpProvider);
