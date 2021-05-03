import Web3ProviderHttp from 'web3-providers-http';
import { ProviderOptions } from 'web3-providers-base/types';

// TODO Make eslint happy
/* eslint-disable */
enum ProviderProtocol { UNKNOWN, HTTP, WS, IPC }

export default class Web3RequestManager {
    provider: Web3ProviderHttp | undefined

    providerProtocol: ProviderProtocol = ProviderProtocol.UNKNOWN

    constructor(providerOptions: ProviderOptions) {
      switch (Web3RequestManager.detectProviderProtocol(providerOptions.providerUrl)) {
        case ProviderProtocol.HTTP:
          this.provider = new Web3ProviderHttp(providerOptions);
          this.providerProtocol = ProviderProtocol.HTTP;
          break;
        case ProviderProtocol.WS:
          this.providerProtocol = ProviderProtocol.WS;
          // TODO
          throw Error('Provider protocol not implemented')
        case ProviderProtocol.IPC:
          this.providerProtocol = ProviderProtocol.IPC;
          // TODO
          throw Error('Provider protocol not implemented')
        default:
          // TODO figure out if possible to support generic provider
          throw Error('Provider protocol not supported')
      }
    }

    static detectProviderProtocol(providerUrl: string): ProviderProtocol {
      try {
        if (/^http(s)?:\/\//i.test(providerUrl)) {
          return ProviderProtocol.HTTP;
        } else if (/^ws(s)?:\/\//i.test(providerUrl)) {
          return ProviderProtocol.WS;
        } else if (/^ipc:\/\//i.test(providerUrl)) {
          return ProviderProtocol.WS;
        }
        return ProviderProtocol.UNKNOWN;
      } catch (error) {
        throw Error(`Error detecting provider protocol: ${error.message}`);
      }
    }

    // TODO get rid of anys
    async send(options: any): Promise<any> {
      try {
        if (this.provider === undefined) throw Error('No provider initialized');
        return this.provider.send(options);
      } catch (error) {
        throw Error(`Error sending: ${error.message}`);
      }
    }
}
