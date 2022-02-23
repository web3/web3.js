const { AccountCreateTransaction } = require("@hashgraph/sdk");

const createNewAccountId = function(newAccountPrivateKey, cb) {
    var _this = this;

    console.log({ _this, newAccountPrivateKey });
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    // Create the transaction
    const tx = new AccountCreateTransaction()
        .setKey(newAccountPublicKey);

    _this.currentProvider.send(tx, (error, response) => {
        if (error) {
            throw error;
        }

        _this.currentProvider.getReceipt(response, (error, response) => {
            if (error) {
                throw error;
            }

            cb(response)
        });
    });
};

module.exports = createNewAccountId;
