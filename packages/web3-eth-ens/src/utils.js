var { concat, hexlify } = require("@ethersproject/bytes");
var { nameprep, toUtf8Bytes } = require("@ethersproject/strings");

function dnsEncode(name) {
    return hexlify(concat(name.split(".").map((comp) => {
        // We jam in an _ prefix to fill in with the length later
        // Note: Nameprep throws if the component is over 63 bytes
        const bytes = toUtf8Bytes("_" + nameprep(comp));
        bytes[0] = bytes.length - 1;
        return bytes;
    }))) + "00";
}

module.exports = {
    dnsEncode
};
