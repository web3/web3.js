import { Manager, BatchManager } from 'web3-core-requestmanager';

export default class Base {
  constructor ({ url, provider, net }) {
    // create request manager
    this._requestManager = new Manager({url, provider, net});


    // add givenProvider
    this.givenProvider = Manager.givenProvider;
    this.providers = Manager.providers;

    this._provider = this._requestManager.provider;

    // attach batch request creation
    this.BatchRequest = BatchManager.bind(null, this._requestManager);
  }

/***
  returns true
  params:
  provider: string||object
  net?: network connection object
*/
  setProvider (provider, net) {
    this._requestManager.setProvider(provider, net);
    this._provider = this._requestManager.provider;
    return true;
  }

/***
  Adds the default providers from the RequestManager class
*/
  addProviders () {
    this.givenProvider = Manager.givenProvider;
    this.providers = Manager.providers;
  }

/***
  sets the current provider
*/
  set curentProvider (newProvider) {
    return this.setProvider(newProvider);
  }

/***
  returns the currently set provider
*/
  get curentProvider () {
    return this._provider;
  }

  // Class methods

  static get providers () {
    return Manager.providers
  }

  static get givenProvider () {
    return Manager.givenProvider
  }
}
