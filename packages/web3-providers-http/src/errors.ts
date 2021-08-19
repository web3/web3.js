import { Web3Error, Web3PackageErrorConfig } from 'web3-core-logger/src/types';
import packageVersion from './_version';

export enum Web3ProvidersHttpErrorNames {
    invalidClientUrl = 'invalidClientUrl',
}

interface Web3ProvidersHttpErrorsConfig extends Web3PackageErrorConfig {
    errors: Record<Web3ProvidersHttpErrorNames, Web3Error>;
}

export const Web3ProvidersHttpErrorsConfig: Web3ProvidersHttpErrorsConfig = {
    packageName: 'web3-providers-http',
    packageVersion,
    errors: {
        invalidClientUrl: {
            code: 1,
            name: 'invalidClientUrl',
        },
    },
};
