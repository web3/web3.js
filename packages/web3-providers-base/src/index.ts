import { ProviderOptions } from '../types';

export default class Web3ProviderBase {
  private _providerString: string

  private readonly _protectProvider: boolean

  private readonly _supportsSubscriptions: boolean

  constructor(options: ProviderOptions) {
    this._providerString = options.providerString;
    this._protectProvider = options.protectProvider;
    this._supportsSubscriptions = options.supportsSubscriptions;
  }

  get providerString() {
    return this._providerString;
  }

  set providerString(providerString: string) {
    if (!this._protectProvider) this._providerString = providerString;
  }

  get protectProvider() {
    return this._protectProvider;
  }

  get supportsSubscriptions() {
    return this._supportsSubscriptions;
  }
}
