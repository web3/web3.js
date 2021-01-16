import {Command, flags} from '@oclif/command'

import {initETH2Beaconchain} from '../helpers/initETH2Beaconchain'

export default class ValidatorInfo extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    stateId: flags.string({
      description: 'State identifier e.g. head, genesis, finalized',
      default: 'head'
    })
  }

  static args = [
    {name: 'provider', description: 'HTTP endpoint for Ethereum node'},
    {name: 'validatorId', description: 'Validator hex encoded public key or registry index'}
  ]

  async getInfo(provider: string, validatorId: string, stateId: string) {
    const eth2Beaconchain = initETH2Beaconchain(provider)
    return await eth2Beaconchain.getValidatorById({stateId, validatorId})
  }

  async run() {
    const {args, flags} = this.parse(ValidatorInfo)
    const result = await this.getInfo(args.provider, args.validatorId, flags.stateId)
    console.log(JSON.stringify(result, undefined, 2))
  }
}
