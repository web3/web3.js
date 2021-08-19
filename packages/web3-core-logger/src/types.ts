export interface Web3ErrorDetails {
    msg?: string;
    reason?: string;
    params?: object;
}

export interface Web3Error extends Web3ErrorDetails {
    readonly code: number;
    readonly name: string;
}

export interface Web3PackageErrorConfig {
    packageName: string;
    packageVersion: string;
    errors: Record<any, Web3Error>;
}
