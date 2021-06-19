import { ProviderOptions } from '../types';

export default class Web3ProviderBase {
    private _providerUrl: string;

    constructor(options: ProviderOptions) {
        this._providerUrl = options.providerUrl;
    }

    get providerUrl() {
        return this._providerUrl;
    }

    set providerUrl(providerUrl: string) {
        this._providerUrl = providerUrl;
    }
}
