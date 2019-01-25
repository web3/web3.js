import * as Types from '..';

/**
 * Types Export test
 */
describe('TypeModuleExportTest', () => {
    let obj;

    beforeEach(() => {});

    it('Interface - Hex', () => {
        const tests = [
            {value: '12', method: Types.Hex.fromString},
            {value: 12, method: Types.Hex.fromNumber},
            {value: 'test', method: Types.Hex.fromAscii},
            {value: 'tæst', method: Types.Hex.fromUtf8}
        ];

        tests.forEach((test) => {
            obj = new test.method(test.value); // eslint-disable-line new-cap

            expect(obj).toHaveProperty('error');
            expect(obj).toHaveProperty('props');
        });
    });

    it('Mixin - Hex', () => {
        const tests = [
            {value: '0x12', is: [true, true]},
            {value: '12', is: [true, false]},
            {value: '1.2', is: [false, false]},
            {value: '-0x1', is: [true, true]},
            {value: '-1', is: [false, false]}
        ];

        tests.forEach((test) => {
            expect(Types.Hex.isValid(test.value)).toBe(test.is[0]);
            expect(Types.Hex.isStrict(test.value)).toBe(test.is[1]);
        });
    });

    it('Interface - Address', () => {
        const tests = [];

        tests.forEach((test) => {
            obj = new test.method(test.value); // eslint-disable-line new-cap

            expect(obj).toHaveProperty('error');
            expect(obj).toHaveProperty('props');
        });
    });

    it('Mixin - Address', () => {
        expect(Types.Address.isValid('0x4f38f4229924bfa28d58eeda496cc85e8016bccc')).toBe(false);
        expect(Types.Address.toChecksum('0x4f38f4229924bfa28d58eeda496cc85e8016bccc').toString()).toBe(
            '0x4F38f4229924bfa28D58eeda496Cc85e8016bCCC'
        );
    });
});
