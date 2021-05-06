import {HttpRpcResponse} from "web3-providers-http/types";
import Web3RequestManager from 'web3-core-requestmanager'

import Web3Eth from "../../src";
import {blockIdentifier} from '../../types'
import {testConfig} from './testConfig'

// @ts-ignore undefined was added to test default blockIdentifier set by Web3Eth method
const blockIdentifiers: blockIdentifier[] = [undefined, 'latest', 'earliest', 'pending', 42]

let web3Eth: Web3Eth

function callWeb3EthMethod(methodName: string, parameters: {[key: string]: string | number | BigInt}) {
    return Object.keys(parameters).length === 0 ?
    // @ts-ignore
    web3Eth[methodName]()
    // @ts-ignore
    : web3Eth[methodName](parameters)
}

async function configureWeb3EthCall(
    methodName: string,
    parameters: {[key: string]: string | number | BigInt},
    enumerateBlockIdentifiers: boolean): Promise<HttpRpcResponse[]> {
    if (enumerateBlockIdentifiers) {
        const methodPromises = []
        for (const blockIdentifier of blockIdentifiers) {
            if (blockIdentifier !== undefined) parameters.block = blockIdentifier
            methodPromises.push(callWeb3EthMethod(methodName, parameters))
        }
        return await Promise.all(methodPromises)
    }
    return await callWeb3EthMethod(methodName, parameters)
}

for (const method of testConfig.methods) {
    describe(`Web3Eth.${method.name}`, () => {
        let web3RequestManagerSendSpy: jest.SpyInstance

        beforeAll(() => {
            Web3RequestManager.prototype.send = jest.fn()
            // @ts-ignore mockReturnValue added by jest
            Web3RequestManager.prototype.send.mockReturnValue(method.expectedResult)
            web3RequestManagerSendSpy = jest.spyOn(Web3RequestManager.prototype, 'send')

            web3Eth = new Web3Eth({providerUrl: testConfig.providerUrl})
        })

        it('should construct a Web3Eth instance with method defined', () => {
            // @ts-ignore
            expect(web3Eth[method.name]).not.toBe(undefined)
        })

        it('should get expected result - default RPC parameters', async () => {
            const result = await configureWeb3EthCall(
                method.name,
                method.parameters || {},
                method.enumerateBlockIdentifiers || false)
            Array.isArray(result) ?
            result.forEach(methodResult => {
                expect(methodResult).toMatchObject(method.expectedResult)})
            : expect(result).toMatchObject(method.expectedResult)
        })

        it('should get expected result - id RPC parameter', async () => {
            const result = await configureWeb3EthCall(
                method.name,
                {...method.parameters, id: testConfig.expectedRpcId},
                method.enumerateBlockIdentifiers || false)
            Array.isArray(result) ?
            result.forEach(methodResult => {
                expect(methodResult).toMatchObject(method.expectedResult)})
            : expect(result).toMatchObject(method.expectedResult)
        })
    })
}
