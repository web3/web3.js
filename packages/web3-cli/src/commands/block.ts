import {Command, flags} from '@oclif/command'

import {initWeb3} from '../helpers/initWeb3'
import {initETH2Beaconchain} from '../helpers/initETH2Beaconchain'

export default class Block extends Command {
  static description = 'describe the command here'

  static flags = {
    chain: flags.integer({
      description: 'Version of Ethereum chain e.g. ETH1 is default while ETH2 = 2',
      default: 1
    }),
    help: flags.help({char: 'h'}),
  }

  static args = [
    {name: 'provider', description: 'HTTP endpoint for Ethereum node'},
    {name: 'blockId', description: 'Block identifier'}
  ]

  async getBlock(chainId: number, provider: string, blockId: string) {
    if (chainId === 1) {
      const web3 = initWeb3(provider)
      return await web3.eth.getBlock(blockId)
    }

    const eth2Beaconchain = initETH2Beaconchain(provider)
    return await eth2Beaconchain.getBlock({blockId: blockId}) 
  }

  async run() {
    const {args, flags} = this.parse(Block)
    const result = await this.getBlock(flags.chain, args.provider, args.blockId)
    console.log(JSON.stringify(result, undefined, 2))
  }
}
