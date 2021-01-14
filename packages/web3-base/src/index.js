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

  setRequestManager (manager) {
    this._requestManager = manager;
    this._provider = manager.provider;
  }

  set curentProvider (newProvider) {
    return this.setProvider(newProvider);
  }

  get curentProvider () {
    return this._provider;
  }

  static get providers () {
    return Manager.providers
  }

  static get givenProvider () {
    return Manager.givenProvider
  }

  setProvider (provider, net) {
    this._requestManager.setProvider(provider, net);
    this._provider = this._requestManager.provider;
    return true;
  }

  addProviders () {
    this.givenProvider = Manager.givenProvider;
    this.providers = Manager.providers;
  }

  static addProviders (pkg) {
    pkg.givenProvider = Manager.givenProvider;
    pkg.providers = Manager.providers;
  }

}
