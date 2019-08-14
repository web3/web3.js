var scryptsy = require('scryptsy');

var scrypt;

var isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
if (isNode) {
    var NODE_MIN_VER_WITH_BUILTIN_SCRYPT = '10.5.0';
    var NODE_MIN_VER_INCOMPAT_SCRYPT_PKG = '12.0.0';
    var semver = require('semver');
    var useNodeBuiltin = isNode && semver.Range('>=' + NODE_MIN_VER_WITH_BUILTIN_SCRYPT).test(process.version);

    var tryScryptPkg = (function() {
        var scryptPkg;
        return function() {
            if (scryptPkg !== undefined) { return scryptPkg; }
            try {
                scryptPkg = require('scrypt');
            } catch (e) {
                if (/was compiled against a different/.test(e.message)) {
                    throw e;
                }
                scryptPkg = null;
            }
            return scryptPkg;
        };
    })();

    var canImprove = function(nodeVer) {
        return 'can improve web3\'s peformance when running Node.js versions older than ' + nodeVer + ' by installing the (deprecated) scrypt package in your project';
    };

    if (useNodeBuiltin) {
        var crypto = require('crypto');
        var fallbackCount = 0;
        scrypt = function(key, salt, N, r, p, dkLen) {
            try {
                return crypto.scryptSync(key, salt, dkLen, {N: N, r: r, p: p});
            } catch (e) {
                if (/scrypt:memory limit exceeded/.test(e.message)) {
                    var scryptPkg = tryScryptPkg();
                    if (scryptPkg) {
                        return scryptPkg.hashSync(key, {N: N, r: r, p: p}, dkLen, salt);
                    }
                    fallbackCount += 1;
                    console.warn(
                        '\x1b[33m%s\x1b[0m',
                        'Memory limit exceeded for Node\'s built-in crypto.scrypt, falling back to scryptsy (times: ' + fallbackCount + '), if this happens frequently you ' + canImprove(NODE_MIN_VER_INCOMPAT_SCRYPT_PKG)
                    );
                    return scryptsy(key, salt, N, r, p, dkLen);
                }
                throw e;
            }
        };
    } else {
        var scryptPkg = tryScryptPkg();
        if (scryptPkg) {
            scrypt = function(key, salt, N, r, p, dkLen) {
                return scryptPkg.hashSync(key, {N: N, r: r, p: p}, dkLen, salt);
            };
        } else {
            console.warn(
                '\x1b[33m%s\x1b[0m',
                'You ' + canImprove(NODE_MIN_VER_WITH_BUILTIN_SCRYPT)
            );
        }
    }
}

scrypt = scrypt || scryptsy;

module.exports = scrypt;
