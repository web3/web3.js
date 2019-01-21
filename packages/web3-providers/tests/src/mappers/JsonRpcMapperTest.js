import JsonRpcMapper from '../../../src/mappers/JsonRpcMapper';

/**
 * JsonRpcMapper test
 */
describe('JsonRpcMapperTest', () => {
    it('calls toPayload and throws an error', () => {
        try {
            JsonRpcMapper.toPayload();
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('calls toPayload and returns expected payload', () => {
        expect(JsonRpcMapper.toPayload('rpc_method', [])).toEqual({
            jsonrpc: '2.0',
            id: 0,
            method: 'rpc_method',
            params: []
        });
    });
});
