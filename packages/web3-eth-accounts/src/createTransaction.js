const { AccountUpdateTransaction } = require("@hashgraph/sdk");

const createTransaction = function(accountId, privateKey, client) {
    // Create the transaction
    return new AccountUpdateTransaction()
        .setAccountId(accountId)
        .setKey(privateKey.publicKey)
        .freezeWith(client);
};

module.exports = createTransaction;
