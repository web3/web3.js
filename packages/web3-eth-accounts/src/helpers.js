var RLP = require("eth-lib/lib/rlp"); // jshint ignore:line

function decodeUnknownTxType(rawTx, txOptions = {}) {
    const stripped = rawTx.slice(2);
    const data = Buffer.from(stripped, "hex")
    if (data[0] <= 0x7f) {
        // It is an EIP-2718 Typed Transaction
        return {
            values: RLP.decode("0x" + stripped.slice(2)),
            isTyped: true
        };
    } else {
        return {
            values: RLP.decode(rawTx),
            isTyped: false
        };
    }
}

module.exports = {
    decodeUnknownTxType,
}