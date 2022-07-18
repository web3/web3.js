var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Web3 = require('../packages/web3');
var Accounts = require("./../packages/web3-eth-accounts");
var chai = require('chai');
var assert = chai.assert;
var bn = require('bn.js');
var utils = require("../packages/web3-utils");

var common = {
    baseChain: 'mainnet',
    customChain: {
        name: 'custom-network',
        networkId: 1,
        chainId: 1,
    },
    hardfork: 'istanbul',
};

var commonBerlin = {
    baseChain: 'mainnet',
    customChain: {
        name: 'custom-network',
        networkId: 1,
        chainId: 1,
    },
    hardfork: 'berlin'
};

var commonLondon = {
    baseChain: 'mainnet',
    customChain: {
        name: 'custom-network',
        networkId: 1,
        chainId: 1,
    },
    hardfork: 'london'
};

var preEip1559Block = {
    difficulty: "0x4ea3f27bc",
    extraData: "0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32",
    gasLimit: "0x1388",
    gasUsed: "0x0",
    hash: "0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae",
    logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    miner: "0xbb7b8287f3f0a933474a79eae42cbca977791171",
    mixHash: "0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843",
    nonce: "0x689056015818adbe",
    number: "0x1b4",
    parentHash: "0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54",
    receiptsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    size: "0x220",
    stateRoot: "0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d",
    timestamp: "0x55ba467c",
    totalDifficulty: "0x78ed983323d",
    transactions: [],
    transactionsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    uncles: []
}

var postEip1559Block = {
    baseFeePerGas: "0x7",
    difficulty: "0x6cd6be3a",
    extraData: "0x796f75747562652e636f6d2f77617463683f763d6451773477395767586351",
    gasLimit: "0x1c9c381",
    gasUsed: "0x8dc073",
    hash: "0x846880b1158f434884f3637802ed09bac77eafc35b5f03b881ac88ce38a54907",
    logsBloom: "0x4020001000000000000000008000010000000000400200000001002140000008000000010000810020000840000204304000081000000b00400010000822200004200020020140000001000882000064000021303200020000400008800000000002202102000084010000090020a8000800002000000010000030300000000000000006001005000040080001010000010040018100004c0050004000000000420000000021000200000010020008100000004000080000000000000040000900080102004002000080210201081014004030200148101000002020108025000018020020102040000204240500010000002200048000401300080088000002",
    miner: "0x86864f1edf10eaf105b1bdc6e9aa8232b4c6aa00",
    mixHash: "0xa29afb1fa1aea9eeac72ff435a8fc420bbc1fa1be08223eb61f294ee32250bde",
    nonce: "0x122af1a5ccd78f3b",
    number: "0xa0d600",
    parentHash: "0x28f49150e1fe6f245655925b290f59e707d1e5c646dadaa22937169433b30294",
    receiptsRoot: "0xc97d4f9980d680053606318a5820261a1dccb556d1056b70f0d48fb384986be5",
    sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    size: "0x2042",
    stateRoot: "0x116981b10423133ade5bd44f03c54cc3c57f4467a1c3d4b0c6d8d33a76c361ad",
    timestamp: "0x60dc24ec",
    totalDifficulty: "0x78828f2d886cbb",
    transactions: [],
    transactionsRoot: "0x738f53f745d58169da93ebbd52cc49e0c979d6ca68a6513007b546b19ab78ba4",
    uncles: []
  }

var accessList = [
    {
      address: '0x0000000000000000000000000000000000000101',
      storageKeys: [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x00000000000000000000000000000000000000000000000000000000000060a7"
      ]
    }
];

var clone = function (object) { return object ? Object.assign({},object) : []; };

