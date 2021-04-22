import { ProviderOptions } from '../types'

export default class Web3ProviderBase {
  providerString = ''
  protectProvider = false
  connected = false
  supportsSubscriptions = false

  constructor(options: ProviderOptions) {
    this.providerString = options.providerString
    this.protectProvider = options.protectProvider
    this.supportsSubscriptions = options.supportsSubscriptions
  }

  setProvider(providerString: string) {
    try {
      if (this.protectProvider) throw Error('Provider is protected')
      this.providerString = providerString
    } catch (error) {
      throw Error(`Error setting provider: ${error.message}`)
    }
  }
}
