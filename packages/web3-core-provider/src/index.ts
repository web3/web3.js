import { Web3Client, IWeb3Provider } from 'web3-core-types/lib/types';
import Web3ProviderHttp from 'web3-providers-http';

import { ClientProtocol } from './types';

export default function initWeb3Provider(web3Client: Web3Client): IWeb3Provider {
    switch (detectClientProtocol(web3Client)) {
        case ClientProtocol.Eip1193:
            // TODO
            throw Error('Provider protocol not implemented');
        case ClientProtocol.HTTP:
            return new Web3ProviderHttp((web3Client as string));
        case ClientProtocol.WS:
            // TODO
            throw Error('Provider protocol not implemented');
        case ClientProtocol.IPC:
            // TODO
            throw Error('Provider protocol not implemented');
        default:
            throw Error('Provider protocol not supported');
    }
}

function detectClientProtocol(web3Client: Web3Client): ClientProtocol {
    try {
        if (typeof web3Client === 'object' && web3Client.request !== undefined) {
            return ClientProtocol.Eip1193;
        } else if (typeof web3Client === 'string' && /^http(s)?:\/\//i.test(web3Client)) {
            return ClientProtocol.HTTP;
        } else if (typeof web3Client === 'string' && /^ws(s)?:\/\//i.test(web3Client)) {
            return ClientProtocol.WS;
        } else if (typeof web3Client === 'string' && /^ipc:\/\//i.test(web3Client)) {
            return ClientProtocol.IPC;
        }
        return ClientProtocol.UNKNOWN;
    } catch (error) {
        throw Error(`Error detecting client protocol: ${error.message}`);
    }
}
