import { Web3Error, Web3PackageErrorConfig } from 'web3-core-logger/src/types';
import packageVersion from './_version';

export enum Web3UtilsErrorNames {
    invalidInput = 'invalidInput',
    invalidDesiredType = 'invalidDesiredType',
}

interface Web3UtilsErrorsConfig extends Web3PackageErrorConfig {
    errors: Record<Web3UtilsErrorNames, Web3Error>;
}

export const Web3UtilsErrorsConfig: Web3UtilsErrorsConfig = {
    packageName: 'web3-utils',
    packageVersion,
    errors: {
        invalidInput: {
            code: 1,
            name: 'invalidInput',
            msg: 'Cannot convert provided input to prefiex hex string',
        },
        invalidDesiredType: {
            code: 2,
            name: 'invalidDesiredType',
            msg: 'Desired type is not supported',
        },
    },
};
