var {TransactionFactory, Transaction, AccessListEIP2930Transaction} = require('@ethereumjs/tx');
var {rlp} = require("ethereumjs-util");
var Common = require("@ethereumjs/common").default;

function decodeUnknownTxType(rawTx, txOptions = {}) {
    const stripped = rawTx.slice(2);
    const data = Buffer.from(stripped, "hex")
    if (data[0] <= 0x7f) { //if its a perfectly fine typed tx
        // It is an EIP-2718 Typed Transaction
        switch (data[0]) {
            case 1: //EIP2930
                const [chainId] = rlp.decode(data.slice(1))
                const txOptions = new Common({ 
                    chain: chainId, 
                    eips: [2930],
                    hardfork: "berlin",
                    chain: {
                        networkId: chainId,
                        genesis: {},
                        hardforks: ["berlin"],
                        bootstrapNodes: []
                    }
                })
                return AccessListEIP2930Transaction.fromSerializedTx(data, txOptions);
            default:
                throw new Error(`TypedTransaction with ID ${data[0]} unknown`);
        }
    } else {
        return Transaction.fromSerializedTx(data);
    }
}

module.exports = {
    decodeUnknownTxType,
}