import scryptsy from 'scryptsy';

let scrypt;

const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
if (isNode) {
    const NODE_MIN_VER_WITH_BUILTIN_SCRYPT = '10.5.0';
    const semver = require('semver');
    const useNodeBuiltin = isNode && semver.Range('>=' + NODE_MIN_VER_WITH_BUILTIN_SCRYPT).test(process.version);

    if (useNodeBuiltin) {
        const crypto = require('crypto');
        scrypt = function(key, salt, N, r, p, dkLength) {
            return crypto.scryptSync(key, salt, dkLength, {N, r, p});
        };
    } else {
        let scryptPackage;
        try {
            scryptPackage = require('scrypt');
            scrypt = function(key, salt, N, r, p, dkLength) {
                return scryptPackage.hashSync(key, {N, r, p}, dkLength, salt);
            };
        } catch (error) {
            console.warn(
                '\u001B[33m%s\u001B[0m',
                `You can improve web3's peformance when running Node.js versions older than ${NODE_MIN_VER_WITH_BUILTIN_SCRYPT} by installing the (deprecated) scrypt package in your project`
            );
        }
    }
}

scrypt = scrypt || scryptsy;

export default scrypt;
