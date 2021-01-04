require('dotenv').config() // this ensures process.env. ... contains your .env file configuration values

const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`));

export const transfer = async () => {

    const gasPrice = await web3.eth.getGasPrice()

    // ensure your .env file contains SENDER_WALLET=<sender_wallet_address>
    const nonce = await web3.eth.getTransactionCount(process.env.SENDER_WALLET, 'pending')

    let txParams = {
        nonce: web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(web3.utils.toHex(33000)),
        gasPrice: web3.utils.toHex(gasPrice),
        from: process.env.SENDER_WALLET, // ensure your .env file contains SENDER_WALLET=<sender_wallet_address>
        to: process.env.TARGET_WALLET, // ensure your .env file contains TARGET_WALLET=<recipient_wallet_address>
        value: 0.07 * 1000000000000000000, // this would e.g. transfer 0.07 Ether
        chainId: web3.utils.toHex(1),
    }
    let tx = new Tx(txParams);
    
    // ensure your .env file contains SENDER_WALLET_PRIVATE_KEY=<sender_wallet_private_key>
    // always ensure not to publish your .env file to github --> .gitignore it
    tx.sign(Buffer.from(process.env.SENDER_WALLET_PRIVATE_KEY, 'hex'));
    tx = "0x" + tx.serialize().toString('hex')
    
    web3.eth.sendSignedTransaction(tx)
        .on('transactionHash', (hash) => {
            console.log(hash);
        })
        .on('receipt', (receipt) => {
            console.log(receipt);
            return "receipt"
        })
        .on('confirmation', (confirmationNumber, receipt) => {
            console.log(confirmationNumber);
            console.log(receipt);
        })
        .on('error', console.error);

}

transfer()