var tests = [
    {
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "20000000000",
            gas: 21000,
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "1000000000",
            data: "",
            common: common
        },
        // signature from eth_signTransaction
        rawTransaction: "0xf868808504a817c80082520894f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008026a0afa02d193471bb974081585daabf8a751d4decbb519604ac7df612cc11e9226da04bf1bd55e82cebb2b09ed39bbffe35107ea611fa212c2d9a1f1ada4952077118",
        oldSignature: "0xf868808504a817c80082520894f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008026a0afa02d193471bb974081585daabf8a751d4decbb519604ac7df612cc11e9226da04bf1bd55e82cebb2b09ed39bbffe35107ea611fa212c2d9a1f1ada4952077118",
        transactionHash: "0xab0f71614c37231d71ae521ce188a9c7c9d5e976124a91f62f9f125348dd0326",
        messageHash: "0x2c7903a33b55caf582d170f21595f1a7e598df3fa61b103ea0cd9d6b2a92565d"
    },
    {
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "1",
            gas: 31853,
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "0",
            data: "",
            common: common
        },
        // expected r and s values from signature
        r: "0x22f17b38af35286ffbb0c6376c86ec91c20ecbad93f84913a0cc15e7580cd9",
        s: "0x83d6e12e82e3544cb4439964d5087da78f74cefeec9a450b16ae179fd8fe20",
        // signature from eth_signTransaction
        oldSignature: "0xf85d8080827c6d94f0109fc8df283027b6285cc889f5aa624eac1f558080269f22f17b38af35286ffbb0c6376c86ec91c20ecbad93f84913a0cc15e7580cd99f83d6e12e82e3544cb4439964d5087da78f74cefeec9a450b16ae179fd8fe20",
        rawTransaction: "0xf85f8001827c6d94f0109fc8df283027b6285cc889f5aa624eac1f55808026a074dcecc6b8ad09ca09882ac1088eac145e799f56ea3f5b5fe8fcb52bbd3ea4f7a03d49e02af9c239b1b8aea8a7ac9162862dec03207f9f59bc38a4f2b9e42077a9",
        transactionHash: "0xfe1f3da48513409d62210b76d3493190fed19e4d54f0aa4283715184bff68e0b",
        messageHash: "0xce07a6c829c9a7d0a11d5ce7120bfdae769b75ba2c20961a00738d540267a975"
    },
    {
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "234567897654321",
            gas: 2000000,
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "1000000000",
            data: "",
            common: common
        },
        // expected r and s values from signature
        r: "0x9ebb6ca057a0535d6186462bc0b465b561c94a295bdb0621fc19208ab149a9c",
        s: "0x440ffd775ce91a833ab410777204d5341a6f9fa91216a6f3ee2c051fea6a0428",
        // signature from eth_signTransaction
        rawTransaction: "0xf86a8086d55698372431831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a009ebb6ca057a0535d6186462bc0b465b561c94a295bdb0621fc19208ab149a9ca0440ffd775ce91a833ab410777204d5341a6f9fa91216a6f3ee2c051fea6a0428",
        oldSignature: "0xf86a8086d55698372431831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a009ebb6ca057a0535d6186462bc0b465b561c94a295bdb0621fc19208ab149a9ca0440ffd775ce91a833ab410777204d5341a6f9fa91216a6f3ee2c051fea6a0428",
        transactionHash: "0xd8f64a42b57be0d565f385378db2f6bf324ce14a594afc05de90436e9ce01f60",
        messageHash: "0x6893a6ee8df79b0f5d64a180cd1ef35d030f3e296a5361cf04d02ce720d32ec5"
    },
    {
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "10",
            gas: 31853,
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "0",
            data: "",
            common: common
        },
        // expected r and s values from signature
        r: "0x22f17b38af35286ffbb0c6376c86ec91c20ecbad93f84913a0cc15e7580cd9",
        s: "0x83d6e12e82e3544cb4439964d5087da78f74cefeec9a450b16ae179fd8fe20",
        // signature from eth_signTransaction
        oldSignature: "0xf85d8080827c6d94f0109fc8df283027b6285cc889f5aa624eac1f558080269f22f17b38af35286ffbb0c6376c86ec91c20ecbad93f84913a0cc15e7580cd99f83d6e12e82e3544cb4439964d5087da78f74cefeec9a450b16ae179fd8fe20",
        rawTransaction: "0xf85f800a827c6d94f0109fc8df283027b6285cc889f5aa624eac1f55808025a03cbfff5b8ef4588b930ecbf9b85388795875edf814dfc6c71884f99b6d7555cca057142e729c1c83bfccb2785e629fc32dffb2e613df565e78e119aa4694cb1df9",
        transactionHash: "0x247533e8b3d12185a871fca5503b7e86f2fecef4a43ded244d5c18ec6b6b057f",
        messageHash: "0xf5932468728558772f9422155ef1d7de7f8daf41542da16f1c1063cb98299953"
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        iban: 'XE25RG8S3H5TX5RD7QTL5UPVW90AHN2VYDC',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "20000000000",
            gas: 21000,
            to: '0x3535353535353535353535353535353535353535',
            toIban: 'XE4967QZMA14MI680T89KSPPJEJMU68MEYD', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "",
            common: common
        },
        // signature from eth_signTransaction
        rawTransaction: "0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a04f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88da07e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0",
        oldSignature: "0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a7640000801ba0300e0d8f83ac82943e468164fa80236fdfcff21f978f66dd038b875cea6faa51a05a8e4b38b819491a0bb4e1f5fb4fd203b6a1df19e2adbec2ebdddcbfaca555f0",
        transactionHash: "0xda3be87732110de6c1354c83770aae630ede9ac308d9f7b399ecfba23d923384",
        messageHash: "0x7dbc5644b83abd32d014d170ba9bdc855c126328c0cb41af0ed6422bef0bb32e"
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
        // signature from eth_signTransaction
        rawTransaction: "0xf8708085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd26a031bb05bd1535150d312dcaa870a4a69c130a51aa80537659c1f308bf1f180ac6a012c938a8e04ac4e279d0b7c29811609031a96e949ad98f1ca74ca6078910bede",
        oldSignature: "0xf8708085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd1ba081bba037015419ab5ce36e930b987da71b0ed5f0efb1849613223bf72399f598a05d2c1f109ad13f98a7693cfc35291e404ea8795755a176eb58a818de44f3756d",
        transactionHash: "0xe86ab542020b3f386af1a1c79881d5db06f5fac58da79f697308f1d1e1799f2c",
        messageHash: "0x044d45bc28c2126e98c9cd0103a6559f5a92e01ecc201f48472f1e10a4c3ae27"
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 10,
            gasPrice: "230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
        // signature from eth_signTransaction
        rawTransaction: "0xf8700a85358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a0496e628e8348a24312ded09ee3d99d85b1b8f947725aa382dcf4003b7389d5aaa00c1b1cfdd66c510fd708d33279a1a61e53dff3c6ced67cf7f7b830862d6e2029",
        oldSignature: "0xf8700a85358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a0496e628e8348a24312ded09ee3d99d85b1b8f947725aa382dcf4003b7389d5aaa00c1b1cfdd66c510fd708d33279a1a61e53dff3c6ced67cf7f7b830862d6e2029",
        transactionHash: "0x42fb18cc20b10438c6b4bcb4f3fc777a72195caf3e8b6ddc671df4a249e84ba7",
        messageHash: "0xa75c245723fedf4b739771f5eeedeb3dc6ecd3b9ea79277a33dc5ab27be0c911"
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: '0xa',
            gasPrice: "230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
        // signature from eth_signTransaction
        rawTransaction: "0xf8700a85358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a0496e628e8348a24312ded09ee3d99d85b1b8f947725aa382dcf4003b7389d5aaa00c1b1cfdd66c510fd708d33279a1a61e53dff3c6ced67cf7f7b830862d6e2029",
        oldSignature: "0xf8700a85358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a0496e628e8348a24312ded09ee3d99d85b1b8f947725aa382dcf4003b7389d5aaa00c1b1cfdd66c510fd708d33279a1a61e53dff3c6ced67cf7f7b830862d6e2029",
        transactionHash: "0x42fb18cc20b10438c6b4bcb4f3fc777a72195caf3e8b6ddc671df4a249e84ba7",
        messageHash: "0xa75c245723fedf4b739771f5eeedeb3dc6ecd3b9ea79277a33dc5ab27be0c911"
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: '16',
            gasPrice: "230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
        // signature from eth_signTransaction
        rawTransaction: "0xf8701085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a04ba217e16f62ac277698e8853bcc010db07285b457606e9f3487c70ccc5e6508a05c6cfaa17fc1a52bede0cf25c8bd2e024b4fb89ed205f62cb3e177a83654f29d",
        oldSignature: "0xf8701085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a04ba217e16f62ac277698e8853bcc010db07285b457606e9f3487c70ccc5e6508a05c6cfaa17fc1a52bede0cf25c8bd2e024b4fb89ed205f62cb3e177a83654f29d",
        transactionHash: "0xa2db7be5398c250e3ecf569c573f222255d46c509199ff649cca5e806edf5212",
        messageHash: "0x9c8c1fb88a95974c5ac75b6c58af2b5a62d9ccb9dffad7552a3182344bf37c27"
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 16,
            gasPrice: "230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
        // signature from eth_signTransaction
        rawTransaction: "0xf8701085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a04ba217e16f62ac277698e8853bcc010db07285b457606e9f3487c70ccc5e6508a05c6cfaa17fc1a52bede0cf25c8bd2e024b4fb89ed205f62cb3e177a83654f29d",
        oldSignature: "0xf8701085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a04ba217e16f62ac277698e8853bcc010db07285b457606e9f3487c70ccc5e6508a05c6cfaa17fc1a52bede0cf25c8bd2e024b4fb89ed205f62cb3e177a83654f29d",
        transactionHash: "0xa2db7be5398c250e3ecf569c573f222255d46c509199ff649cca5e806edf5212",
        messageHash: "0x9c8c1fb88a95974c5ac75b6c58af2b5a62d9ccb9dffad7552a3182344bf37c27"
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: '0x16',
            gasPrice: "230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
        // signature from eth_signTransaction
        rawTransaction: "0xf8701685358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd26a0e027ec9e9921975678b73de44f7d2cd6b987a6655b9d0291b2cdff15836c6efba051b4e20835793bf0cdf268339111a24d80a4a7bb141e975a66d0edbcc20542d0",
        oldSignature: "0xf8701685358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd26a0e027ec9e9921975678b73de44f7d2cd6b987a6655b9d0291b2cdff15836c6efba051b4e20835793bf0cdf268339111a24d80a4a7bb141e975a66d0edbcc20542d0",
        transactionHash: "0x3135f97ac8d534b4b487cc2965fb1dcf427b92fd233577900dab3420e7afca13",
        messageHash: "0x77fd104f011a0085a9fa80f6f77cb213bce71fe8b4585d6fa9e3217117263a5b"
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: '0x16',
            gasPrice: "230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            input: "0x0123abcd",
            common: common
        },
        // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
        // signature from eth_signTransaction
        rawTransaction: "0xf8701685358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd26a0e027ec9e9921975678b73de44f7d2cd6b987a6655b9d0291b2cdff15836c6efba051b4e20835793bf0cdf268339111a24d80a4a7bb141e975a66d0edbcc20542d0",
        oldSignature: "0xf8701685358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd26a0e027ec9e9921975678b73de44f7d2cd6b987a6655b9d0291b2cdff15836c6efba051b4e20835793bf0cdf268339111a24d80a4a7bb141e975a66d0edbcc20542d0",
        transactionHash: "0x3135f97ac8d534b4b487cc2965fb1dcf427b92fd233577900dab3420e7afca13",
        messageHash: "0x77fd104f011a0085a9fa80f6f77cb213bce71fe8b4585d6fa9e3217117263a5b"
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 2,
            gasPrice: "20000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            input: "0x0123abcd",
            common: common
        },
        error: true
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 2,
            gasPrice: "20000",
            gas: 0,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            input: "0x0123abcd",
            common: common
        },
        error: true
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 2,
            gasPrice: "0A",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        error: true
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 2,
            gasPrice: "200000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "test",
            common: common
        },
        error: true
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 2,
            gasPrice: "A",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        error: true
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 'a',
            gasPrice: "230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        error: true
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: -1,
            nonce: 1,
            gasPrice: "230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        error: true
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: -1,
            nonce: 0,
            gasPrice: "230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        error: true
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: -2,
            gasPrice: "230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        error: true
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "-230000000000",
            gas: 50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        error: true
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "230000000000",
            gas: -50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd",
            common: common
        },
        error: true
    },
    {
        // test #23
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "20000000000",
            gas: 27200,
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "1000000000",
            data: "",
            common: commonBerlin,
            accessList: accessList
        },
        // signature from eth_signTransaction
        rawTransaction: "0x01f8c601808504a817c800826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a07a49fff8f639e42af36704b16e30fd95823d9ab7e71bf7c231e397dec2c5427ca0773bfdc5e911eedc0470325727426cff3c65329be4701005cd4ea620aacfa335",
        oldSignature: "0x01f8c601808504a817c800826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a07a49fff8f639e42af36704b16e30fd95823d9ab7e71bf7c231e397dec2c5427ca0773bfdc5e911eedc0470325727426cff3c65329be4701005cd4ea620aacfa335",
        transactionHash: "0xbac5b9b1d381034a2eaee9d574acaff42b39dc3bc236a6022928828bdb189b92",
        messageHash: "0x19920e15ec80c033dec688ccc2cb414144a0dac23f6f36f503390228cc4672eb"
    },
    {
        // test #24
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            maxPriorityFeePerGas: '0x3B9ACA00',
            maxFeePerGas: '0xB2D05E00',
            gas: 27200,
            gasLimit: '0x6A40',
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "1000000000",
            data: "",
            common: commonLondon,
            accessList: accessList
        },
        // signature from eth_signTransaction
        rawTransaction: "0x02f8ca0180843b9aca0084b2d05e00826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0e86d3360f40f934686e1f9e53d5f49634adb0227169dd8a93b66683eb32b9c1ca04e5851b4601e2e9178148ca0f4f8360d9fba16baf272931debdf270ffa6fafc9",
        oldSignature: "0x02f8ca0180843b9aca0084b2d05e00826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0e86d3360f40f934686e1f9e53d5f49634adb0227169dd8a93b66683eb32b9c1ca04e5851b4601e2e9178148ca0f4f8360d9fba16baf272931debdf270ffa6fafc9",
        transactionHash: "0xc102cf9a2cfa23b06d013970497793077c2fa2a203ec32ddeee2ec87a4ab1cb8",
        messageHash: "0x69325a2750893097fb1b7ab621bacef5fc20fd33374e1c3f44a79f9f35602b59"
    },
    {
        // test #25
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            maxPriorityFeePerGas: '0x3B9ACA00',
            maxFeePerGas: '0xB2D05E00',
            gasLimit: '0x6A40',
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "1000000000",
            data: "",
            common: commonLondon
        },
        // signature from eth_signTransaction
        rawTransaction: "0x02f86e0180843b9aca0084b2d05e00826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080c080a0d1290a118d51918c1ca17e3af0267c45efcd745cf42e78eabc444c424d6bcf37a003c81e1fda169575023a94200ee034128747f91020e704abaee30dbcfc785c36",
        oldSignature: "0x02f86e0180843b9aca0084b2d05e00826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080c080a0d1290a118d51918c1ca17e3af0267c45efcd745cf42e78eabc444c424d6bcf37a003c81e1fda169575023a94200ee034128747f91020e704abaee30dbcfc785c36",
        transactionHash: "0x82c19b39a6b7eaa0492863a8b236fad5018f267b4977c270ddd5228c4cbda60e",
        messageHash: "0xe3beea0918f445c21eb2f42e3cbc3c5d54321ec642f47d12c473b2765df97f2b"
    },
    {
        // test #26
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            gas: 27200,
            maxPriorityFeePerGas: '0x3B9ACA00',
            gasLimit: '0x6A40',
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "1000000000",
            data: "",
            common: commonLondon
        },
        // signature from eth_signTransaction
        rawTransaction: "0x02f86e0180843b9aca00843b9aca0e826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080c080a0eb8ca6017e6926503ce11c404ba9b61f30d53ea934857e4f4489f43a6c189cf8a03655ba42b2fdcabdb3363cb39e7f672baa91455632e02bab27f92e1a275ca833",
        oldSignature: "0x02f86e0180843b9aca00843b9aca0e826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080c080a0eb8ca6017e6926503ce11c404ba9b61f30d53ea934857e4f4489f43a6c189cf8a03655ba42b2fdcabdb3363cb39e7f672baa91455632e02bab27f92e1a275ca833",
        transactionHash: "0x488a813f2286f7c015947aa13133bdae49ec75ae1c8f5eba80034d71a038dca8",
        messageHash: "0xcd6d6dee80ecc38f1b22f2d128bf6043dc41079fc913183a8995b5b3e187df61"
    },
    {
        // test #27
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            gas: 27200,
            maxPriorityFeePerGas: '0x3B9ACA00',
            gasLimit: '0x6A40',
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "1000000000",
            data: "",
            common: commonLondon,
            accessList: accessList
        },
        // signature from eth_signTransaction
        rawTransaction: "0x02f8ca0180843b9aca00843b9aca0e826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a780a0e3a2e10c7d3af3407ec2d38c64788d6673926e9b28d6d2e7df3c94cdf0548233a00ad3e5faafaf3a9350ab16c1be0198ce9ff3c6bef0b91e05488d757f07de9557",
        oldSignature: "0x02f8ca0180843b9aca00843b9aca0e826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a780a0e3a2e10c7d3af3407ec2d38c64788d6673926e9b28d6d2e7df3c94cdf0548233a00ad3e5faafaf3a9350ab16c1be0198ce9ff3c6bef0b91e05488d757f07de9557",
        transactionHash: "0xbc2c9edab3d4e3a795fa402b52d6149e874de15f0cc6c0858eb34e1fe1ef31fe",
        messageHash: "0xa3a2cdc45e9cefb9a614ead90ce65f68bcf8a90dbe0ccbd84c1b62403bd05346"
    },
    {
        // test #28
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            maxPriorityFeePerGas: new bn('c7331248', 16),
            maxFeePerGas: new bn('cb72ec20', 16),
            gasLimit: '0x6A40',
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "1000000000",
            data: "",
            common: commonLondon
        },
        // signature from eth_signTransaction
        rawTransaction: "0x02f86e018084c733124884cb72ec20826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080c001a08896fb9a5c033e0163b073cf7a951a1db2dca41b26b4188f13a05158eb26fd32a005e8855691199cd0b6dcae88f3325c374e2f0697b9c528a5c10d5bd8dfb6a3e3",
        oldSignature: "0x02f86e018084c733124884cb72ec20826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080c001a08896fb9a5c033e0163b073cf7a951a1db2dca41b26b4188f13a05158eb26fd32a005e8855691199cd0b6dcae88f3325c374e2f0697b9c528a5c10d5bd8dfb6a3e3",
        transactionHash: "0xd5b7290a477b9c421d39e61d0f566ec33276fb49b9ff85cfd6152a18f1c92dab",
        messageHash: "0x17e20e530a889ce52057de228b5b97edcad6002468d723346cd0b6b7a9943457"
    },
    {
        // test #29
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            maxPriorityFeePerGas: '1000000000',
            maxFeePerGas: '3000000000',
            gasLimit: '0x6A40',
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "1000000000",
            data: "",
            common: commonLondon
        },
        // signature from eth_signTransaction
        rawTransaction: "0x02f86e0180843b9aca0084b2d05e00826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080c080a0d1290a118d51918c1ca17e3af0267c45efcd745cf42e78eabc444c424d6bcf37a003c81e1fda169575023a94200ee034128747f91020e704abaee30dbcfc785c36",
        oldSignature: "0x02f86e0180843b9aca0084b2d05e00826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080c080a0d1290a118d51918c1ca17e3af0267c45efcd745cf42e78eabc444c424d6bcf37a003c81e1fda169575023a94200ee034128747f91020e704abaee30dbcfc785c36",
        transactionHash: "0x82c19b39a6b7eaa0492863a8b236fad5018f267b4977c270ddd5228c4cbda60e",
        messageHash: "0xe3beea0918f445c21eb2f42e3cbc3c5d54321ec642f47d12c473b2765df97f2b"
    },
    {
        // test #30
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            maxPriorityFeePerGas: new utils.BN('0x3B9ACA00'),
            maxFeePerGas: new utils.BN('0xB2D05E00'),
            gasLimit: '0x6A40',
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "1000000000",
            data: "",
            common: commonLondon
        },
        // signature from eth_signTransaction
        rawTransaction: "0x02f86e0180843b9aca0084b2d05e00826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080c080a0d1290a118d51918c1ca17e3af0267c45efcd745cf42e78eabc444c424d6bcf37a003c81e1fda169575023a94200ee034128747f91020e704abaee30dbcfc785c36",
        oldSignature: "0x02f86e018084c733124884cb72ec20826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080c001a08896fb9a5c033e0163b073cf7a951a1db2dca41b26b4188f13a05158eb26fd32a005e8855691199cd0b6dcae88f3325c374e2f0697b9c528a5c10d5bd8dfb6a3e3",
        transactionHash: "0x82c19b39a6b7eaa0492863a8b236fad5018f267b4977c270ddd5228c4cbda60e",
        messageHash: "0xe3beea0918f445c21eb2f42e3cbc3c5d54321ec642f47d12c473b2765df97f2b"
    },
    {
        // test #31
        address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
        iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
        privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
        transaction: {
            chainId: 1,
            nonce: 0,
            gas: 27200,
            maxPriorityFeePerGas: '0x3B9ACA00',
            gasLimit: '0x6A40',
            to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
            toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
            value: "1000000000",
            data: "",
            common: commonBerlin
        },
        error: true,
        // signature from eth_signTransaction
        rawTransaction: "0x02f86e0180843b9aca00843b9aca0e826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080c080a0eb8ca6017e6926503ce11c404ba9b61f30d53ea934857e4f4489f43a6c189cf8a03655ba42b2fdcabdb3363cb39e7f672baa91455632e02bab27f92e1a275ca833",
        oldSignature: "0x02f86e0180843b9aca00843b9aca0e826a4094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca0080c080a0eb8ca6017e6926503ce11c404ba9b61f30d53ea934857e4f4489f43a6c189cf8a03655ba42b2fdcabdb3363cb39e7f672baa91455632e02bab27f92e1a275ca833",
        transactionHash: "0x488a813f2286f7c015947aa13133bdae49ec75ae1c8f5eba80034d71a038dca8",
        messageHash: "0xcd6d6dee80ecc38f1b22f2d128bf6043dc41079fc913183a8995b5b3e187df61"
    }
];

