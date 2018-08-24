/**
 * @param {Object} provider
 * @constructor
 */
function ConnectionModel(provider) {
    this.provider = provider;
    this.givenProvider = null;
    this.defaultBlock = null;
}

/**
 * Defines accessors for defaultAccount
 */
Object.defineProperty(Eth, 'defaultAccount', {
    get: function () {
        return this.defaultAccount;
    },
    set: function (val) {
        if (val) {
            this.defaultAccount = utils.toChecksumAddress(formatter.inputAddressFormatter(val));
        }
    },
    enumerable: true
});

ConnectionModel.prototype.getNetworkType = function () {
    // return network type (main, ropsten, kovan etc.)
};
