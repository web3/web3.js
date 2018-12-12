import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';

/**
 * JsonRpcResponseValidator test
 */
describe('JsonRpcResponseValidatorTest', () => {
    it('validate returns true with an array of responses', () => {
        expect(JsonRpcResponseValidator.validate(
            [
                {
                    id: 0,
                    jsonrpc: '2.0',
                    result: ''
                }
            ]
        )).toEqual(true);
    });

    it('validate returns false with an array of responses', () => {
        expect(JsonRpcResponseValidator.validate(
            [
                {
                    id: 0,
                    jsonrpc: '2.0',
                    result: undefined
                }
            ]
        )).toEqual(false);
    });

    it('validate returns true with one response', () => {
        expect(JsonRpcResponseValidator.validate(
            {
                id: 0,
                jsonrpc: '2.0',
                result: ''
            }
        )).toEqual(true);
    });

    it('validate returns false with one response', () => {
        expect(JsonRpcResponseValidator.validate(
            {
                id: 0,
                jsonrpc: '2.0',
                result: undefined
            }
        )).toEqual(false);
    });
});
