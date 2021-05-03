import { ProviderOptions } from '../types';

export default class Web3ProviderBase {
  private _providerString: string

  constructor(options: ProviderOptions) {
    this._providerString = options.providerString;
  }

  get providerString() {
    return this._providerString;
  }

  set providerString(providerString: string) {
    this._providerString = providerString;
  }
}
