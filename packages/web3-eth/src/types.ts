import {
    PrefixedHexString,
    ValidTypes,
    ValidTypesEnum,
} from 'web3-core-types/src/types';

/**
 * @param gas eth_call consumes zero gas, but this parameter may be needed by some executions
 */
export type EthCallTransaction = {
    from: PrefixedHexString;
    to: PrefixedHexString;
    gas?: ValidTypes;
    gasPrice?: ValidTypes;
    value?: ValidTypes;
    data?: PrefixedHexString;
};

export interface Web3EthOptions {
    web3Client: string;
    returnType?: ValidTypesEnum;
}
