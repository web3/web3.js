
// Scroll to the bottom to see how the transfer example can be triggered

// dotenv is an external dependency and would need to be installed for your project
// e.g. npm i -s dotenv
require('dotenv').config() // this ensures process.env. ... contains your .env file configuration values

const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.PROVIDER_URL));


async function signAndSend(transactionObject, senderPrivateKey) {

    const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, senderPrivateKey)

    web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
        .on('transactionHash', (hash) => {
            console.log(hash);
        })
        .on('receipt', (receipt) => {
            console.log(receipt);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
            console.log(confirmationNumber);
            console.log(receipt);
        })
        .on('error', console.error)

}


async function getTransactionObject(from, to, value) {

    const txCount = await web3.eth.getTransactionCount(from, "pending")
    const gasPrice = await web3.eth.getGasPrice()
    
    return {
        nonce: web3.utils.numberToHex(txCount),
        gasLimit: web3.utils.numberToHex(33000),
        gasPrice: web3.utils.toHex(gasPrice),
        from,
        to,
        value,
        chainId: '0x1',
    }

}


async function triggerTransferExample() {

    const amountInEtherToBeSent = 0.01 
    const amountInWeiToBeSent = convertEtherToWEI(amountInEtherToBeSent)
    
    const transactionObject = await getTransactionObject(process.env.FROM_WALLET_ADDRESS, process.env.TO_WALLET_ADDRESS, amountInWeiToBeSent)

    await signAndSend(transactionObject, process.env.SENDER_PRIVATE_KEY)

}

function convertEtherToWEI(amountInEther) {
        return amountInEther * Math.pow(10, 18)
}



triggerTransferExample()
