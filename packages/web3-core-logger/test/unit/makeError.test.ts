import Web3CoreLogger from '../../src/index';
import Version from '../../src/_version';

describe('Web3CoreLogger', () => {
    const testErrorConfig = {
        packageName: 'testPackage',
        packageVersion: '1.0.0',
        errors: {
            testError1: {
                code: 1,
                name: 'testError1',
                msg: 'this is a test',
            },
        },
    };

    let web3CoreLogger: Web3CoreLogger;

    beforeAll(() => {
        web3CoreLogger = new Web3CoreLogger(testErrorConfig);
    });

    it('should successfully construct an error', () => {
        const errorDetails = {
            reason: 'this is a test reason',
            params: { param1: 'one', param2: { param3: [1, 2, 4] } },
        };
        const error = web3CoreLogger.makeError(
            testErrorConfig.errors.testError1.name,
            errorDetails
        );
        expect(error).toStrictEqual(
            new Error(
                [
                    `loggerVersion: ${Version}`,
                    `packageName: ${testErrorConfig.packageName}`,
                    `packageVersion: ${testErrorConfig.packageVersion}`,
                    `code: ${testErrorConfig.errors.testError1.code}`,
                    `name: ${testErrorConfig.errors.testError1.name}`,
                    `msg: ${testErrorConfig.errors.testError1.msg}`,
                    `reason: ${errorDetails.reason}`,
                    `params: ${JSON.stringify(errorDetails.params)}`,
                ].join('\n')
            )
        );
    });

    it('should error with unsupportedError', () => {
        expect(() => {
            web3CoreLogger.makeError('fakeErrorName');
        }).toThrowError(
            [
                `loggerVersion: ${Version}`,
                `packageName: ${testErrorConfig.packageName}`,
                `packageVersion: ${testErrorConfig.packageVersion}`,
                'code: 1',
                'name: unsupportedError',
                'msg: Provided error does not exist in CoreErrors or provided Web3PackageErrorConfig',
                'params: {"web3ErrorName":"fakeErrorName"}',
            ].join('\n')
        );
    });
});
