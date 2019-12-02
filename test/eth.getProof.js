var testMethod = require('./helpers/test.method.js');
var Eth = require('../packages/web3-eth');
var BigNumber = require('bignumber.js');

var eth = new Eth();

var method = 'getProof';
var call = 'eth_getProof';

var proof = {
    address: '0x4E65FDa2159562a496F9f3522f89122A3088497a',
    balance: '0x1',
    codeHash: '0x0',
    nonce: '0x2',
    storageHash: '0x0',
    accountProof: ['0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80'],
    storageProof: [
        {
            key: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
            value: '0x1',
            proof: ['0x0']
        }
    ]
};

var formattedProof = {
    address: '0x4E65FDa2159562a496F9f3522f89122A3088497a',
    balance: '1',
    codeHash: '0x0',
    nonce: '2',
    storageHash: '0x0',
    accountProof: ['0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80'],
    storageProof: [
        {
            key: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
            value: '0x1',
            proof: ['0x0']
        }
    ]
};

var tests = [{
    args: ['0x4E65FDa2159562a496F9f3522f89122A3088497a', [2]], // checksum address
    formattedArgs: ['0x4e65fda2159562a496f9f3522f89122a3088497a', ['0x2'], eth.defaultBlock],
    result: proof,
    formattedResult: formattedProof,
    call: call
},{
    args: ['0x4E65FDa2159562a496F9f3522f89122A3088497a', [2], 0],
    formattedArgs: ['0x4e65fda2159562a496f9f3522f89122a3088497a', ['0x2'], '0x0'],
    result: proof,
    formattedResult: formattedProof,
    call: call
},{
    args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', [0xb], 0x0],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', ['0xb'], '0x0'],
    result: proof,
    formattedResult: formattedProof,
    call: call
}, {
    args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', [0xb], 'latest'],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', ['0xb'], 'latest'],
    result: proof,
    formattedResult: formattedProof,
    call: call
}, {
    args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', ['0xb'], 'latest'],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', ['0xb'], 'latest'],
    result: proof,
    formattedResult: formattedProof,
    call: call
}, {
    args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', ['11'], 'latest'],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', ['0xb'], 'latest'],
    result: proof,
    formattedResult: formattedProof,
    call: call
}, {
    args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', [new BigNumber('11')], 'latest'],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', ['0xb'], 'latest'],
    result: proof,
    formattedResult: formattedProof,
    call: call
}
// TODO: Fixing of test.method.js cloning of the arguments does destroy the BN object. Manually calling of utils.numberToHex with new BN('11'); does work.
// ,  {
//     args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', [new BN('11')], 'latest'],
//     formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', '0xb', 'latest'],
//     result: proof',
//     formattedResult: formattedProof',
//     call: call
// }
];

testMethod.runTests('eth', method, tests);

