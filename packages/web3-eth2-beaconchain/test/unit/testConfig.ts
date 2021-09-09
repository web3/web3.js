const baseExpectedResult = {};

export const testsNoParams = [
    {
        name: 'getGenesis',
        endpoint: 'genesis',
        expectedResult: {
            ...baseExpectedResult,
            data: {
                genesis_time: '1590832934',
                genesis_validators_root:
                    '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                genesis_fork_version: '0x00000000',
            },
        },
    },
    {
        name: 'getVoluntaryExits',
        endpoint: 'pool/voluntary_exits',
        expectedResult: {
            ...baseExpectedResult,
            data: [
                {
                    message: {
                        epoch: '1',
                        validator_index: '1',
                    },
                    signature:
                        '0x1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505cc411d61252fb6cb3fa0017b679f8bb2305b26a285fa2737f175668d0dff91cc1b66ac1fb663c9bc59509846d6ec05345bd908eda73e670af888da41af171505',
                },
            ],
        },
    },
    {
        name: 'getProposerSlashings',
        endpoint: 'pool/proposer_slashings',
        expectedResult: {
            ...baseExpectedResult,
            data: [
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
        },
    },
    {
        name: 'getAttesterSlashings',
        endpoint: 'pool/attester_slashings',
        expectedResult: {
            ...baseExpectedResult,
            data: [
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
            data: {
                root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
            },
        },
    },
    {
        name: 'getStateFork',
        endpoint: 'states/head/fork',
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
            data: {
                previous_version: '0x00000000',
                current_version: '0x00000000',
                epoch: '1',
            },
        },
    },
    {
        name: 'getValidatorById',
        endpoint: `states/head/validators/1`,
        params: ['head', 1],
        expectedResult: {
            ...baseExpectedResult,
            data: {
                index: '1',
                balance: '1',
                status: 'active_ongoing',
                validator: {
                    pubkey: '0x93247f2209abcacf57b75a51dafae777f9dd38bc7053d1af526f220a7489a6d3a2753e5f3e8b1cfe39b56f43611df74a',
                    withdrawal_credentials:
                        '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                    effective_balance: '1',
                    slashed: false,
                    activation_eligibility_epoch: '1',
                    activation_epoch: '1',
                    exit_epoch: '1',
                    withdrawable_epoch: '1',
                },
            },
        },
    },
    {
        name: 'getFinalityCheckpoints',
        endpoint: `states/head/finality_checkpoints`,
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
            data: {
                previous_justified: {
                    epoch: '1',
                    root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                },
                current_justified: {
                    epoch: '1',
                    root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                },
                finalized: {
                    epoch: '1',
                    root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                },
            },
        },
    }, // need to test multiple parameters and optional parameters
    {
        name: 'getBlockHeadersById',
        endpoint: 'headers/head',
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
            data: {
                root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
                canonical: true,
                header: {
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
        },
    },
    {
        name: 'getBlock',
        endpoint: 'blocks/head',
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
            version: 'phase0',
        },
    },
    {
        name: 'getBlockRoot',
        endpoint: 'blocks/head/root',
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
            data: {
                root: '0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2',
            },
        },
    },
    {
        name: 'getBlockAttestations',
        endpoint: 'blocks/head/attestations',
        params: ['head'],
        expectedResult: {
            ...baseExpectedResult,
            data: [
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
            data: [
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
