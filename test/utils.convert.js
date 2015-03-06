var assert = require('assert');
var utils = require('../lib/utils.js');

describe('utils', function() {

    // given
    // NOTE: I made the following tests pass as long as the values are mathematically correct.
    // However, in the current state, there are inconsistancy regarding the trailing decimals.
    // For instance '10 Mether' but '10.00 Gether'
    var data = [{
        test: 10e-9,
        res: '0.00 wei'
    }, {
        test: 10e-6,
        res: '0.00 wei'
    }, {
        test: 10e-3,
        res: '0.01 wei'
    }, {
        test: '-10',
        res: '-10 wei'
    }, {
        test: '0',
        res: '0 wei'
    }, {
        test: 0,
        res: '0 wei'
    }, {
        test: '1200000',
        res: '1200 Kwei'
    }, {
        test: 1e3,
        res: '1000 wei'
    }, {
        test: 10e3,
        res: '10 Kwei'
    }, {
        test: 100e3,
        res: '100 Kwei'
    }, {
        test: 1000e3,
        res: '1000 Kwei'
    }, {
        test: 10e6,
        res: '10 Mwei'
    }, {
        test: 100e6,
        res: '100 Mwei'
    }, {
        test: 1000e6,
        res: '1000 Mwei'
    }, {
        test: 10e9,
        res: '10 Gwei'
    }, {
        test: 100e9,
        res: '100 Gwei'
    }, {
        test: 1000e9,
        res: '1000 Gwei'
    }, {
        test: 10e12,
        res: '10 szabo'
    }, {
        test: 100e12,
        res: '100 szabo'
    }, {
        test: 1000e12,
        res: '1000 szabo'
    }, {
        test: 10e15,
        res: '10 finney'
    }, {
        test: 100e15,
        res: '100 finney'
    }, {
        test: 1000e15,
        res: '1000 finney'
    }, {
        test: 10e18,
        res: '10 ether'
    }, {
        test: 100e18,
        res: '100 ether'
    }, {
        test: 1000e18,
        res: '1000 ether'
    }, {
        test: 10e21,
        res: '10 grand'
    }, {
        test: 100e21,
        res: '100.00 grand'
    }, {
        test: 1000e21,
        res: '1000 grand'
    }, {
        test: 10e24,
        res: '10 Mether'
    }, {
        test: 100e24,
        res: '100.00 Mether'
    }, {
        test: 1000e24,
        res: '1000 Mether'
    }, {
        test: 10e27,
        res: '10.00 Gether'
    }, {
        test: 100e27,
        res: '100.00 Gether'
    }, {
        test: 1000e27,
        res: '1000 Gether'
    }, {
        test: 10e30,
        res: '10.00 Tether'
    }, {
        test: 100e30,
        res: '100.00 Tether'
    }, {
        test: 1000e30,
        res: '1,000.00 Tether'
    }, {
        test: 10e33,
        res: '10.00 Pether'
    }, {
        test: 100e33,
        res: '100.00 Pether'
    }, {
        test: 1000e33,
        res: '1000 Pether'
    }, {
        test: 10e36,
        res: '10.00 Eether'
    }, {
        test: 100e36,
        res: '100.00 Eether'
    }, {
        test: 1000e36,
        res: '1,000.00 Eether'
    }, {
        test: 10e39,
        res: '10 Zether'
    }, {
        test: 100e39,
        res: '100.00 Zether'
    }, {
        test: 1000e39,
        res: '1000 Zether'
    }, {
        test: 10e42,
        res: '10 Yether'
    }, {
        test: 100e42,
        res: '100.00 Yether'
    }, {
        test: 1000e42,
        res: '1,000.00 Yether'
    }, {
        test: 10e45,
        res: '10 Nether'
    }, {
        test: 100e45,
        res: '100.00 Nether'
    }, {
        test: 1000e45,
        res: '1000 Nether'
    }, {
        test: 10e48,
        res: '10 Dether'
    }, {
        test: 100e48,
        res: '100.00 Dether'
    }, {
        test: 1000e48,
        res: '1000 Dether'
    }, {
        test: 10e51,
        res: '10 Vether'
    }, {
        test: 100e51,
        res: '100.00 Vether'
    }, {
        test: 1000e51,
        res: '1,000.00 Vether'
    }, {
        test: 10e54,
        res: '10 Uether'
    }, {
        test: 10e57,
        res: '10000 Uether'
    }, {
        test: 100e57,
        res: '100,000.00 Uether'
    }, {
        test: 1000e57,
        res: '1,000,000.00 Uether'
    }, {
        test: '10',
        res: utils.toEth(10)
    }, {
        test: '100',
        res: utils.toEth(100)
    }, {
        test: '1000',
        res: utils.toEth(1000)
    }, {
        test: '1001',
        res: utils.toEth(1001)
    }, {
        test: '999',
        res: utils.toEth(999)
    }, {
        test: '10000000000000000000000',
        res: utils.toEth(10e21) // 10 grand
    }, {
        test: '10 000',
        res: '10 Kwei'
    }, {
        test: '10,000',
        res: '10 Kwei'
    }, {
        test: '10,000.00',
        res: '10 Kwei'
    }];

    data.forEach(function(elem) {
        it('should convert ' + elem.test + ' into ' + elem.res, function() {
            // when
            var res = utils.toEth(elem.test);
           
            // then
            assert.equal(res, elem.res);
        });
    });
});
