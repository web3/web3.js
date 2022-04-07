var isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
var isRN = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

var _btoa = null;
var helpers = null;
if (isNode || isRN) {
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
    _btoa = btoa.bind(typeof globalThis === 'object' ? globalThis : self);
    helpers = function(url) {
        return new URL(url);
    };
}

module.exports = {
    parseURL: helpers,
    btoa: _btoa
};
