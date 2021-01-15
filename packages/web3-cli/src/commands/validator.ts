import {Command, flags} from '@oclif/command'
// @ts-ignore
import {ETH2Beacon, IETH2Beacon} from 'web3-eth2-beacon'

export default class Validator extends Command {
  static description = 'Used to get Validator related information from Beacon Chain node'

  static examples = [
    `$ eth2cli validator`,
  ]

  static flags = {
    balance: flags.string({char: 'b', description: 'Get validator balance'}),
    data: flags.boolean({char: 'd', description: 'Logs data as JSON'}),
    help: flags.help({char: 'h'}),
    info: flags.string({char: 'i', description: 'Get validator info'}),
  }

  static args = [
    {name: 'PROVIDER', description: 'HTTP endpoint for ETH2 Beacon Chain node'},
    {name: 'VALIDATOR_ID', description: 'Unique identifier for validator to be queried'}]

  // @ts-ignore
  eth2Beacon: IETH2Beacon | undefined

  checkForRequiredArgs(
    requiredArgs: string[],
    providedArgs: {[name: string]: any}) {
    for (const requiredArg of requiredArgs) {
      if (providedArgs[requiredArg] === undefined) throw `required arg ${requiredArg} was not provided`
    }
  }

  initializeETH2(provider: string) {
    if (this.eth2Beacon === undefined) this.eth2Beacon = new ETH2Beacon(provider)
  }

  async balance(args: {[name: string]: any}, flags: any) {
    try {
      this.checkForRequiredArgs(['PROVIDER', 'VALIDATOR_ID'], args)
      this.initializeETH2(args.PROVIDER)

      // @ts-ignore
      const result = await this.eth2Beacon.getValidatorById({stateId: flags.balance, validatorId: args.VALIDATOR_ID})
      if (flags.data) {
        console.log({ balance: result.balance })
      } else {
        console.log(result.balance)
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  async info(args: {[name: string]: any}, flags: any) {
    try {
      this.checkForRequiredArgs(['PROVIDER', 'VALIDATOR_ID'], args)
      this.initializeETH2(args.PROVIDER)

      // @ts-ignore
      const result = await this.eth2Beacon.getValidatorById({stateId: flags.info, validatorId: args.VALIDATOR_ID})
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }

  async run() {
    try {
      const {args, flags} = this.parse(Validator)
      // console.log(args, flags)

      for (const flag of Object.keys(flags)) {
        // @ts-ignore
        if (this[flag] !== undefined) {
          // @ts-ignore
          this[flag](args, flags)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}
