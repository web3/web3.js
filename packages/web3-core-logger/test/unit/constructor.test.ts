import Web3CoreLogger from '../../src/index';
import Version from '../../src/_version';

describe('Web3CoreLogger', () => {
    it('should successfully construct an instance', () => {
        const testErrorConfig = {
            packageName: 'testPackage',
            packageVersion: '1.0.0',
            errors: {
                testError1: {
                    name: 'testError1',
                    msg: 'this is a test',
                },
            },
        };

        const logger = new Web3CoreLogger(testErrorConfig);
        expect(logger.makeError).not.toBe(undefined);
    });

    it('should error with duplicateErrorName', () => {
        const testErrorConfig = {
            packageName: 'testPackage',
            packageVersion: '1.0.0',
            errors: {
                unsupportedError: {
                    name: 'unsupportedError',
                    msg: 'Provided error does not exist in CoreErrors or provided Web3PackageErrorConfig',
                },
            },
        };

        expect(() => {
            new Web3CoreLogger(testErrorConfig);
        }).toThrowError(
            `{"loggerVersion":"${Version}","packageName":"testPackage","packageVersion":"1.0.0","name":"duplicateErrorName","msg":"Error defined in Web3PackageErrorConfig.errors has the same name as an error in CoreErrors","params":{"duplicateError":"unsupportedError"}}`
        );
    });
});
