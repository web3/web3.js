import Ether from '../Ether';

/**
 * Ether test
 */
describe('EtherTest', () => {
    let ether;
    const error = {
        amount: () => 'err msg',
        unit: () => 'err msg'
    };

    const initParams = {
        amount: undefined,
        unit: undefined
    };

    const data = {
        amount: '300',
        unit: 'finney'
    };

    it('constructor check', () => {
        ether = new Ether(data, error, initParams);

        expect(ether).toHaveProperty('error');
        expect(ether).toHaveProperty('props');
    });

    it('ether constructor check', () => {
        const tests = [{value: '2000.1'}, {value: '0.12'}, {value: '1'}, {value: '0'}];

        tests.forEach((test) => {
            expect(new Ether(test.value, error, initParams).toString()).toEqual(`${test.value} ether`);
        });
    });

    it('parses to wei', () => {
        const tests = [
            {amount: '1', unit: 'wei', expected: '1'},
            {amount: '1', unit: 'mwei', expected: '1000000'},
            {amount: '1', unit: 'gwei', expected: '1000000000'},
            {amount: '1', unit: 'szabo', expected: '1000000000000'},
            {amount: '1', unit: 'finney', expected: '1000000000000000'},
            {amount: '1', unit: 'ether', expected: '1000000000000000000'}
        ];

        tests.forEach((test) => {
            expect(new Ether({...test}, error, initParams).toWei()).toEqual(`${test.expected}`);
        });
    });

    // TODO: manage decimal places
    // These results implicitly run FLOOR()
    it('parses to other units', () => {
        const tests = [
            {amount: '1', unit: 'wei', to: 'mwei', expected: '0'},
            {amount: '1', unit: 'wei', to: 'ether', expected: '0'},
            {amount: '1', unit: 'gwei', to: 'ether', expected: '0'},
            {amount: '1', unit: 'szabo', to: 'gwei', expected: '1000'},
            {amount: '1', unit: 'finney', to: 'gwei', expected: '1000000'},
            {amount: '1', unit: 'ether', to: 'gwei', expected: '1000000000'}
        ];

        tests.forEach((test) => {
            expect(new Ether({...test}, error, initParams).toUnit(test.to)).toEqual(`${test.expected}`);
        });
    });
});
