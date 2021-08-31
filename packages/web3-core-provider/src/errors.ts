import { Web3Error, Web3PackageErrorConfig } from 'web3-core-logger/src/types';
import packageVersion from './_version';

export enum Web3CoreProviderErrorNames {
    protocolNotImplemented = 'protocolNotImplemented',
    protocolNotSupported = 'protocolNotSupported',
}

interface Web3CoreProviderErrorsConfig extends Web3PackageErrorConfig {
    errors: Record<Web3CoreProviderErrorNames, Web3Error>;
}

export const Web3CoreProviderErrorsConfig: Web3CoreProviderErrorsConfig = {
    packageName: 'web3-core-provider',
    packageVersion,
    errors: {
        protocolNotImplemented: {
            name: 'protocolNotImplemented',
            msg: 'Detected protocol of provided web3Client is not implemented',
        },
        protocolNotSupported: {
            name: 'protocolNotSupported',
            msg: 'Detected protocol of provided web3Client is not supported',
        },
    },
};
