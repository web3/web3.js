const Web3 = require('web3')
export const initWeb3 = (provider: string) => new Web3(provider)
