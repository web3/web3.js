const Web3 = require('..');
const { expect } = require('chai');
module.exports = function TestSuite(protocol, host, rpcPort) {
    const url = protocol + '://' + host + ':' + rpcPort;
    before(function(done){
        this.timeout(10000);
        setTimeout(done, 5000);
    });
    describe('Web3 integration tests for: ' + url, () => {
        let web3 = new Web3(url);
        it('should be able to make a web3 instance', () => {
            expect(web3.utils).to.exist;
        })
        it('should be able to get a list of accounts', async () => {
            const accounts = await web3.eth.getAccounts();
            expect(accounts.length).to.be.gt(0);
        });
    })
}
