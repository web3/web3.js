const { Client } = require("@hashgraph/sdk");

const createClient = function(accountId, privateKey) {
    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);

    return client;
};

module.exports = createClient;
