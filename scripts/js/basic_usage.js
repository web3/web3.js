#!/usr/bin/env node

// This script runs some simple Web3 calls.
// Useful for validating the published version in different OS environments.
const Web3 = require('web3');
const util = require('util');
const log = console.log;

async function delay(secs=0){
  return new Promise(resolve => setTimeout(() => resolve(), secs * 1000))
}

// A workaround for how flaky the infura connection can be...
// Tries to fetch data 10x w/ 1 sec delays. Exits on first success.
async function getBlockWithRetry(web3, provider){
  let i = 0;
  let block;

  while(true){
    await delay(1);

    try {

      block = await web3.eth.getBlock('latest');
      break;

    } catch(err){

      i++;
      if (i === 10){
        if (provider === 'infura') {
          throw new Error('Failed to connect to Infura over websockets after 10 tries');
        } else if (provider === 'linkpool') {
          throw new Error('Failed to connect to LinkPool over websockets after 10 tries');
        }
      }

    }
  }
  return block;
}

async function tryMultipleProviders(infuraProvider) {
  try {
    const web3 = new Web3(infuraProvider);
    const block = await getBlockWithRetry(web3, 'infura');
    return [
      web3,
      block
    ];
  } catch (error) {
    if (infuraProvider.includes("wss")) {
      // Fetched provider from https://medium.com/linkpool/release-of-public-ethereum-rpcs-f5dd57455d2e
      const linkpoolProvider = "wss://main-light.eth.linkpool.io/ws";
      const web3 = new Web3(linkpoolProvider);
      const block = await getBlockWithRetry(web3, 'linkpool');
      return [
        web3,
        block
      ];
    } else {
      // Fetched provider from https://medium.com/linkpool/release-of-public-ethereum-rpcs-f5dd57455d2e
      const linkpoolProvider = "https://main-light.eth.linkpool.io";
      const web3 = new Web3(linkpoolProvider);
      const block = await getBlockWithRetry(web3, 'linkpool');
      return [
        web3,
        block
      ];
    }
  }
}

async function main(){
  let web3;
  let block;

  // Providers
  log();
  log('>>>>>>');
  log('HTTP:MAINNET getBlock');
  log('>>>>>>');

  // Http
  [ web3, block ] = await tryMultipleProviders(process.env.INFURA_HTTP);
  log(util.inspect(block));

  log();
  log('>>>>>>');
  log('WS:MAINNET getBlock');
  log('>>>>>>');

  // WebSockets
  [ web3, block ] = await tryMultipleProviders(process.env.INFURA_WSS);
  web3.currentProvider.disconnect();
  log(util.inspect(block));


  // Accounts
  web3 = new Web3();

  log();
  log('>>>>>>');
  log('eth.accounts.createAccount');
  log('>>>>>>');

  const account = web3.eth.accounts.create();
  log(util.inspect(account));

  log();
  log('>>>>>>');
  log('eth.accounts.hashMessage');
  log('>>>>>>');

  const hash = web3.eth.accounts.hashMessage('Hello World');
  log(util.inspect(hash));
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    log(err);
    process.exit(1)
  });
