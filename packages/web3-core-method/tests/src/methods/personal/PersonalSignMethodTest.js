import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import PersonalSignMethod from '../../../../src/methods/personal/PersonalSignMethod';

/**
 * PersonalSignMethod test
 */
describe('PersonalSignMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new PersonalSignMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('personal_sign');

        expect(method.parametersAmount).toEqual(3);
    });

    it('beforeExecution should call inputSignFormatter and inputAddressFormatter', () => {
        method.parameters = ['sign', '0x0'];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('signed');

        expect(method.parameters[1]).toEqual('0x00');
    });

    it('calls beforeExecution with a callback instead of the optional paramter and it calls the inputSignFormatter and inputAddressFormatter', () => {
        const callback = jest.fn();
        method.parameters = ['sign', '0x0', callback];

        method.beforeExecution();

        expect(method.callback).toEqual(callback);

        expect(method.parameters[0]).toEqual('signed');

        expect(method.parameters[1]).toEqual('0x00');

        expect(method.parameters[2]).toEqual(undefined);
    });
});
