import { AxiosInstance } from 'axios'

import Web3ProvidersHttp from '../../src/index'

describe('Web3ProvidersHttp.createHttpClient', () => {
    const expectedBaseUrl = 'http://localhost:8545'

    it('should return an Axios instance', () => {
        const axiosInstance: AxiosInstance = Web3ProvidersHttp.createHttpClient(expectedBaseUrl)
        expect(axiosInstance).not.toBe(undefined)
        expect(axiosInstance.defaults.baseURL).toBe(expectedBaseUrl)
    })
})
