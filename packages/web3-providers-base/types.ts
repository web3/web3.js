export interface ProviderOptions {
    providerUrl: string
}

export interface IWeb3Provider {
    providerString: string
    setProvider: (providerString: string) => void
    // TODO get rid of anys
    send: (options: any) => Promise<any>
    disconnect?: () => void
}
