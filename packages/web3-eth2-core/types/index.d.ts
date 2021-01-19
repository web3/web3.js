export interface ETH2BaseOpts {
    protectProvider?: boolean
}

export type ETH2Function<T = any> = (...args: any[]) => Promise<T>;

export interface IBaseAPISchema {
    packageName: string,
    routePrefix: string,
    methods: IBaseAPIMethodSchema[]
}

export interface IBaseAPIMethodSchema {
    notImplemented?: true,
    name: string,
    route: string,
    restMethod: string
    inputFormatter: any,
    outputFormatter: any,
    errors: any
    errorPrefix: string
}
