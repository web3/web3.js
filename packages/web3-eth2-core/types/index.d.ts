export type ETH2BaseOpts = {
    protectProvider?: boolean
}

export type ETH2Function<T = any> = (...args: Array<any>) => Promise<T>;
