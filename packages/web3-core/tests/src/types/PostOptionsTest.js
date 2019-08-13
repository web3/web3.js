import PostOptions from '../../../src/types/PostOptions';

/**
 * PostOptions test
 */
describe('PostOptionsTest', () => {
    it('calls the constructor and defines all properties correctly', () => {
        const postOptionsMock = {
            ttl: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
            workToProve: 0,
            priority: 0,
            topics: '0x0'
        };

        const postOptions = new PostOptions(postOptionsMock);

        expect(postOptions.ttl).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(postOptions.workToProve).toEqual('0x00');

        expect(postOptions.priority).toEqual('0x00');

        expect(postOptions.topics).toEqual(['0x0']);
    });

    it('calls the constructor with a topics array and defines all properties correctly', () => {
        const postOptionsMock = {
            ttl: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
            workToProve: 0,
            priority: 0,
            topics: ['0x0', 'myString']
        };

        const postOptions = new PostOptions(postOptionsMock);

        expect(postOptions.ttl).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(postOptions.workToProve).toEqual('0x00');

        expect(postOptions.priority).toEqual('0x00');

        expect(postOptions.topics).toEqual(['0x0', '0x6d79537472696e67']);
    });
});
