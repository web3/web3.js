export interface Web3ErrorDetails {
    reason?: string;
    params?: { [key: string]: any };
}

export interface Web3Error extends Web3ErrorDetails {
    readonly name: string;
    readonly msg: string;
}

export interface Web3PackageErrorConfig {
    packageName: string;
    packageVersion: string;
    errors: Record<any, Web3Error>;
}

export interface Web3LoggerError extends Error {
    isWeb3LoggerError: true;
}
