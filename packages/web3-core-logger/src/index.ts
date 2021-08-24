import { CoreErrors, CoreErrorNames } from './errors';
import { Web3PackageErrorConfig, Web3Error, Web3ErrorDetails } from './types';
import packageVersion from './_version';

export default class Web3CoreLogger {
    private _packageErrorConfig: Web3PackageErrorConfig;
    private _errorsCollective: { [key: string]: Web3Error };

    constructor(packageErrorConfig: Web3PackageErrorConfig) {
        this._packageErrorConfig = packageErrorConfig;

        // If user passes duplicate error names,
        // this will override the user's errors with CoreErrors
        this._errorsCollective = {
            ...packageErrorConfig.errors,
            ...CoreErrors,
        };

        // We still check for duplicate errors,
        // so that the user is aware
        Object.keys(CoreErrors).forEach((errorName) => {
            if (packageErrorConfig.errors.hasOwnProperty(errorName))
                throw this.makeError(CoreErrorNames.duplicateErrorName, {
                    params: { duplicateError: errorName },
                });
        });
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
                                // @ts-ignore
                                // No index signature with a parameter of type 'string' was found on type '{}'.ts(7053)
                                if (typeof value[key] === 'bigint') {
                                    // @ts-ignore
                                    // No index signature with a parameter of type 'string' was found on type '{}'.ts(7053)
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
                // TODO
                throw Error('Failed to create error string');

            return errorString;
        } catch (error) {
            throw error;
        }
    }
}
