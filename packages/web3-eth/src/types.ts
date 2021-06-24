import {
    PrefixedHexString,
    ValidTypes,
    ValidTypesEnum,
} from 'web3-utils/lib/types';

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
    packageName?: string;
    providerUrl: string;
    returnType?: ValidTypesEnum;
}
