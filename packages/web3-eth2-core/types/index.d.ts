export interface ETH2BaseOpts {
    protectProvider?: boolean
}

export type ETH2Function<T = any> = (...args: any[]) => Promise<T>;
