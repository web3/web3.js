var testMethod = require('./helpers/test.method.js');

var method = 'createAccessList';

var tests = [{
    args: [{
        from: '0x3bc5885c2941c5cda454bdb4a8c88aa7f248e312',
        data: '0x20965255',
        gasPrice: '0x3b9aca00',
        gas: '0x3d0900',
        to: '0x00f5f5f3a25f142fafd0af24a754fafa340f32c7'
    }],
    formattedArgs: [
        {
            from: '0x3bc5885c2941c5cda454bdb4a8c88aa7f248e312',
            data: '0x20965255',
            gasPrice: '0x3b9aca00',
            gas: '0x3d0900',
            to: '0x00f5f5f3a25f142fafd0af24a754fafa340f32c7'
        },
        'latest'
    ],
    result: {
        "accessList": [
            {
                "address": "0x00f5f5f3a25f142fafd0af24a754fafa340f32c7",
                "storageKeys": [
                    "0x0000000000000000000000000000000000000000000000000000000000000000"
                ]
            }
        ],
        "gasUsed": "0x644e"
    },
    formattedResult: {
        "accessList": [
            {
                "address": "0x00f5f5f3a25f142fafd0af24a754fafa340f32c7",
                "storageKeys": [
                    "0x0000000000000000000000000000000000000000000000000000000000000000"
                ]
            }
        ],
        "gasUsed": "0x644e"
    },
    call: 'eth_'+ method
}];

testMethod.runTests('eth', method, tests);

