import { Web3Error } from './types';

export enum CoreErrorNames {
    // Constant
    unsupportedError = 'unsupportedError',
}

export const CoreErrors: Record<CoreErrorNames, Web3Error> = {
    unsupportedError: {
        code: 1,
        name: 'unsupportedError',
        msg: 'Provided error does not exist in CoreErrors or provided Web3PackageErrorConfig',
    },
};
