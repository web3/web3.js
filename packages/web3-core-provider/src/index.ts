import {
    Web3Client,
    Eip1193Provider,
    IWeb3Provider,
} from 'web3-core-types/lib/types';
import Web3ProvidersHttp from 'web3-providers-http';
import Web3ProvidersEip1193 from 'web3-providers-eip1193';
import Web3CoreLogger from 'web3-core-logger';
import Web3ProviderWS from 'web3-providers-ws';

import {
    Web3CoreProviderErrorsConfig,
    Web3CoreProviderErrorNames,
} from './errors';
import { ClientProtocol } from './types';

const web3CoreLogger = new Web3CoreLogger(Web3CoreProviderErrorsConfig);

/**
 * Detects protocol for provided {web3Client}, and instantiates
 * corresponding provider package
 *
 * @param web3Client Client passed to provider package for instantiation
 * @returns void
 */
export default function initWeb3Provider(
    web3Client: Web3Client
): IWeb3Provider | Eip1193Provider {
    try {
        switch (detectClientProtocol(web3Client)) {
            case ClientProtocol.Eip1193:
                return new Web3ProvidersEip1193(web3Client as Eip1193Provider);
            case ClientProtocol.HTTP:
                return new Web3ProvidersHttp(web3Client as string);
            case ClientProtocol.WS:
                return new Web3ProviderWS(web3Client as string);
            case ClientProtocol.IPC:
                // TODO
                throw web3CoreLogger.makeError(
                    Web3CoreProviderErrorNames.protocolNotImplemented,
                    {
                        params: { web3Client },
                    }
                );
            default:
                throw web3CoreLogger.makeError(
                    Web3CoreProviderErrorNames.protocolNotSupported,
                    {
                        params: { web3Client },
                    }
                );
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Detects protocol of provided client
 *
 * @param web3Client Client to be used for provider instantiation
 * @returns ClientProtocol enum value
 */
function detectClientProtocol(web3Client: Web3Client): ClientProtocol {
    try {
        if (
            typeof web3Client === 'object' &&
            web3Client.request !== undefined
        ) {
            return ClientProtocol.Eip1193;
        } else if (
            typeof web3Client === 'string' &&
            /^http(s)?:\/\//i.test(web3Client)
        ) {
            return ClientProtocol.HTTP;
        } else if (
            typeof web3Client === 'string' &&
            /^ws(s)?:\/\//i.test(web3Client)
        ) {
            return ClientProtocol.WS;
        } else if (
            typeof web3Client === 'string' &&
            /^ipc:\/\//i.test(web3Client)
        ) {
            return ClientProtocol.IPC;
        }
        return ClientProtocol.UNKNOWN;
    } catch (error) {
        throw error;
    }
}
