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
import { transactionBuilder } from 'web3-eth';
import {Web3Context} from 'web3-core'; 
import { Web3 } from '../../src';

describe('web3config web3 tests', () => {
	// let providerOptions: ProviderOptions

	beforeEach(() => {
		// providerOptions = {
		//     providerUrl: 'http://127.0.0.1:8545'
		// }
	});
    describe('web3config contract', () => {

        it('create web3context with configs and should set it for web3', async () => {
            const context = new Web3Context("");
            context.setConfig({defaultTransactionType: "0x0"});
            const web3 = new Web3(context);
            expect(web3.getContextObject().config.defaultTransactionType).toBe("0x0");
            expect(web3.config.defaultTransactionType).toBe("0x0");
        });
    
        it.only('should be able to create web3 and setconfig ', async () => {
            const web3 = new Web3("");
            web3.setConfig({defaultTransactionType: "0x0"});
            expect(web3.config.defaultTransactionType).toBe("0x0");
            expect(web3.getContextObject().config.defaultTransactionType).toBe("0x0");
    
            expect(web3.eth.config.defaultTransactionType).toBe("0x0");
            expect(web3.eth.getContextObject().config.defaultTransactionType).toBe("0x0");
    
            web3.setConfig({contractDataInputFill:"both"});
            const contract = new web3.eth.Contract([]);
            expect(contract.config.contractDataInputFill).toBe("both")
            expect(contract.getContextObject().config.contractDataInputFill).toBe("both");
        });

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
    it('defaultChain', async () => {
        const web3 = new Web3('http://127.0.0.1:8545');
        // default
        expect(web3.defaultChain).toBe('mainnet');

        // after set
        web3.setConfig({
            defaultChain: 'ropsten',
        });
        expect(web3.defaultChain).toBe('ropsten');

        // set by create new instance
        // eth2 = new web3({
        //     provider: web3Eth.provider,
        //     config: {
        //         defaultChain: 'rinkeby',
        //     },
        // });
        // expect(eth2.defaultChain).toBe('rinkeby');
        const res = await transactionBuilder({
            transaction: {
                from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
                to: '0x3535353535353535353535353535353535353535',
                value: '0x174876e800',
                gas: '0x5208',
            },
            web3Context: web3.getContextObject() as Web3Context,
        });
        expect(res.chain).toBe('ropsten');
    });
	
});
