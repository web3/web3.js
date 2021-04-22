import Web3ProviderHttp from 'web3-providers-http'
import { ProviderOptions } from 'web3-providers-base/types'

enum ProviderProtocol { UNKNOWN, HTTP, WS, IPC }

export default class Web3RequestManager {
    provider: Web3ProviderHttp | undefined
    providerProtocol: ProviderProtocol = ProviderProtocol.UNKNOWN

    constructor(providerOptions: ProviderOptions) {
        switch (Web3RequestManager.detectProviderProtocol(providerOptions.providerString)) {
            case ProviderProtocol.HTTP:
                this.provider = new Web3ProviderHttp(providerOptions)
                this.providerProtocol = ProviderProtocol.HTTP
                break;
            case ProviderProtocol.WS:
                this.providerProtocol = ProviderProtocol.WS
                // TODO
                break;
            default:
                // TODO figure out if possible to support generic provider
                break;
        }
    }

    static detectProviderProtocol(providerString: string): ProviderProtocol {
        try {
            if (/^http(s)?:\/\//i.test(providerString)) {
                return ProviderProtocol.HTTP
            } else if (/^ws(s)?:\/\//i.test(providerString)) {
                return ProviderProtocol.WS
            } else {
                return ProviderProtocol.UNKNOWN
            }
        } catch (error) {
            throw Error(`Error detecting provider protocol: ${error.message}`)
        }
    }

    // TODO get rid of anys
    async send(options: any): Promise<any> {
        try {
            if (this.provider === undefined) throw Error('No provider initialized')
            return this.provider.send(options)
        } catch (error) {
            throw Error(`Error sending: ${error.message}`)
        }
    }
}