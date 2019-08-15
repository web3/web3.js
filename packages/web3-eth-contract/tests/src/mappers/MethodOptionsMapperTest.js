import MethodOptionsMapper from '../../../src/mappers/MethodOptionsMapper';

/**
 * MethodOptionsMapper test
 */
describe('MethodOptionsMapperTest', () => {
    let methodOptionsMapper;

    beforeEach(() => {
        methodOptionsMapper = new MethodOptionsMapper();
    });

    it('calls map with a from property and returns the expected result', () => {
        const options = {
            from: '0x0'
        };

        const contract = {
            defaultGasPrice: 100,
            defaultGas: 100,
            address: '0x0'
        };

        const response = methodOptionsMapper.map(contract, options);

        expect(response).toEqual({
            to: '0x0',
            from: '0x0',
            gasPrice: 100,
            gas: 100
        });
    });

    it('calls map with a gasPrice property and returns the expected result', () => {
        const options = {
            gasPrice: 100
        };

        const contract = {
            defaultGas: 100,
            defaultAccount: '0x0',
            address: '0x0'
        };

        const response = methodOptionsMapper.map(contract, options);

        expect(response).toEqual({
            to: '0x0',
            from: '0x0',
            gasPrice: 100,
            gas: 100
        });
    });

    it('calls map with a gasLimit property and returns the expected result', () => {
        const options = {
            gasLimit: 100
        };

        const contract = {
            defaultGasPrice: 100,
            defaultAccount: '0x0',
            address: '0x0'
        };

        const response = methodOptionsMapper.map(contract, options);

        expect(response).toEqual({
            to: '0x0',
            from: '0x0',
            gasPrice: 100,
            gas: 100
        });

        expect(response.gasLimit).toBeUndefined();
    });
});
