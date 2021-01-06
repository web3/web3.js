import jest from 'jest'

export const get = jest.fn(() => Promise.resolve({ data: {} }))
