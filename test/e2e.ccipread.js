const utils = require('./helpers/test.utils');
const gatewayServer = require('./helpers/ccipReadServer').default;
const Web3 = utils.getWeb3();
var Token = require('./sources/Token');

const assert = require('assert');

describe.only('CCIP-Read [ @E2E ]', function () {
    const tokenName = 'Test';
    const tokenSymbol = 'TXT';
    const initialSupply = 0;

    this.timeout(50000);

    let web3;
    let account;
    let accounts;
    var instance;

    var tokenOptions = {
        data: Token.bytecode,
        gasPrice: 1000000000,// Default gasPrice set by Geth
        gas: 4000000
    };

    before(async function(){
        gatewayServer();

        web3 = new Web3('http://localhost:8545');
        accounts = await web3.eth.getAccounts();
        account = accounts[0];

        const TokenContract = new web3.eth.Contract(Token.abi, tokenOptions);
        instance = await TokenContract.deploy({
            data: Token.bytecode,
            arguments: [tokenName, tokenSymbol, initialSupply],
        }).send({from: accounts[0]});
    });

   it.only('should make a sucessful off-chain lookup', async () => {
       instance.ccipReadGatewayUrls = ['http://localhost:8080/{sender}/{data}.json'];
       const balance = await instance.methods
           .balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
           .call();
       console.log('balance: ', balance)
       assert(balance);
   });
});

