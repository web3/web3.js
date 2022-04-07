var chai = require('chai');
var assert = chai.assert;
var formatters = require('../packages/web3-core-helpers/src/formatters.js');


describe('formatters', function () {
    describe('outputBlockFormatter', function () {
        it('should return the correct value', function () {

            assert.deepEqual(formatters.outputBlockFormatter({
                hash: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
                parentHash: '0x83ffb245cfced97ccc5c75253d6960376d6c6dea93647397a543a72fdaea5265',
                miner: '0xdcc6960376d6c6dea93647383ffb245cfced97cf',
                stateRoot: '0x54dda68af07643f68739a6e9612ad157a26ae7e2ce81f77842bb5835fbcde583',
                sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                bloom: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
                difficulty: '0x3e8',
                totalDifficulty: '0x3e8',
                number: '0x3e8',
                gasLimit: '0x3e8',
                gasUsed: '0x3e8',
                timestamp: '0x3e8',
                extraData: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
                nonce: '0x1fc0f46a3e5325fa',
                size: '0x3e8'
            }), {
                hash: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
                parentHash: '0x83ffb245cfced97ccc5c75253d6960376d6c6dea93647397a543a72fdaea5265',
                miner: '0xDCc6960376d6C6dEa93647383FfB245CfCed97Cf',
                stateRoot: '0x54dda68af07643f68739a6e9612ad157a26ae7e2ce81f77842bb5835fbcde583',
                sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                bloom: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
                difficulty: '1000',
                totalDifficulty: '1000',
                number: 1000,
                gasLimit: 1000,
                gasUsed: 1000,
                timestamp: 1000,
                extraData: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
                nonce: '0x1fc0f46a3e5325fa',
                size: 1000
            });
        });
        it('should return the correct value, when null values are present', function () {

            assert.deepEqual(formatters.outputBlockFormatter({
                hash: null,
                parentHash: '0x83ffb245cfced97ccc5c75253d6960376d6c6dea93647397a543a72fdaea5265',
                miner: null,
                stateRoot: '0x54dda68af07643f68739a6e9612ad157a26ae7e2ce81f77842bb5835fbcde583',
                sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                bloom: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
                difficulty: '0x3e8',
                totalDifficulty: '0x3e8',
                number: null,
                gasLimit: '0x3e8',
                gasUsed: '0x3e8',
                timestamp: '0x3e8',
                extraData: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
                nonce: null,
                size: '0x3e8'
            }), {
                hash: null,
                parentHash: '0x83ffb245cfced97ccc5c75253d6960376d6c6dea93647397a543a72fdaea5265',
                miner: null,
                stateRoot: '0x54dda68af07643f68739a6e9612ad157a26ae7e2ce81f77842bb5835fbcde583',
                sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                bloom: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
                difficulty: '1000',
                totalDifficulty: '1000',
                number: null,
                gasLimit: 1000,
                gasUsed: 1000,
                timestamp: 1000,
                extraData: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
                nonce: null,
                size: 1000
            });
        });

        it('should return the correct value, when baseFeePerGas is present', function () {

            assert.deepEqual(formatters.outputBlockFormatter({
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
            }), {
                baseFeePerGas: 7,
                difficulty: "1826012730",
                extraData: "0x796f75747562652e636f6d2f77617463683f763d6451773477395767586351",
                gasLimit: 30000001,
                gasUsed: 9289843,
                hash: "0x846880b1158f434884f3637802ed09bac77eafc35b5f03b881ac88ce38a54907",
                logsBloom: "0x4020001000000000000000008000010000000000400200000001002140000008000000010000810020000840000204304000081000000b00400010000822200004200020020140000001000882000064000021303200020000400008800000000002202102000084010000090020a8000800002000000010000030300000000000000006001005000040080001010000010040018100004c0050004000000000420000000021000200000010020008100000004000080000000000000040000900080102004002000080210201081014004030200148101000002020108025000018020020102040000204240500010000002200048000401300080088000002",
                miner: "0x86864F1edf10eAf105b1BDC6E9aA8232B4c6aA00",
                mixHash: "0xa29afb1fa1aea9eeac72ff435a8fc420bbc1fa1be08223eb61f294ee32250bde",
                nonce: "0x122af1a5ccd78f3b",
                number: 10540544,
                parentHash: "0x28f49150e1fe6f245655925b290f59e707d1e5c646dadaa22937169433b30294",
                receiptsRoot: "0xc97d4f9980d680053606318a5820261a1dccb556d1056b70f0d48fb384986be5",
                sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
                size: 8258,
                stateRoot: "0x116981b10423133ade5bd44f03c54cc3c57f4467a1c3d4b0c6d8d33a76c361ad",
                timestamp: 1625040108,
                totalDifficulty: "33920548661128379",
                transactions: [],
                transactionsRoot: "0x738f53f745d58169da93ebbd52cc49e0c979d6ca68a6513007b546b19ab78ba4",
                uncles: []
            });
        });
    });
});
