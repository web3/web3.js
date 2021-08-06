import { IWeb3Provider } from 'web3-core-types/lib/types';
import Web3ProviderHttp from 'web3-providers-http';

import { ClientProtocol } from './types';

export default function web3Provider(web3Client: string): IWeb3Provider {
    switch (detectClientProtocol(web3Client)) {
        case ClientProtocol.HTTP:
            return new Web3ProviderHttp(web3Client);
        case ClientProtocol.WS:
            // TODO
            throw Error('Provider protocol not implemented');
        case ClientProtocol.IPC:
            // TODO
            throw Error('Provider protocol not implemented');
        default:
            // TODO figure out if possible to support generic provider
            // could be anything supporting EIP1193's request method
            throw Error('Provider protocol not supported');
    }
}

function detectClientProtocol(web3Client: string): ClientProtocol {
    try {
        if (/^http(s)?:\/\//i.test(web3Client)) {
            return ClientProtocol.HTTP;
        } else if (/^ws(s)?:\/\//i.test(web3Client)) {
            return ClientProtocol.WS;
        } else if (/^ipc:\/\//i.test(web3Client)) {
            return ClientProtocol.IPC;
        }
        return ClientProtocol.UNKNOWN;
    } catch (error) {
        throw Error(`Error detecting client protocol: ${error.message}`);
    }
}
