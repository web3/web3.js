const baseExpectedResult = {};

export const testsNoParams = [
    {
        name: 'getGenesis',
        endpoint: 'genesis',
        expectedResult: {
            ...baseExpectedResult,
            endpoint: 'genesis',
        },
    },
    {
        name: 'getVoluntaryExits',
        endpoint: 'pool/voluntary_exits',
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getProposerSlashings',
        endpoint: 'pool/proposer_slashings',
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getAttesterSlashings',
        endpoint: 'pool/attester_slashings',
        expectedResult: {
            ...baseExpectedResult,
        },
    },
];

export const testsHasParams = [
    {
        name: 'getStateRoot',
        endpoint: 'states/head/root',
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getStateFork',
        endpoint: 'states/head/fork',
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getValidatorById',
        endpoint: `states/head/validators/1`,
        params: ['head', 1],
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getFinalityCheckpoints',
        endpoint: `states/head/finality_checkpoints`,
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
        },
    }, // need to test multiple parameters and optional parameters
    {
        name: 'getBlockHeadersById',
        endpoint: 'headers/head',
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getBlock',
        endpoint: 'blocks/head',
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getBlockRoot',
        endpoint: 'blocks/head/root',
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getBlockAttestations',
        endpoint: 'blocks/head/attestations',
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getValidators',
        endpoint: 'states/head/validators',
        params: ['head', 1, 'active'],
        expectedParams: {
            status: 'active',
            validatorId: 1,
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getValidators',
        endpoint: 'states/head/validators',
        params: ['head'],
        expectedParams: {
            status: undefined,
            validatorId: undefined,
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getValidatorBalances',
        endpoint: 'states/head/validator_balances',
        params: ['head'],
        expectedParams: {
            id: undefined,
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getCommittees',
        endpoint: 'states/head/committees',
        params: ['head'],
        expectedParams: {
            epoch: undefined,
            index: undefined,
            slot: undefined,
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getSyncCommittees',
        endpoint: 'states/head/sync_committees',
        params: ['head'],
        expectedParams: {
            epoch: undefined,
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getBlockHeaders',
        endpoint: 'headers',
        params: [],
        expectedParams: {
            slot: undefined,
            parentRoot: undefined,
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'postBlock',
        endpoint: 'blocks',
        params: [
            {
                slot: 1,
                proposerIndex: 1,
                parentRoot: 'head',
                stateRoot: 'head',
                body: 'head',
            },
        ],
        expectedParams: {
            signedBeaconBlock: {
                slot: 1,
                proposerIndex: 1,
                parentRoot: 'head',
                stateRoot: 'head',
                body: 'head',
            },
        },
        providerOptions: {
            httpMethod: 'post',
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'getPoolAttestations',
        endpoint: 'pool/attestations',
        params: [],
        expectedParams: {
            slot: undefined,
            committeeIndex: undefined,
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'postPoolAttestations',
        endpoint: 'pool/attestations',
        params: [
            {
                aggregation_bits: '0x01',
                signature:
                    '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
                data: {
                    slot: '1',
                    index: '1',
                    beacon_block_root:
                        '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    source: {
                        epoch: '1',
                        root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    },
                    target: {
                        epoch: '1',
                        root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    },
                },
            },
        ],
        expectedParams: {
            aggregation_bits: '0x01',
            signature:
                '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
            data: {
                slot: '1',
                index: '1',
                beacon_block_root:
                    '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                source: {
                    epoch: '1',
                    root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                },
                target: {
                    epoch: '1',
                    root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                },
            },
        },
        providerOptions: {
            httpMethod: 'post',
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'postAttesterSlashings',
        endpoint: 'pool/attester_slashings',
        params: [
            {
                attestation_1: {
                    attesting_indices: ['1'],
                    signature:
                        '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
                    data: {
                        slot: '1',
                        index: '1',
                        beacon_block_root:
                            '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                        source: {
                            epoch: '1',
                            root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                        },
                        target: {
                            epoch: '1',
                            root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                        },
                    },
                },
                attestation_2: {
                    attesting_indices: ['1'],
                    signature:
                        '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
                    data: {
                        slot: '1',
                        index: '1',
                        beacon_block_root:
                            '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                        source: {
                            epoch: '1',
                            root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                        },
                        target: {
                            epoch: '1',
                            root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                        },
                    },
                },
            },
        ],
        expectedParams: {
            attestation_1: {
                attesting_indices: ['1'],
                signature:
                    '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
                data: {
                    slot: '1',
                    index: '1',
                    beacon_block_root:
                        '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    source: {
                        epoch: '1',
                        root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    },
                    target: {
                        epoch: '1',
                        root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    },
                },
            },
            attestation_2: {
                attesting_indices: ['1'],
                signature:
                    '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
                data: {
                    slot: '1',
                    index: '1',
                    beacon_block_root:
                        '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    source: {
                        epoch: '1',
                        root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    },
                    target: {
                        epoch: '1',
                        root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    },
                },
            },
        },
        providerOptions: {
            httpMethod: 'post',
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'postProposerSlashings',
        endpoint: 'pool/proposer_slashings',
        params: [
            {
                signed_header_1: {
                    message: {
                        slot: '1',
                        proposer_index: '1',
                        parent_root:
                            '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                        state_root:
                            '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                        body_root:
                            '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    },
                    signature:
                        '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
                },
                signed_header_2: {
                    message: {
                        slot: '1',
                        proposer_index: '1',
                        parent_root:
                            '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                        state_root:
                            '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                        body_root:
                            '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    },
                    signature:
                        '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
                },
            },
        ],
        expectedParams: {
            signed_header_1: {
                message: {
                    slot: '1',
                    proposer_index: '1',
                    parent_root:
                        '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    state_root:
                        '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    body_root:
                        '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                },
                signature:
                    '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
            },
            signed_header_2: {
                message: {
                    slot: '1',
                    proposer_index: '1',
                    parent_root:
                        '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    state_root:
                        '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    body_root:
                        '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                },
                signature:
                    '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
            },
        },
        providerOptions: {
            httpMethod: 'post',
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'postSyncCommittees',
        endpoint: 'pool/sync_committees',
        params: [
            [
                {
                    slot: '1',
                    beacon_block_root:
                        '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    validator_index: '1',
                    signature:
                        '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
                },
            ],
        ],
        expectedParams: [
            {
                slot: '1',
                beacon_block_root:
                    '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                validator_index: '1',
                signature:
                    '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
            },
        ],
        providerOptions: {
            httpMethod: 'post',
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
    {
        name: 'postVoluntaryExits',
        endpoint: 'pool/voluntary_exits',
        params: [
            {
                message: {
                    epoch: '1',
                    validator_index: '1',
                },
                signature:
                    '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
            },
        ],
        expectedParams: {
            message: {
                epoch: '1',
                validator_index: '1',
            },
            signature:
                '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
        },
        providerOptions: {
            httpMethod: 'post',
        },
        expectedResult: {
            ...baseExpectedResult,
        },
    },
];
