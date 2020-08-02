var isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

var _btoa = null;
var helpers = null;
if (isNode) {
    _btoa = function(str) {
        return Buffer.from(str).toString('base64');
    };
    var url = require('url');
    if (url.URL) {
        // Use the new Node 6+ API for parsing URLs that supports username/password
        var newURL = url.URL;
        helpers = function(url) {
            return new newURL(url);
        };
    } else {
        // Web3 supports Node.js 5, so fall back to the legacy URL API if necessary
        helpers = require('url').parse;
    }
} else {
    _btoa = btoa.bind(window);
    helpers = function(url) {
        var parsedUrl = new URL(url);
        // web3 uses URL's username and password on websocket provider, which are not
        // implemented by react-native, instead of throwing a `not implemented` error
        // by default, simply return undefined
        Object.defineProperty(parsedUrl, 'username', {value:undefined});
        Object.defineProperty(parsedUrl, 'password', {value:undefined});
        return parsedUrl;
    };
}

module.exports = {
    parseURL: helpers,
    btoa: _btoa
};
