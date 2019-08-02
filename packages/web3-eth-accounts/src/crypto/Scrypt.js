import scryptsy from 'scryptsy';

let scrypt;

const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
if (isNode) {
    const NODE_MIN_VER_WITH_BUILTIN_SCRYPT = '10.5.0';
    const NODE_MIN_VER_INCOMPAT_SCRYPT_PKG = '12.0.0';
    const semver = require('semver');
    const useNodeBuiltin = isNode && semver.Range('>=' + NODE_MIN_VER_WITH_BUILTIN_SCRYPT).test(process.version);

    const tryScryptPackage = (function() {
        let scryptPackage;
        return function() {
            if (scryptPackage !== undefined) {
                return scryptPackage;
            }
            try {
                scryptPackage = require('scrypt');
            } catch (error) {
                if (/was compiled against a different/.test(error.message)) {
                    throw error;
                }
                scryptPackage = null;
            }
            return scryptPackage;
        };
    })();

    const canImprove = function(nodeVer) {
        return `can improve web3's peformance when running Node.js versions older than ${nodeVer} by installing the (deprecated) scrypt package in your project`;
    };

    if (useNodeBuiltin) {
        const crypto = require('crypto');
        let fallbackCount = 0;
        scrypt = function(key, salt, N, r, p, dkLength) {
            try {
                return crypto.scryptSync(key, salt, dkLength, {N, r, p});
            } catch (error) {
                if (/scrypt:memory limit exceeded/.test(error.message)) {
                    const scryptPackage = tryScryptPackage();
                    if (scryptPackage) {
                        return scryptPackage.hashSync(key, {N: N, r: r, p: p}, dkLength, salt);
                    }
                    fallbackCount += 1;
                    console.warn(
                        '\u001B[33m%s\u001B[0m',
                        `Memory limit exceeded for Node's built-in crypto.scrypt, falling back to scryptsy (times: ${fallbackCount}), if this happens frequently you ${canImprove(
                            NODE_MIN_VER_INCOMPAT_SCRYPT_PKG
                        )}`
                    );
                    return scryptsy(key, salt, N, r, p, dkLength);
                }
                throw error;
            }
        };
    } else {
        const scryptPackage = tryScryptPackage();
        if (scryptPackage) {
            scrypt = function(key, salt, N, r, p, dkLength) {
                return scryptPackage.hashSync(key, {N, r, p}, dkLength, salt);
            };
        } else {
            console.warn('\u001B[33m%s\u001B[0m', `You ${canImprove(NODE_MIN_VER_WITH_BUILTIN_SCRYPT)}`);
        }
    }
}

scrypt = scrypt || scryptsy;

export default scrypt;
