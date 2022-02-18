const {
    TopicCreateTransaction,
    TopicMessageQuery,
    TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk");

const sign = async function(data, client) {
    let txResponse = await new TopicCreateTransaction().execute(client);

    //Grab the newly generated topic ID
    let receipt = await txResponse.getReceipt(client);
    let topicId = receipt.topicId;
    console.log('receipt', receipt);

    // Wait 5 seconds between consensus topic creation and subscription creation
    await new Promise((resolve) => setTimeout(resolve, 5000));

    //Create the query
    new TopicMessageQuery().setTopicId(topicId).subscribe(client, null, (message) => {
        console.log("===================");
        console.log('message', message);
        console.log("===================");
        let messageAsString = Buffer.from(message.contents, "utf8").toString();
        console.log(`${message.consensusTimestamp.toDate()} Received: ${messageAsString}`);
    });

    // Send one message
    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: topicId,
        message: data,
    }).execute(client);

    console.log("===================");
    console.log('sendResponse', sendResponse);
    console.log("===================");
    const getReceipt = await sendResponse.getReceipt(client);

    //Get the status of the transaction
    const transactionStatus = getReceipt.status;
    console.log("===================");
    console.log("getReceipt", getReceipt);
    console.log("===================");
    console.log("The message transaction status" + transactionStatus);

    return {
        message: data,
        // messageHash: hash,
        // v: vrs[0],
        // r: vrs[1],
        // s: vrs[2],
        // signature: signature
    };
};

module.exports = sign;
