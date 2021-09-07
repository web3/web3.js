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
    //need to test default params and required params, get eth2 expected results filled
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
    // {
    //     name: 'postBlock',
    //     endpoint: 'blocks',
    //     params: ['beacon'],
    //     expectedParams: {
    //         params: {signedBeaconBlock: 'beacon' },
    //         providerOptions: {
    //             httpMethod: 'post',
    //         },
    //     },
    //     expectedResult: {
    //         ...baseExpectedResult,
    //     },
    // },
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
];
