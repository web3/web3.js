import Web3ProviderWS from '../../src/index';

describe('Web3ProviderWS Tests', () => {
    let provider: Web3ProviderWS;
    it('should throw error for invalid WS address', () => {
        expect(() => {
            new Web3ProviderWS('http://127.0.0.1:8545');
        }).toThrowError('Invalid WebSocket URL provided');
    });

    test('should instantiate with valid client URL', async (done) => {
        let client = 'ws://127.0.0.1:8545';
        provider = new Web3ProviderWS(client);
        expect(provider.web3Client).toBe(client);
        done();
    });

    test('should create instance of Web3ProviderWS and call connect', async (done) => {
        const connectFunc = jest.spyOn(Web3ProviderWS.prototype, 'connect');
        connectFunc.mockImplementation(() => {
            done();
        });

        provider = new Web3ProviderWS('ws://127.0.0.1:8545');
        expect(connectFunc).toHaveBeenCalled();
    });
});
