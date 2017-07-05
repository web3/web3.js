var testMethod = require('./helpers/test.method.js');

var method = 'sendTransaction';


var tests = [{
    args: [{
        from: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
        to: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
        value: '1234567654321',
        gasPrice: '324234234234'
    }],
    formattedArgs: [{
        from: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        value: "0x11f71f76bb1",
        gasPrice: "0x4b7dddc97a"
    }],
    result: ['0x1234567'],
    formattedResult: ['0x1234567'],
    notification: {
        method: 'eth_subscription',
        params: {
            subscription: '0x1234567',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'eth_'+ method
},{
    args: [{
        from: '0XDBDBDB2CBD23B783741E8D7FCF51E459B497E4A6',
        to: '0XDBDBDB2CBD23B783741E8D7FCF51E459B497E4A6',
        value: '1234567654321',
        data: '0x213453ffffff',
        gasPrice: '324234234234'
    }],
    formattedArgs: [{
        from: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        value: "0x11f71f76bb1",
        data: '0x213453ffffff',
        gasPrice: "0x4b7dddc97a"
    }],
    result: ['0x12345678976543213456786543212345675432'],
    formattedResult: ['0x12345678976543213456786543212345675432'],
    notification: {
        method: 'eth_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'eth_'+ method
},{
    args: [{
        from: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', // iban address
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321',
        gasPrice: '324234234234'
    }],
    formattedArgs: [{
        from: "0x00c5496aee77c1ba1f0854206a26dda82a81d6d8",
        to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        value: "0x11f71f76bb1",
        gasPrice: "0x4b7dddc97a"
    }],
    result: ['0x12345678976543213456786543212345675432'],
    formattedResult: ['0x12345678976543213456786543212345675432'],
    notification: {
        method: 'eth_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'eth_'+ method

// using local wallet
},{
    addWallet: function (web3) {
        web3.eth.accounts.wallet.add('0xd7d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142');
        // 0x5af0838657202f865A4547b5eD28a64f799960DC
    },
    args: [{
        from: '0x5af0838657202f865A4547b5eD28a64f799960DC',
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321',
        gasPrice: '324234234234',
        gas: 500000
    }],
    formattedArgs: [{
        from: "0x5af0838657202f865a4547b5ed28a64f799960dc",
        to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        value: "0x11f71f76bb1",
        gasPrice: "0x4b7dddc97a",
        gas: "0x7a120"
    }],
    result: ['0x12345678976543213456786543212345675432'],
    formattedResult: ['0x12345678976543213456786543212345675432'],
    notification: {
        method: 'eth_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'eth_sendRawTransaction'
},{
    error: true, // only for testing
    args: [{
        from: 'XE81ETHXREGGAVOFYORK', // iban address
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321'
    }],
    call: 'eth_'+ method
}];

testMethod.runTests('eth', method, tests);

