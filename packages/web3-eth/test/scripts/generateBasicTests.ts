import { existsSync, unlinkSync, open, writeFileSync } from 'fs'


interface configMethod {
  name: string
  provider?: string
  expectedResult: any
  expectedId: number
}

interface IConfig {
  path: string
  provider: string
  methods: configMethod[]
}

const config: IConfig = {
  path: './test/unit',
  provider: 'http://127.0.0.1:8545',
  methods: [
    {
      name: 'getBlockNumber',
      expectedId: 42,
      // @ts-ignore BigInt literals are not available when targeting lower than ES2020.
      expectedResult: 23
    }
  ]
};

function writeTestFile(method: configMethod) {
  writeFileSync(`${config.path}/${method.name}.test.ts`, `
import { RpcResponseBigInt } from 'web3-internal-base/types'

import Web3Eth from '../../src/index'

const provider = '${method.provider ? method.provider : config.provider}'
const expectedId = ${method.expectedId}
const expectedResult = ${method.expectedResult}

let web3Eth: Web3Eth

beforeAll(() => {
    web3Eth = new Web3Eth(provider);
})

it('[SANITY] constructs a Web3Eth instance with ${method.name} method', () => {
    expect(web3Eth.${method.name}).not.toBe(undefined)
})

it('should get block number - no params', async () => {
    const result: RpcResponseBigInt = await web3Eth.${method.name}()
    expect(typeof result.id).toBe('number')
    expect(result.jsonrpc).toBe('2.0')
    expect(result.result).toBe(expectedResult)
})

it(\`should get block number - id param should be \${expectedId}\`, async () => {
    const result: RpcResponseBigInt = await web3Eth.${method.name}({id: expectedId})
    expect(result.id).toBe(expectedId)
    expect(result.jsonrpc).toBe('2.0')
    expect(result.result).toBe(expectedResult)
})   
`)
}

(() => {
    try {
        for (const method of config.methods) {
          if (existsSync(`${config.path}/${method.name}.test.ts`)) unlinkSync(`${config.path}/${method.name}.test.ts`)
          writeTestFile(method)
        }
      } catch(err) {
        console.error(err)
      }
})()