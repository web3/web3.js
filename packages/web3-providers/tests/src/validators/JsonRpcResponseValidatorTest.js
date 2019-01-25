import JsonRpcResponseValidator from '../../../src/validators/JsonRpcResponseValidator';

/**
 * JsonRpcResponseValidator test
 */
describe('JsonRpcResponseValidatorTest', () => {
    it('calls validate and returns true', () => {
        expect(
            JsonRpcResponseValidator.validate({
                id: 0,
                jsonrpc: '2.0',
                result: ''
            })
        ).toEqual(true);
    });

    it('calls validate with an Error in the response and returns an node error ', () => {
        expect(
            JsonRpcResponseValidator.validate({
                id: 0,
                jsonrpc: '2.0',
                error: new Error('Error')
            })
        ).toEqual(new Error('Node error: Error'));
    });

    it('calls validate with an error string in the response and returns an node error ', () => {
        expect(
            JsonRpcResponseValidator.validate({
                id: 0,
                jsonrpc: '2.0',
                error: 'Error'
            })
        ).toEqual(new Error('Node error: "Error"'));
    });

    it('calls validate and returns an invalid payload id error ', () => {
        expect(
            JsonRpcResponseValidator.validate(
                {
                    id: 0,
                    jsonrpc: '2.0'
                },
                {
                    id: 2
                }
            )
        ).toEqual(new Error('Validation error: Invalid JSON-RPC response ID (request: 2 / response: 0)'));
    });

    it('calls validate and returns an undefined result error', () => {
        expect(
            JsonRpcResponseValidator.validate(
                {
                    id: 0,
                    jsonrpc: '2.0',
                    result: undefined
                },
                {
                    id: 0
                }
            )
        ).toEqual(new Error('Validation error: Undefined JSON-RPC result'));
    });

    it('calls validate with invalid response parameter and returns an validation error', () => {
        expect(
            JsonRpcResponseValidator.validate('nope', {
                id: 0
            })
        ).toEqual(new Error('Validation error: Response should be of type Object'));
    });
});
