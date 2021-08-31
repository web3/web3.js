import { Web3Error, Web3PackageErrorConfig } from 'web3-core-logger/src/types';
import packageVersion from './_version';

export enum Web3ProvidersEip1193ErrorNames {
    invalidClient = 'invalidClient',
    noClient = 'noClient',
}

interface Web3ProvidersEip1193ErrorsConfig extends Web3PackageErrorConfig {
    errors: Record<Web3ProvidersEip1193ErrorNames, Web3Error>;
}

export const Web3ProvidersEip1193ErrorsConfig: Web3ProvidersEip1193ErrorsConfig =
    {
        packageName: 'web3-providers-eip1193',
        packageVersion,
        errors: {
            invalidClient: {
                name: 'invalidClient',
                msg: 'Provided web3Client is an invalid EIP-1193 client',
            },
            noClient: {
                name: 'noClient',
                msg: 'No client has be initialized',
            },
        },
    };
