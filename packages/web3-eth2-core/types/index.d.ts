export interface ETH2BaseOpts {
    protectProvider?: boolean
}

export type ETH2Function<T = any> = (...args: any[]) => Promise<T>;

export interface BaseAPISchema {
    packageName: string,
    routePrefix: string,
    methods: BaseAPIMethodSchema[]
}

export interface BaseAPIMethodSchema {
    notImplemented?: true,
    name: string,
    route: string,
    restMethod: string
    inputFormatter: any,
    outputFormatter: any,
    errors: any
    errorPrefix: string
}

export class ETH2Core {
    constructor(
        provider: string,
        schema: BaseAPISchema,
        opts: ETH2BaseOpts
    )

    setProvider(provider: string): void
}
