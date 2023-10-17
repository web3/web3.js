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

// import Web3ProviderBase from '../../src/index'
// import {ProviderOptions} from '../../types'
import { Web3 } from '../../src';

describe('web3config web3 tests', () => {
	// let providerOptions: ProviderOptions

	beforeEach(() => {
		// providerOptions = {
		//     providerUrl: 'http://127.0.0.1:8545'
		// }
	});
    describe('web3config contract', () => {
        it('default', () => {
            const web3 = new Web3('http://127.0.0.1:8545');
            // web3.setConfig({ contractDataInputFill: "data" });
    
            const c1 = new web3.eth.Contract([], '')
            // console.log(c1.config.contractDataInputFill) // input
            expect(c1.config.contractDataInputFill).toEqual("input")
            // const web3ProviderBase = new Web3ProviderBase(providerOptions)
            // expect(web3ProviderBase).toMatchObject({
            //     _providerUrl: providerOptions.providerUrl
            // })
            expect(true).toBeTruthy();
        });

        it('contractDataInputFill', () => {
            console.log("creating web3")
            const web3 = new Web3('http://127.0.0.1:8545');
            console.log("set config")
            web3.setConfig({ contractDataInputFill: "data" });
            console.log("set")
            const c1 = new web3.eth.Contract([], '')
            // console.log(c1.config.contractDataInputFill) // input
            expect(c1.config.contractDataInputFill).toEqual("data")
            // const web3ProviderBase = new Web3ProviderBase(providerOptions)
            // expect(web3ProviderBase).toMatchObject({
            //     _providerUrl: providerOptions.providerUrl
            // })
            expect(true).toBeTruthy();
        });

        it('defaulttransactiontype', () => {
            const web3 = new Web3('http://127.0.0.1:8545');
            
            const c1 = new web3.eth.Contract([], '')
            // console.log(c1.config.contractDataInputFill) // input
            expect(c1.config.contractDataInputFill).toEqual("data")
            // const web3ProviderBase = new Web3ProviderBase(providerOptions)
            // expect(web3ProviderBase).toMatchObject({
            //     _providerUrl: providerOptions.providerUrl
            // })
            expect(true).toBeTruthy();
        });
    })
	
});
