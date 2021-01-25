import { ETH2Core } from '../src/index'

const provider = 'http://127.0.0.1:9596'
const testAPISchema = {
    packageName: 'testValue',
    routePrefix: '/test/route/',
    methods: [
        {
            name: 'testMethod',
            route: 'additional/route',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Test error prefix:'
        }
    ]
}

it('constructs a ETH2Core instance with expected properties', () => {
    // @ts-ignore using a mock schema for test
    const eth2Core = new ETH2Core(provider, testAPISchema, { protectProvider: true })

    expect(eth2Core.name).toBe(testAPISchema.packageName)
    expect(eth2Core.provider).toBe(`${provider}${testAPISchema.routePrefix}`)
    expect(eth2Core.protectProvider)
    expect(eth2Core.testMethod).toBeDefined()
})
