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
 * @file index.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import SubscriptionsModuleFactory from './factories/SubscriptionsModuleFactory';

/**
 * Returns an object of type SubscriptionsFactory
 *
 * @method SubscriptionsFactory
 *
 * @returns {SubscriptionsFactory}
 */
export const SubscriptionsFactory = () => {
    return new SubscriptionsModuleFactory().createSubscriptionsFactory(Utils, formatters);
};

export AbstractSubscription from '../lib/subscriptions/AbstractSubscription';

// Eth
export LogSubscription from './subscriptions/eth/LogSubscription';
export NewHeadsSubscription from './subscriptions/eth/NewHeadsSubscription';
export NewPendingTransactionsSubscription from './subscriptions/eth/NewPendingTransactionsSubscription';
export SyncingSubscription from './subscriptions/eth/SyncingSubscription';

// Shh
export MessagesSubscription from './subscriptions/shh/MessagesSubscription';

