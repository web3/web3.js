const chai = require('chai');
const assert = chai.assert;

/**
 * Checks if a method does exists on a object by the given method name.
 *
 * @method methodExists
 *
 * @param {Object} object
 * @param {String} method
 *
 * @returns {void}
 */
const methodExists = function(object, method) {
    it('should have method ' + method + ' implemented', function() {
        //web3.setProvider(null);
        assert.equal('function', typeof object[method], 'method ' + method + ' is not implemented');
    });
};

/**
 * Checks if a property does exists on a given object.
 *
 * @method propertyExists
 *
 * @param {Object} object
 * @param {String} property
 *
 * @returns {void}
 */
const propertyExists = function(object, property) {
    it('should have property ' + property + ' implemented', function() {
        // set dummy providor, to prevent error
        // web3.setProvider(new FakeHttpProvider());
        assert.notEqual('undefined', typeof object[property], 'property ' + property + ' is not implemented');
    });
};

/**
 * Runs a noop transaction to move instamine forward. Useful for confirmation handler testing.
 *
 * @method mine
 *
 * @param {Web3} web3
 * @param {Account|string|number} account
 *
 * @returns {Promise<Object>}
 */
const mine = async function(web3, account) {
    await web3.eth.sendTransaction({
        from: account,
        to: account,
        gasPrice: '1',
        gas: 4000000,
        value: web3.utils.toWei('0', 'ether')
    });
};

/**
 * Extracts a receipt object from 1.x error message
 *
 * @method extractReceipt
 *
 * @param {string} message
 *
 * @returns {Object}
 */
const extractReceipt = function(message) {
    const receiptString = message.split('the EVM:')[1].trim();
    return JSON.parse(receiptString);
};

/**
 * Conditionally requires web3. Loads the injected web3.min.js file when running headless browser tests,
 * the commonjs bundle of web3 otherwise.
 *
 * @method getWeb3
 *
 * @returns {Web3}
 */
const getWeb3 = function() {
    if (typeof window !== 'undefined') {
        return window.Web3;
    }

    return require('web3');
};

/**
 * Gets correct websocket port for client. Ganache uses 8545 for both http and ws. It's run in e2e.ganache.sh
 * and for all the headless browser tests
 *
 * @method getWebsocketPort
 *
 * @returns {number}
 */
const getWebsocketPort = function() {
    if (typeof window !== 'undefined' || process.env.GANACHE) {
        return 8545;
    }

    return 8546;
};

module.exports = {
    methodExists: methodExists,
    propertyExists: propertyExists,
    mine: mine,
    extractReceipt: extractReceipt,
    getWeb3: getWeb3,
    getWebsocketPort: getWebsocketPort
};

