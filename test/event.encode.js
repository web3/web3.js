import { assert } from 'chai';
import Eth from '../packages/web3-eth';

const address = '0x1234567890123456789012345678901234567890';
const signature = '0xffff';

const tests = [
    {
        abi: {
            name: 'event1',
            inputs: [],
            signature
        },
        options: {},
        expected: {
            address,
            topics: [
                signature
            ]
        }
    },
    {
        abi: {
            name: 'event1',
            inputs: [
                {
                    type: 'int',
                    name: 'a',
                    indexed: true
                }
            ],
            signature
        },
        options: {
            filter: {
                a: 16
            }
        },
        expected: {
            address,
            topics: [
                signature,
                '0x0000000000000000000000000000000000000000000000000000000000000010'
            ]
        }
    },
    {
        abi: {
            name: 'event1',
            inputs: [
                {
                    type: 'int',
                    name: 'a',
                    indexed: true
                },
                {
                    type: 'int',
                    name: 'b',
                    indexed: true
                },
                {
                    type: 'int',
                    name: 'c',
                    indexed: false
                },
                {
                    type: 'int',
                    name: 'd',
                    indexed: true
                }
            ],
            signature
        },
        options: {
            filter: {
                b: 4
            }
        },
        expected: {
            address,
            topics: [
                signature, // signature
                null, // a
                '0x0000000000000000000000000000000000000000000000000000000000000004', // b
                null // d
            ]
        }
    },
    {
        abi: {
            name: 'event1',
            inputs: [
                {
                    type: 'int',
                    name: 'a',
                    indexed: true
                },
                {
                    type: 'int',
                    name: 'b',
                    indexed: true
                }
            ],
            signature
        },
        options: {
            filter: {
                a: [16, 1],
                b: 2
            }
        },
        expected: {
            address,
            topics: [
                signature,
                ['0x0000000000000000000000000000000000000000000000000000000000000010', '0x0000000000000000000000000000000000000000000000000000000000000001'],
                '0x0000000000000000000000000000000000000000000000000000000000000002'
            ]
        }
    },
    {
        abi: {
            name: 'event1',
            inputs: [
                {
                    type: 'int',
                    name: 'a',
                    indexed: true
                }
            ],
            signature
        },
        options: {
            filter: {
                a: null
            }
        },
        expected: {
            address,
            topics: [
                signature,
                null
            ]
        }
    },
    {
        abi: {
            name: 'event1',
            inputs: [
                {
                    type: 'int',
                    name: 'a',
                    indexed: true
                }
            ],
            signature
        },
        options: {
            filter: {
                a: 1
            },
            fromBlock: 'latest',
            toBlock: 'pending'
        },
        expected: {
            address,
            fromBlock: 'latest',
            toBlock: 'pending',
            topics: [
                signature,
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            ]
        }
    },
    {
        abi: {
            name: 'event1',
            inputs: [
                {
                    type: 'int',
                    name: 'a',
                    indexed: true
                }
            ],
            signature
        },
        options: {
            filter: {
                a: 1
            },
            fromBlock: 4,
            toBlock: 10
        },
        expected: {
            address,
            fromBlock: '0x4',
            toBlock: '0xa',
            topics: [
                signature,
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            ]
        }
    },
    {
        abi: {
            name: 'event1',
            inputs: [
                {
                    type: 'int',
                    name: 'a',
                    indexed: true
                }
            ],
            anonymous: true,
            signature
        },
        options: {
            filter: {
                a: 1
            }
        },
        expected: {
            address,
            topics: [
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            ]
        }
    },
    {
        abi: {
            name: 'event1',
            inputs: [
                {
                    type: 'int',
                    name: 'a',
                    indexed: true
                },
                {
                    type: 'int',
                    name: 'b',
                    indexed: true
                }
            ],
            anonymous: true,
            signature
        },
        options: {
            filter: {
                b: 1
            }
        },
        expected: {
            address,
            topics: [
                null,
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            ]
        }
    }
];

describe('lib/web3/event', () => {
    describe('encode', () => {
        tests.forEach((test, index) => {
            it(`test no: ${index}`, () => {
                const eth = new Eth();
                const contract = new eth.Contract([test.abi], address);

                const result = contract._encodeEventABI(test.abi, test.options);
                assert.deepEqual(result, test.expected);
            });
        });
    });
});
