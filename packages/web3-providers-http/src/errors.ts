import { Web3Error, Web3PackageErrorConfig } from 'web3-core-logger/src/types';
import packageVersion from './_version';

export enum Web3ProvidersHttpErrorNames {
    invalidClientUrl = 'invalidClientUrl',
    noHttpClient = 'noHttpClient',
    connectionRefused = 'connectionRefused',
}

interface Web3ProvidersHttpErrorsConfig extends Web3PackageErrorConfig {
    errors: Record<Web3ProvidersHttpErrorNames, Web3Error>;
}

export const Web3ProvidersHttpErrorsConfig: Web3ProvidersHttpErrorsConfig = {
    packageName: 'web3-providers-http',
    packageVersion,
    errors: {
        invalidClientUrl: {
            name: 'invalidClientUrl',
            msg: 'Provided web3Client is an invalid HTTP(S) URL',
        },
        noHttpClient: {
            name: 'noHttpClient',
            msg: 'No HTTP client has be initialized',
        },
        connectionRefused: {
            name: 'connectionRefused',
            msg: 'Unable to make connection with HTTP client',
        },
    },
};
