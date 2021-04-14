import { Base } from '../../src/index'

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

it('constructs a Base instance with expected properties', () => {
    // @ts-ignore using a mock schema for test
    const base = new Base(provider, testAPISchema, { protectProvider: true })

    expect(base.name).toBe(testAPISchema.packageName)
    expect(base.provider).toBe(`${provider}${testAPISchema.routePrefix}`)
    expect(base.protectProvider)
    expect(base.testMethod).toBeDefined()
})