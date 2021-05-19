import Web3Eth from '../../src/index';
import { Web3EthOptions } from '../../types';

describe('constructs a Web3Eth instance with expected properties', () => {
    let web3EthOptions: Web3EthOptions;

    beforeEach(() => {
        web3EthOptions = {
            providerUrl: 'http://127.0.0.1:8545',
        };
    });

    it('should construct with expected providerUrl', () => {
        const web3Eth = new Web3Eth(web3EthOptions);
        expect(web3Eth.packageName).toBe('eth');
    });

    it('should construct with expected packageName', () => {
        web3EthOptions.packageName = 'foobar';
        const web3Eth = new Web3Eth(web3EthOptions);
        expect(web3Eth.packageName).toBe('foobar');
    });
});
