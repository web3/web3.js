// TODO Fix eslint issues
// eslint-disable-next-line import/no-unresolved, import/extensions
import { ProviderOptions } from '../types';

export default class Web3ProviderBase {
  providerString

  protectProvider

  supportsSubscriptions

  connected = false

  constructor(options: ProviderOptions) {
    this.providerString = options.providerString || '';
    this.protectProvider = options.protectProvider || false;
    this.supportsSubscriptions = options.supportsSubscriptions || false;
  }

  setProvider(providerString: string) {
    try {
      if (this.providerString !== ''
        && this.protectProvider) throw Error('Provider is protected');
      this.providerString = providerString;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
