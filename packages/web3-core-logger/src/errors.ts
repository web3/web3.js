import { Web3Error } from './types';

export enum CoreErrorNames {
    unsupportedError = 'unsupportedError',
}

interface CoreErrorsConfig {
    errors: Record<CoreErrorNames, Web3Error>;
}

export const CoreErrors = {
    unsupportedError: {
        code: 1,
        name: 'unsupportedError',
    },
};
