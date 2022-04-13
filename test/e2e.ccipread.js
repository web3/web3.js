const utils = require('./helpers/test.utils');
const gatewayServer = require('./helpers/ccipReadServer').default;
const Web3 = utils.getWeb3();
var Token = require('./sources/Token');

const assert = require('assert');

describe('CCIP-Read [ @E2E ]', function () {
    const mockCCIPReadGatewayResult = '0x00000000000000000000000000000000000000000000003635c9adc5dea00000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000413a1dfb9df8c494060150692f3a0defb98676e4cfcd9c76e0ee810fd3225f58ad34b3ebcdf5f778b715b8f0045579fed56a216a46635e4d77e233814171d871101b00000000000000000000000000000000000000000000000000000000000000'

    const tokenName = 'Test';
    const tokenSymbol = 'TXT';
    const initialSupply = 0;

    this.timeout(50000);

    let web3;
    let account;
    let accounts;

    var tokenOptions = {
        data: Token.bytecode,
        gasPrice: 1000000000,// Default gasPrice set by Geth
        gas: 4000000
    };

    before(async function () {
        gatewayServer();
    });

    it('should make a sucessful off-chain lookup', async () => {
        web3 = new Web3('http://localhost:8545');
        accounts = await web3.eth.getAccounts();
        account = accounts[0];

        const TokenContract = new web3.eth.Contract(Token.abi, tokenOptions);
        const instance = await TokenContract.deploy({
            data: Token.bytecode,
            arguments: [tokenName, tokenSymbol, initialSupply],
        }).send({from: accounts[0]});

        instance.ccipReadGatewayUrls = ['http://localhost:8080/{sender}/{data}.json'];
        const balance = await instance.methods
            .balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
            .call();
        assert(balance);
    });

    it('should allow options to be set at the web3 level', async () => {
        let TokenContract;
        let instance;

        web3 = new Web3('http://localhost:8545');
        accounts = await web3.eth.getAccounts();
        account = accounts[0];

        let hasGatewayBeenCalled = false;

        web3.eth.ccipReadGatewayUrls = ['http://localhost:8080/{sender}/{data}.json'];
        web3.eth.ccipReadGatewayCallback = () => {
            hasGatewayBeenCalled = true;
            return mockCCIPReadGatewayResult;
        };

        TokenContract = new web3.eth.Contract(Token.abi, tokenOptions);
        instance = await TokenContract.deploy({
            data: Token.bytecode,
            arguments: [tokenName, tokenSymbol, initialSupply],
        }).send({from: accounts[0]});

        const balance = await instance.methods
            .balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
            .call();
        assert(balance);
        assert(hasGatewayBeenCalled);

        web3.eth.ccipReadGatewayCallback = undefined;
        web3.eth.ccipReadGatewayAllowList = ['foo.com'];
        TokenContract = new web3.eth.Contract(Token.abi, tokenOptions);
        instance = await TokenContract.deploy({
            data: Token.bytecode,
            arguments: [tokenName, tokenSymbol, initialSupply],
        }).send({from: accounts[0]});

        try {
            await instance.methods
                .balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                .call();
        } catch (e) {
            assert(e.message.includes('All gateways failed'));
        }

        web3.eth.ccipReadGatewayAllowList = [];
        web3.eth.ccipReadMaxRedirectCount = 0;
        TokenContract = new web3.eth.Contract(Token.abi, tokenOptions);
        instance = await TokenContract.deploy({
            data: Token.bytecode,
            arguments: [tokenName, tokenSymbol, initialSupply],
        }).send({from: accounts[0]});
        try {
            await instance.methods
                .balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                .call();
        } catch (e) {
            assert(e.message.includes('Too many'));
        }
    });

    it('should allow options to be set at the Contract level', async () => {
        let TokenContract;
        let instance;

        web3 = new Web3('http://localhost:8545');
        accounts = await web3.eth.getAccounts();
        account = accounts[0];

        let hasGatewayBeenCalled = false;

        web3.eth.Contract.ccipReadGatewayUrls = ['http://localhost:8080/{sender}/{data}.json'];
        web3.eth.Contract.ccipReadGatewayCallback = () => {
            hasGatewayBeenCalled = true;
            return mockCCIPReadGatewayResult;
        };

        TokenContract = new web3.eth.Contract(Token.abi, tokenOptions);
        instance = await TokenContract.deploy({
            data: Token.bytecode,
            arguments: [tokenName, tokenSymbol, initialSupply],
        }).send({from: accounts[0]});

        const balance = await instance.methods
            .balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
            .call();
        assert(balance);
        assert(hasGatewayBeenCalled);

        web3.eth.Contract.ccipReadGatewayCallback = undefined;
        web3.eth.Contract.ccipReadGatewayAllowList = ['foo.com'];
        TokenContract = new web3.eth.Contract(Token.abi, tokenOptions);
        instance = await TokenContract.deploy({
            data: Token.bytecode,
            arguments: [tokenName, tokenSymbol, initialSupply],
        }).send({from: accounts[0]});

        try {
            await instance.methods
                .balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                .call();
        } catch (e) {
            assert(e.message.includes('All gateways failed'));
        }

        web3.eth.Contract.ccipReadGatewayAllowList = [];
        web3.eth.Contract.ccipReadMaxRedirectCount = 0;
        TokenContract = new web3.eth.Contract(Token.abi, tokenOptions);
        instance = await TokenContract.deploy({
            data: Token.bytecode,
            arguments: [tokenName, tokenSymbol, initialSupply],
        }).send({from: accounts[0]});
        try {
            await instance.methods
                .balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                .call();
        } catch (e) {
            assert(e.message.includes('Too many'));
        }
    });

    it('should allow options to be set at the Contract instance level', async () => {
        let TokenContract;
        let instance;

        web3 = new Web3('http://localhost:8545');
        accounts = await web3.eth.getAccounts();
        account = accounts[0];

        let hasGatewayBeenCalled = false;

        TokenContract = new web3.eth.Contract(Token.abi, tokenOptions);
        instance = await TokenContract.deploy({
            data: Token.bytecode,
            arguments: [tokenName, tokenSymbol, initialSupply],
        }).send({from: accounts[0]});
        instance.ccipReadGatewayUrls = ['http://localhost:8080/{sender}/{data}.json'];
        instance.ccipReadGatewayCallback = () => {
            hasGatewayBeenCalled = true;
            return mockCCIPReadGatewayResult;
        };

        const balance = await instance.methods
            .balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
            .call();
        assert(balance);
        assert(hasGatewayBeenCalled);

        instance.ccipReadGatewayCallback = undefined;
        instance.ccipReadGatewayAllowList = ['foo.com'];

        try {
            await instance.methods
                .balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                .call();
        } catch (e) {
            assert(e.message.includes('All gateways failed'));
        }

        instance.ccipReadGatewayAllowList = [];
        instance.ccipReadMaxRedirectCount = 0;

        try {
            await instance.methods
                .balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
                .call();
        } catch (e) {
            assert(e.message.includes('Too many'));
        }
    });
});

