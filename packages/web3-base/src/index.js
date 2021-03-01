import Methods from './method';
import { Manager, BatchManager } from 'web3-core-requestmanager';
// default for formatters maybe think later of what kind of format checks need to be done
const inout = (a) => { return a; }

export default class Base {
  constructor ({ url, provider, net, jsonMethods }) {
    // create request manager
    this._requestManager = new Manager({url, provider, net});


    // add givenProvider
    this.givenProvider = Manager.givenProvider;
    this.providers = Manager.providers;

    this._provider = this._requestManager.provider;

    // attach batch request creation
    this.BatchRequest = BatchManager.bind(null, this._requestManager);
    // create and attach json api methods
    jsonMethods.forEach(({name, call, inputFormatter, outputFormatter}) => {
      this[name] = this._methodBase.bind(this, call, inputFormatter, outputFormatter)
    })
  }

  /***
    * @returns true
    * @param {string||object} provider
    * @param {net.Socket} net
  */
  setProvider (provider, net) {
    this._requestManager.setProvider(provider, net);
    this._provider = this._requestManager.provider;
    return true;
  }

  /***
    * Adds the default providers from the RequestManager class
  */
  addProviders () {
    this.givenProvider = Manager.givenProvider;
    this.providers = Manager.providers;
  }

  /***
    * sets the current provider
    * @param {Object||string} newProvider
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
  /***
    * used in constructor to create the basic api methods
    * @param {Object||string} newProvider
  */

  async _methodBase (call, inputFormatter = inout, outputFormatter = inout, ...params) {
    let cb;
    // get the index for last item
    const last = params.length - 1;
    // if it's the call back remove from params
    if (typeof params[last] === 'function') cb = params.pop(last);
    // format the params
    try {
      const formattedParams = inputFormatter(params);
      const result = await this._requestManager.send({ call, formattedParams });
      return outputFormatter(result)
    } catch (e) {
      if (cb) {
        cb(e);
      } else {
        throw e;
      }
    }
  }

  // Class methods

  static get providers () {
    return Manager.providers
  }

  static get givenProvider () {
    return Manager.givenProvider
  }
}
