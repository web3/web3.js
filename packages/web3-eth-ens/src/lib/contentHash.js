/*
  Adapted from ensdomains/ui
  Permalink: https://github.com/ensdomains/ui/blob/3e62e440b53466eeec9dd1c63d73924eefbd88c1/src/utils/contents.js#L1-L85
*/

var contentHash = require('content-hash');

function decode(encoded) {
  var decoded = null;
  var protocolType = null;
  var error = null;

  if (encoded && encoded.error) {
    return {
      protocolType: null,
      decoded: encoded.error
    };
  }
  if (encoded) {
    try {
      decoded = contentHash.decode(encoded);
      var codec = contentHash.getCodec(encoded);
      if (codec === 'ipfs-ns') {
        protocolType = 'ipfs';
      } else if (codec === 'swarm-ns') {
        protocolType = 'bzz';
      } else if (codec === 'onion') {
        protocolType = 'onion';
      } else if (codec === 'onion3') {
        protocolType = 'onion3';
      } else {
        decoded = encoded;
      }
    } catch (e) {
      error = e.message;
    }
  }
  return {
    protocolType: protocolType,
    decoded: decoded,
    error: error
  };
}

function encode(text) {
  var content, contentType;
  var encoded = false;
  if (!!text) {
    var matched = text.match(/^(ipfs|bzz|onion|onion3):\/\/(.*)/) || text.match(/\/(ipfs)\/(.*)/);
    if (matched) {
      contentType = matched[1];
      content = matched[2];
    }

    try {
      if (contentType === 'ipfs') {
        if(content.length >= 4) {
          encoded = '0x' + contentHash.fromIpfs(content);
        }
      } else if (contentType === 'bzz') {
        if(content.length >= 4) {
          encoded = '0x' + contentHash.fromSwarm(content);
        }
      } else if (contentType === 'onion') {
        if(content.length === 16) {
          encoded = '0x' + contentHash.encode('onion', content);
        }
      } else if (contentType === 'onion3') {
        if(content.length === 56) {
          encoded = '0x' + contentHash.encode('onion3', content);
        }
      } else {
        throw new Error('Could not encode content hash: unsupported content type');
      }
    } catch (err) {
      throw err;
    }
  }
  return encoded;
}

module.exports = {
  decode: decode,
  encode: encode
};
