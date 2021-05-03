export interface ProviderOptions {
    providerUrl: string
}

export interface IWeb3Provider {
    providerUrl: string
    setProvider: (providerUrl: string) => void
    // TODO get rid of anys
    send: (options: any) => Promise<any>
    disconnect?: () => void
}
