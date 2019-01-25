import {inputSignFormatter} from '../../../src/Formatters';

/**
 * inputSignFormatter test
 */
describe('InputSignFormatterTest', () => {
    it("inputSignFormatter returns string if it's already of type hex", () => {
        expect(inputSignFormatter('0x0')).toEqual('0x0');
    });

    it('inputSignFormatter returns normal string as hex string', () => {
        expect(inputSignFormatter('100')).toEqual('0x313030');
    });
});
