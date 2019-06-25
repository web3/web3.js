import * as Types from '../../src';

/**
 * Type Module Ether test
 */
describe('TypeModuleEtherTest', () => {
    let object;

    beforeEach(() => {});

    it('Interface - Ether', () => {
        const tests = [
            {value: '12', method: Types.Wei},
            {value: '12', method: Types.Gwei},
            {value: '12', method: Types.Finney},
            {value: '12', method: Types.Ether}
        ];

        tests.forEach((test) => {
            object = new test.method(test.value); // eslint-disable-line new-cap

            expect(object).toHaveProperty('error');
            expect(object).toHaveProperty('props');
        });
    });
});
