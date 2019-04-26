import ContractEstimateGasMethod from '../../../src/methods/ContractEstimateGasMethod';

/**
 * ContractEstimateGasMethod test
 */
describe('ContractEstimateGasMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new ContractEstimateGasMethod({}, {}, {});
    });

    it('calls beforeExecution and detects the given callback', () => {
        method.callback = false;
        method.parameters = [() => {}];

        method.beforeExecution({});

        expect(method.callback).toBeInstanceOf(Function);
    })
});
