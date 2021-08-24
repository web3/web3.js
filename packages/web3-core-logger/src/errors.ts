import { Web3Error } from './types';

export enum CoreErrorNames {
    unsupportedError = 'unsupportedError',
    duplicateErrorName = 'duplicateErrorName',
    failedToCreateErrorString = 'failedToCreateErrorString',
}

export const CoreErrors: Record<CoreErrorNames, Web3Error> = {
    unsupportedError: {
        code: 1,
        name: 'unsupportedError',
        msg: 'Provided error does not exist in CoreErrors or provided Web3PackageErrorConfig',
    },
    duplicateErrorName: {
        code: 2,
        name: 'duplicateErrorName',
        msg: 'Error defined in Web3PackageErrorConfig.errors has the same name as an error in CoreErrors',
    },
    failedToCreateErrorString: {
        code: 3,
        name: 'failedToCreateErrorString',
        msg: 'Unable to create error string for unknown reason',
    },
};
