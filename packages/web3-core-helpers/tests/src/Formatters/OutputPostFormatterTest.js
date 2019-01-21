import {outputPostFormatter} from '../../../src/Formatters';

/**
 * OutputPostFormatter test
 */
describe('OutputPostFormatterTest', () => {
    it('call outputPostFormatter with a valid post object', () => {
        const post = {
            expiry: '0x0',
            sent: '0x0',
            ttl: '0x0',
            workProved: '0x0',
            topics: ['0x64']
        };

        expect(outputPostFormatter(post)).toEqual({
            expiry: 0,
            sent: 0,
            ttl: 0,
            workProved: 0,
            topics: ['d']
        });
    });

    it('call outputPostFormatter without the topics property defined on the post object', () => {
        const post = {
            expiry: '0x0',
            sent: '0x0',
            ttl: '0x0',
            workProved: '0x0'
        };

        expect(outputPostFormatter(post)).toEqual({
            expiry: 0,
            sent: 0,
            ttl: 0,
            workProved: 0,
            topics: []
        });
    });
});
