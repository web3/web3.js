import * as Types from '..';

/**
 * Type Module Ether test
 */
describe('TypeModuleEtherTest', () => {
    let obj;

    beforeEach(() => {});

    it('Interface - Ether', () => {
        const tests = [
            {value: '12', method: Types.Wei},
            {value: '12', method: Types.Gwei},
            {value: '12', method: Types.Finney},
            {value: '12', method: Types.Ether},
        ];

        tests.forEach((test) => {
            obj = new test.method(test.value); // eslint-disable-line new-cap

            expect(obj).toHaveProperty('error');
            expect(obj).toHaveProperty('props');
        });
    });
});
