import { CoreErrors, CoreErrorNames } from './errors';
import { Web3PackageErrorConfig, Web3Error, Web3ErrorDetails } from './types';
import packageVersion from './_version';

export default class Web3CoreLogger {
    private _packageErrorConfig: Web3PackageErrorConfig;
    private _errorsCollective: { [key: string]: Web3Error };

    constructor(packageErrorConfig: Web3PackageErrorConfig) {
        this._packageErrorConfig = packageErrorConfig;
        this._errorsCollective = CoreErrors;

        // Check for name collisions
        for (const errorName of Object.keys(CoreErrors)) {
            if (packageErrorConfig.errors.hasOwnProperty(errorName))
                throw this.makeError(CoreErrorNames.duplicateErrorName, {
                    params: { duplicateError: errorName },
                });
        }

        this._errorsCollective = {
            ...this._errorsCollective,
            ...packageErrorConfig.errors,
        };
    }

    makeError(web3ErrorName: string, errorDetails?: Web3ErrorDetails): Error {
        try {
            if (!this._errorsCollective.hasOwnProperty(web3ErrorName))
                throw this.makeError(CoreErrorNames.unsupportedError, {
                    params: { web3ErrorName, errorDetails },
                });

            return Error(
                this._makeErrorString({
                    ...this._errorsCollective[web3ErrorName],
                    ...errorDetails,
                })
            );
        } catch (error) {
            throw error;
        }
    }

    private _makeErrorString(web3Error: Web3Error): string {
        try {
            const errorPieces = [
                `loggerVersion: ${packageVersion}`,
                `packageName: ${this._packageErrorConfig.packageName}`,
                `packageVersion: ${this._packageErrorConfig.packageVersion}`,
            ];

            for (const property in web3Error) {
                const value = web3Error[property as keyof typeof web3Error];

                let formattedValue;
                if (typeof value === 'object' && value !== null) {
                    try {
                        formattedValue = `params: ${JSON.stringify(value)}`;
                    } catch (error) {
                        if (
                            error.message ===
                            'Do not know how to serialize a BigInt'
                        ) {
                            // JSON.stringify doesn't work with BigInts
                            // so we check each property in value for type === 'bigint'
                            // then cast to string, so we can call JSON.stringify successfully
                            for (const key of Object.keys(value)) {
                                if (typeof value[key] === 'bigint') {
                                    value[key] = `${value[key].toString()}n`;
                                }
                            }

                            formattedValue = `params: ${JSON.stringify(value)}`;
                        } else {
                            throw error;
                        }
                    }
                } else {
                    formattedValue = `${property}: ${value}`;
                }

                errorPieces.push(formattedValue);
            }

            const errorString = errorPieces.join('\n');
            if (errorString === undefined)
                this.makeError(CoreErrorNames.failedToCreateErrorString, {
                    params: { errorPieces },
                });

            return errorString;
        } catch (error) {
            throw error;
        }
    }
}
