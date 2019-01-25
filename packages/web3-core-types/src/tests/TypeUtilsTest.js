import {cloneDeep} from 'lodash';
import * as Types from '../index.js';

/**
 * Types Export test
 */
describe('TypeModuleExportTest', () => {
    let obj;

    beforeEach(() => {});

    it('constructor checks - Hex', () => {
        const tests = [
            {value: "12", method: Types.Hex.fromString},
            {value: 12, method: Types.Hex.fromNumber},
            {value: "test", method: Types.Hex.fromAscii},
            {value: "tæst", method: Types.Hex.fromUtf8},
        ];

        tests.forEach((test) => {
            obj = new test.method(test.value);

            expect(obj).toHaveProperty('error');
            expect(obj).toHaveProperty('props');
        });
    });
    
    it('constructor checks - Address', () => {
        const tests = [
        ];

        tests.forEach((test) => {
            obj = new test.method(test.value);

            expect(obj).toHaveProperty('error');
            expect(obj).toHaveProperty('props');
        });
    });
});
