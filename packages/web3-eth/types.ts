export interface ProviderOptions {
    protectProvider?: boolean
    supportsSubscriptions?: boolean
}

export interface Web3EthOptions {
    packageName?: string
    providerString: string
    providerOptions?: ProviderOptions
}
