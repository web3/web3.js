export interface IBaseAPISchema {
    packageName: string,
    routePrefix: string,
    methods: IBaseAPIMethodSchema[]
}

export interface IBaseAPIMethodSchema {
    name: string,
    route: string,
    restMethod: string
    paramsType: any,
    returnType: any,
    inputFormatter: any,
    outputFormatter: any,
    errors: any
    errorPrefix: string
}
