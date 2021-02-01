export interface ETH2BaseOpts {
    protectProvider?: boolean
}

export type ETH2Function<T = any> = (...args: any[]) => Promise<T>;

export interface BaseAPISchemaMethod {
    notImplemented?: true,
    name: string,
    route: string,
    restMethod: 'get' | 'post'
    inputFormatter: any,
    outputFormatter: any,
    errors: any
    errorPrefix: string
}

export interface BaseAPISchema {
    packageName: string,
    routePrefix: string,
    methods: BaseAPISchemaMethod[]
}

export interface ETH2Core {
    setProvider(provider: string): void
}
