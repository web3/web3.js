
require("dotenv").config(); // this ensures process.env. ... contains your .env file configuration values

const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.PROVIDER_URL));

const { priceFeedAbi } = require('./contract-abis.json');

async function getPrice(assetName) {
    
    const priceFeedAddress = '0x922018674c12a7f0d394ebeef9b58f186cde13c1';
    const priceFeedSmartContract = new web3.eth.Contract(priceFeedAbi, priceFeedAddress);
    let priceInUsd = (await priceFeedSmartContract.methods.price(assetName).call()) / 1000000;
    
    console.log(`According to the price feed address: \nThe price of ${assetName} is about ${priceInUsd} USD.`)
}

getPrice('ETH')
