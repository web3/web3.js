"use strict";
exports.__esModule = true;
exports.ETH2Core = void 0;
var axios_1 = require("axios");
var ETH2Core = /** @class */ (function () {
    function ETH2Core(packageName, provider, opts) {
        if (opts === void 0) { opts = {}; }
        this.name = packageName;
        this.setProvider(provider);
        this.protectProvider = opts.protectProvider || false;
    }
    ETH2Core.prototype.setProvider = function (provider) {
        try {
            if (!provider || typeof provider !== 'string' || !/^http(s)?:\/\//i.test(provider)) {
                throw new Error("Invalid HTTP(S) provider: " + provider);
            }
            this._httpClient = ETH2Core.createHttpClient(provider);
            this.provider = provider;
        }
        catch (error) {
            throw new Error("Failed to set provider: " + error);
        }
    };
    ETH2Core.createHttpClient = function (baseUrl) {
        try {
            return axios_1["default"].create({
                baseURL: baseUrl
            });
        }
        catch (error) {
            throw new Error("Failed to create HTTP client: " + error);
        }
    };
    return ETH2Core;
}());
exports.ETH2Core = ETH2Core;
// class ETH2Node {
// }
// class ETH2Validator {
// }
// class ETH2 {
// }
