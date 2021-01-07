
require("dotenv").config(); // this ensures process.env. ... contains your .env file configuration values

const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.PROVIDER_URL));

const { priceFeedAbi } = require('./contract-abis.json');

async function getPrice(assetName: string) {
    
    const priceFeedAddress = '0x922018674c12a7f0d394ebeef9b58f186cde13c1';
    const priceFeed = new web3.eth.Contract(priceFeedAbi, priceFeedAddress);
    let priceInUsd = await priceFeed.methods.price(assetName).call();
    
    console.log(`According to the price feed address: The price of ${assetName} is about ${priceInUsd} USD.`)
}

getPrice('ETH')
