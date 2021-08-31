import { Web3Error } from './types';

export enum CoreErrorNames {
    unsupportedError = 'unsupportedError',
    duplicateErrorName = 'duplicateErrorName',
    failedToCreateErrorString = 'failedToCreateErrorString',
}

export const CoreErrors: Record<CoreErrorNames, Web3Error> = {
    unsupportedError: {
        name: 'unsupportedError',
        msg: 'Provided error does not exist in CoreErrors or provided Web3PackageErrorConfig',
    },
    duplicateErrorName: {
        name: 'duplicateErrorName',
        msg: 'Error defined in Web3PackageErrorConfig.errors has the same name as an error in CoreErrors',
    },
    failedToCreateErrorString: {
        name: 'failedToCreateErrorString',
        msg: 'Unable to create error string for unknown reason',
    },
};
