const cryp = typeof global === 'undefined' ? require('crypto-browserify') : require('crypto');

const scryptSync (key, salt, dklen, options) => {
  var version = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
  return version >= 10 ? cryp.scryptSync(key, salt, dklen, {N: options.N, r: options.r, p: options.p}) : require('scrypt.js')(key, salt, options.N, options.r, options.p, dklen);
}

module.exports = scryptSync;
