export interface IBaseAPISchema {
    packageName: string,
    routePrefix: string,
    methods: IBaseAPIMethodSchema[]
}

export interface IBaseAPIMethodSchema {
    name: string,
    route: string,
    restMethod: string
    inputFormatter: any,
    outputFormatter: any,
    errors: any
    errorPrefix: string
}
