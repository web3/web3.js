export interface BaseAPISchema {
    packageName: string,
    routePrefix: string,
    methods: [
        {
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
    ]
}