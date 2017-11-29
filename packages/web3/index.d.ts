import * as t from './types.d'

declare class Web3 {
  static providers: t.Providers
  static givenProvider: t.Provider
  static modules: {
    Eth: new (provider: t.Provider) => t.Eth
    Net: new (provider: t.Provider) => t.Net
    Personal: new (provider: t.Provider) => t.Personal
    Shh: new (provider: t.Provider) => t.Shh
    Bzz: new (provider: t.Provider) => t.Bzz
  }
  constructor(provider: t.Provider | string)
  version: string
  BatchRequest: new () => t.BatchRequest
  extend(methods: any): any // TODO
  bzz: t.Bzz
  currentProvider: t.Provider
  eth: t.Eth
  ssh: t.Shh
  givenProvider: t.Provider
  providers: t.Providers
  setProvider(provider: t.Provider): void
  utils: t.Utils

}

export default Web3
