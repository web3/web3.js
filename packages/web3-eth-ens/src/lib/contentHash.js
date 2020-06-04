/*
Adapted from ensdomains/ui
https://github.com/ensdomains/ui/blob/3e62e440b53466eeec9dd1c63d73924eefbd88c1/src/utils/contents.js#L1-L85

BSD 2-Clause License

Copyright (c) 2019, Ethereum Name Service
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
