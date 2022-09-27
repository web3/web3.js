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

import {
    Web3DeferredPromise
} from '../../src/web3_deferred_promise';
import {
} from '../fixtures/json_rpc';

describe('Web3DeferredPromise', () => {
	describe('create Web3DeferredPromise', () => {
        it('%s', () => {

				new Web3DeferredPromise();
        });
	});
    describe('getState Web3DeferredPromise', () => {
        it('%s', () => {

        const promise = new Web3DeferredPromise();
        expect(promise.state).toBe('pending');
        })
    });
    describe('Web3DeferredPromise fulfill promise', () => {
        it('%s', () => {
        const promise = new Web3DeferredPromise();
        jest.spyOn(promise, 'then').mockResolvedValue('mockValue');
        promise.resolve('mockValue');
        expect(promise.then).toHaveBeenCalledTimes(1);
        })
    });
});
