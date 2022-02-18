const { AccountCreateTransaction } = require("@hashgraph/sdk");

const createNewAccountId = async function(newAccountPrivateKey, client) {
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    // Create the transaction
    const newAccountTransactionResponse = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .execute(client);

    // Get the new account ID
    const getReceipt = await newAccountTransactionResponse.getReceipt(client);
    return getReceipt.accountId;
};

module.exports = createNewAccountId;