describe("eth", function () {
    describe("accounts", function () {
        // For each test
        tests.forEach(function (test, i) {
            if (test.error) {

                it("signTransaction must error", function(done) {
                    var ethAccounts = new Accounts();

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    testAccount.signTransaction(test.transaction)
                    .then(() => done())
                    .catch(function (err) {
                        assert.instanceOf(err, Error);
                        done();
                    })
                    .catch(e => {
                        console.log(i, e)
                    });
                });

            } else {

                it("signTransaction must compare to eth_signTransaction", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult(
                        test.transaction.common.hardfork === 'london' ?
                        postEip1559Block:
                        preEip1559Block
                    );
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_getBlockByNumber');
                        assert.deepEqual(payload.params, ['latest', false]);
                    });
                    provider.injectResult('0x5022');
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_gasPrice');
                        assert.deepEqual(payload.params, []);
                    });

                    var ethAccounts = new Accounts(web3);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    testAccount.signTransaction(test.transaction).then(function (tx) {
                        assert.equal(tx.messageHash, test.messageHash, "message hash failed");
                        assert.equal(tx.transactionHash, test.transactionHash, "tx hash failed");
                        assert.equal(tx.rawTransaction, test.rawTransaction, "rawtx failed");
                        done();
                    })
                    .catch(e => {
                        console.log(i, e)
                        done(e);
                    });
                });

                it("signTransaction using the iban as \"to\" must compare to eth_signTransaction", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult(
                        test.transaction.common.hardfork === 'london' ?
                        postEip1559Block:
                        preEip1559Block
                    );
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_getBlockByNumber');
                        assert.deepEqual(payload.params, ['latest', false]);
                    });

                    var ethAccounts = new Accounts(web3);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    var transaction = clone(test.transaction);
                    transaction.to = transaction.toIban;
                    delete transaction.toIban;
                    testAccount.signTransaction(transaction).then(function (tx) {
                        assert.equal(tx.rawTransaction, test.rawTransaction);
                        done();
                    })
                    .catch(e => {
                        console.log(i, e)
                        done(e);
                    });
                });

                it("signTransaction will call for nonce", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult('0xa');
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_getTransactionCount');
                        assert.deepEqual(payload.params, [test.address, "latest"]);
                    });
                    provider.injectResult(
                        test.transaction.common.hardfork === 'london' ?
                        postEip1559Block:
                        preEip1559Block
                    );
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_getBlockByNumber');
                        assert.deepEqual(payload.params, ['latest', false]);
                    });

                    var ethAccounts = new Accounts(web3);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    var transaction = clone(test.transaction);
                    delete transaction.nonce;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);
                        done();
                    })
                    .catch(e => {
                        console.log(i, e)
                        done(e);
                    });
                });

                it("signTransaction will call for gasPrice", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult(
                        test.transaction.common.hardfork === 'london' ?
                        postEip1559Block:
                        preEip1559Block
                    );
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_getBlockByNumber');
                        assert.deepEqual(payload.params, ['latest', false]);
                    });
                    provider.injectResult('0x5022');
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_gasPrice');
                        assert.deepEqual(payload.params, []);
                    });

                    var ethAccounts = new Accounts(web3);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    var transaction = clone(test.transaction);
                    delete transaction.gasPrice;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    })
                    .catch(e => {
                        console.log(i, e)
                        done(e);
                    });
                });


                it("signTransaction should not call for chainId if common.customChain.chainId provided", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult(
                        test.transaction.common.hardfork === 'london' ?
                        postEip1559Block:
                        preEip1559Block
                    );
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_getBlockByNumber');
                        assert.deepEqual(payload.params, ['latest', false]);
                    });

                    var ethAccounts = new Accounts(web3);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    var transaction = clone(test.transaction);
                    delete transaction.chainId;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    })
                    .catch(e => {
                        console.log(i, e)
                        done(e);
                    });
                });

                it("signTransaction should call for chainId if common.customChain.chainId not provided", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_chainId');
                        assert.deepEqual(payload.params, []);
                    });

                    provider.injectResult(
                        test.transaction.common.hardfork === 'london' ?
                        postEip1559Block:
                        preEip1559Block
                    );
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_getBlockByNumber');
                        assert.deepEqual(payload.params, ['latest', false]);
                    });

                    var ethAccounts = new Accounts(web3);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    var transaction = clone(test.transaction);
                    delete transaction.chainId;
                    delete transaction.common;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    })
                    .catch(e => {
                        console.log(i, e)
                        done(e);
                    });
                });

                it("signTransaction will call for networkId", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult(
                        test.transaction.common.hardfork === 'london' ?
                        postEip1559Block:
                        preEip1559Block
                    );
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_getBlockByNumber');
                        assert.deepEqual(payload.params, ['latest', false]);
                    });
                    provider.injectResult('0x5022');
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_gasPrice');
                        assert.deepEqual(payload.params, []);
                    });
                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_networkId');
                        assert.deepEqual(payload.params, []);
                    });

                    var ethAccounts = new Accounts(web3);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    var transaction = clone(test.transaction);
                    delete transaction.common;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    })
                    .catch(e => {
                        console.log(i, e)
                        done(e);
                    });
                });

                it("signTransaction will call for nonce, gasPrice, chainId and networkId", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_chainId');
                        assert.deepEqual(payload.params, []);
                    });
                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_getTransactionCount');
                        assert.deepEqual(payload.params, [test.address, "latest"]);
                    });
                    provider.injectResult(
                        test.transaction.common.hardfork === 'london' ?
                        postEip1559Block:
                        preEip1559Block
                    );
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_getBlockByNumber');
                        assert.deepEqual(payload.params, ['latest', false]);
                    });
                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_gasPrice');
                        assert.deepEqual(payload.params, []);
                    });
                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_networkId');
                        assert.deepEqual(payload.params, []);
                    });

                    var ethAccounts = new Accounts(web3);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    var transaction = clone(test.transaction);
                    delete transaction.chainId;
                    delete transaction.gasPrice;
                    delete transaction.nonce;
                    delete transaction.common;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    })
                    .catch(e => {
                        console.log(i, e)
                        done(e);
                    });
                });

                it("recoverTransaction, must recover signature", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult(
                        test.transaction.common.hardfork === 'london' ?
                        postEip1559Block:
                        preEip1559Block
                    );
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'eth_getBlockByNumber');
                        assert.deepEqual(payload.params, ['latest', false]);
                    });

                    var ethAccounts = new Accounts(web3);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);
                    testAccount.signTransaction(test.transaction).then(function (tx) {
                        assert.equal(ethAccounts.recoverTransaction(tx.rawTransaction), test.address);
                        done();
                    })
                    .catch(e => {
                        console.log(i, e)
                        done(e);
                    })
                });
            }
        });
    });
});
