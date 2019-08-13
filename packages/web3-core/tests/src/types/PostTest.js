import Post from '../../../src/types/Post';

/**
 * Post test
 */
describe('PostTest', () => {
    it('calls the constructor and defines all properties correctly', () => {
        const postMock = {
            expiry: '0x0',
            sent: '0x0',
            ttl: '0x0',
            workProved: '0x0',
            payload: '0x6d79537472696e67',
            topics: ['0x6d79537472696e67']
        };

        const log = new Post(postMock);

        expect(log.expiry).toEqual(0);

        expect(log.sent).toEqual(0);

        expect(log.ttl).toEqual(0);

        expect(log.workProved).toEqual(0);

        expect(log.payload).toEqual('myString');

        expect(log.topics).toEqual(['myString']);
    });

    it('calls the constructor without topics and defines all properties correctly', () => {
        const postMock = {
            expiry: '0x0',
            sent: '0x0',
            ttl: '0x0',
            workProved: '0x0',
            payload: '0x6d79537472696e67',
            topics: false
        };

        const log = new Post(postMock);

        expect(log.expiry).toEqual(0);

        expect(log.sent).toEqual(0);

        expect(log.ttl).toEqual(0);

        expect(log.workProved).toEqual(0);

        expect(log.payload).toEqual('myString');

        expect(log.topics).toEqual(false);
    });
});
