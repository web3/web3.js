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
 * @file subscriptions-tests.ts
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import {Subscriptions, Subscription} from 'web3-core-subscriptions';

const subscriptions = new Subscriptions({
    name: '',
    type: '',
    subscriptions:
        {
            test: {
                subscriptionName: '',
                inputFormatter: [() => {}],
                outputFormatter: () => {},
                params: 0,
                subscriptionHandler: () => {}
            }
        }
});

// $ExpectType string
subscriptions.name;

// $ExpectType string
subscriptions.type;

// $ExpectType SubscriptionsModel
subscriptions.subscriptions;

// $ExpectType void
subscriptions.setRequestManager({});

// $ExpectType void
subscriptions.attachToObject({});

// $ExpectType () => any
subscriptions.buildCall();

const subscription = new Subscription({subscription: '', type: '', requestManager: null});

// $ExpectType string
subscription.id;

// $ExpectType () => void
subscription.callback;

// $ExpectType any
subscription.arguments;

// $ExpectType SubscriptionOptions
subscription.options;

// $ExpectType Subscription<unknown>
subscription.subscribe(() => {});

// $ExpectType Promise<boolean | undefined>
subscription.unsubscribe(() => {});

// $ExpectType Subscription<unknown>
subscription.on('data', () => {});

// $ExpectType Subscription<unknown>
subscription.on('changed', () => {});

// $ExpectType Subscription<unknown>
subscription.on('error', () => {});

// $ExpectType Subscription<unknown>
subscription.on('connected', () => {});
