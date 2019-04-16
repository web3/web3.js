import Web3 from 'web3';

describe('Integration test for sending ether', () => {
    it('Should successfully resolve on sending ether', async () => {
        const web3 = new Web3('http://ganache:8545', undefined, {transactionConfirmationBlocks: 1});
        const [sender, recipient] = await web3.eth.getAccounts();
        await expect(
            web3.eth.sendTransaction({
                value: '1',
                from: sender,
                to: recipient
            })
        ).resolves.toHaveProperty('status', true);;
    });
});
