import { Chain, chainsType } from './../types'
import mainnet from './mainnet.json'
import ropsten from './ropsten.json'
import rinkeby from './rinkeby.json'
import kovan from './kovan.json'
import goerli from './goerli.json'
import sepolia from './sepolia.json'

/**
 * @hidden
 */
export function _getInitializedChains(customChains?: Chain[]) {
  const names: any = {
    '1': 'mainnet',
    '3': 'ropsten',
    '4': 'rinkeby',
    '42': 'kovan',
    '5': 'goerli',
    '11155111': 'sepolia',
  }
  const chains: any = {
    mainnet,
    ropsten,
    rinkeby,
    kovan,
    goerli,
    sepolia,
  }
  if (customChains) {
    for (const chain of customChains) {
      const name = chain.name
      names[chain.chainId.toString()] = name
      chains[name] = chain
    }
  }

  chains['names'] = names
  return chains
}

/**
 * @deprecated this constant will be internalized (removed)
 * on next major version update
 */
export const chains: chainsType = _getInitializedChains()
