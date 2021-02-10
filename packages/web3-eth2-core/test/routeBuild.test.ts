import { ETH2Core } from '../src/index'

const provider = 'http://127.0.0.1:9596'
const testAPISchema = {
    packageName: 'testValue',
    routePrefix: '/test/route/',
    methods: [
        {
            name: 'testMethod',
            route: 'additional/route/${replaceMe}',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Test error prefix:'
        },
        {
            name: 'testMethod2',
            route: 'additional/route',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Test error prefix:'
        },
        {
            name: 'testMethod3',
            route: '${replaceMe1}/foo/${replaceMe2}/${replaceMe3}/bar/${replaceMe4}',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Test error prefix:'
        }
    ]
}

let eth2Core: ETH2Core

beforeAll(() => {
    // @ts-ignore using a mock schema for test
    eth2Core = new ETH2Core(provider, testAPISchema, { protectProvider: true })
})

it('Should build expectedComputedRoute with 1 parameter', () => {
    const routeParameter = { replaceMe: 'testValue' }
    const expectedComputedRoute = `additional/route/${routeParameter.replaceMe}`
    // @ts-ignore routeBuilder is private
    const computedRoute = eth2Core.routeBuilder(testAPISchema.methods[0].route, routeParameter)
    expect(computedRoute).toBe(expectedComputedRoute)
})

it('Should throw missing parameter error', () => {
    const routeParameter = {}
    expect(() => {
        // @ts-ignore routeBuilder is private
        eth2Core.routeBuilder(testAPISchema.methods[0].route, routeParameter)
    }).toThrow('Failed to build route: The parameter replaceMe was not provided')
})

it('Should build expectedComputedRoute with 0 parameters', () => {
    const routeParameter = {}
    const expectedComputedRoute = testAPISchema.methods[1].route
    // @ts-ignore routeBuilder is private
    const computedRoute = eth2Core.routeBuilder(testAPISchema.methods[1].route, routeParameter)
    expect(computedRoute).toBe(expectedComputedRoute)
})

it('Should build expectedComputedRoute with 4 parameters', () => {
    const routeParameters = {
        replaceMe1: 'testValue',
        replaceMe2: 'testValue2',
        replaceMe3: 'testValue3',
        replaceMe4: 'testValue4'
    }
    const expectedComputedRoute = `${routeParameters.replaceMe1}/foo/${routeParameters.replaceMe2}/${routeParameters.replaceMe3}/bar/${routeParameters.replaceMe4}`
    // @ts-ignore routeBuilder is private
    const computedRoute = eth2Core.routeBuilder(testAPISchema.methods[2].route, routeParameters)
    expect(computedRoute).toBe(expectedComputedRoute)
})
