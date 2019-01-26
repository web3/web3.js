import * as Types from '..';

/**
 * Type Module Address test
 */
describe('TypeModuleAddressTest', () => {
    let obj;

    beforeEach(() => {});

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
