/**
 * @param {Object} provider
 * @constructor
 */
function ConnectionModel(provider) {
    this.provider = provider; //TODO: add provider resolver
    this.givenProvider = null;
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

/**
 * Defines accessors for defaultBlock
 */
Object.defineProperty(Eth, 'defaultBlock', {
    get: function () {
        return this.defaultBlock || 'latest';
    },
    set: function (val) {
        this.defaultBlock = val;
    },
    enumerable: true
});

/**
 * Determines to which network web3 is currently connected
 *
 * @method getNetworkType
 *
 * @param {Function} callback
 *
 * @callback callback(error, result)
 * @returns {Promise<string|Error>}
 */
ConnectionModel.prototype.getNetworkType = function (callback) {
    var self = this, id;

    return this.getId().then(function (givenId) {
        id = givenId;

        return self.getBlock(0);
    }).then(function (genesis) {
        var returnValue = 'private';
        switch (genesis) {
            case genesis.hash === '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3' && id === 1:
                returnValue = 'main';
                break;
            case genesis.hash === '0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303' && id === 2:
                returnValue = 'morden';
                break;
            case genesis.hash === '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d' && id === 3:
                returnValue = 'ropsten';
                break;
            case genesis.hash === '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177' && id === 4:
                returnValue = 'rinkeby';
                break;
            case genesis.hash === '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9' && id === 42:
                returnValue = 'kovan';
                break;
        }

        if (_.isFunction(callback)) {
            callback(null, returnValue);
        }

        return returnValue;
    }).catch(function (err) {
        if (_.isFunction(callback)) {
            callback(err);

            return;
        }

        throw err;
    });
};

ConnectionModel.prototype.getId = function () {
    // new Method({
    //     name: 'getId',
    //     call: 'net_version',
    //     params: 0,
    //     outputFormatter: utils.hexToNumber
    // })
};

ConnectionModel.prototype.isListening = function () {
    // new Method({
    //     name: 'isListening',
    //     call: 'net_listening',
    //     params: 0
    // })
};

ConnectionModel.prototype.getPeerCount = function () {
    // new Method({
    //     name: 'getPeerCount',
    //     call: 'net_peerCount',
    //     params: 0,
    //     outputFormatter: utils.hexToNumber
    // })
};

ConnectionModel.prototype.getBlock = function (blockNumber) {
    // new Method({
    //     name: 'getBlock',
    //     call: blockCall,
    //     params: 2,
    //     inputFormatter: [formatter.inputBlockNumberFormatter, function (val) {
    //         return !!val;
    //     }],
    //     outputFormatter: formatter.outputBlockFormatter
    // })
};

/**
 * Returns the network methods for the public API
 *
 * @returns {Object}
 */
ConnectionModel.prototype.getNetworkMethodsAsObject = function () {
    return {
        getId: this.getId.bind(this),
        isListening: this.isListening.bind(this),
        getPeerCount: this.getPeerCount.bind(this),
        getNetworkType: this.getNetworkType.bind(this)
    }
};
