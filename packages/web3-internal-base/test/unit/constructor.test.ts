
import Base from '../../src/index'

const provider = 'http://127.0.0.1:8545'

it('constructs a Base instance with expected properties', () => {
    const base = new Base('eth', provider)
    expect(base.name).toBe('eth')
    expect(base.provider).toBe(provider)
    expect(base.protectProvider)
})