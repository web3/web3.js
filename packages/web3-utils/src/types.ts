export type PrefixedHexString = string;
export type NumberString = string;
export type ValidTypes = number | PrefixedHexString | NumberString | BigInt;
export type BlockIdentifier = ValidTypes | BlockTags;

export enum BlockTags {
    latest = 'latest',
    earliest = 'earliest',
    pending = 'pending',
}

export enum ValidTypesEnum {
    Number = 'Number',
    PrefixedHexString = 'PrefixedHexString',
    NumberString = 'NumberString',
    BigInt = 'BigInt',
}

export type EthFilter = {
    fromBlock?: BlockIdentifier;
    toBlock?: BlockIdentifier;
    address?: PrefixedHexString;
    topics?: PrefixedHexString | null | PrefixedHexString[][];
    blockHash?: PrefixedHexString;
};

/**
 * @param to is optional when creating a new contract
 * @param gas optional, default set by node 90,000
 * @param gasPrice optional, default to be determined by node
 * @param data optional, but required if {to} is not provided
 */
export type EthTransaction = {
    from: PrefixedHexString;
    to?: PrefixedHexString;
    gas?: ValidTypes;
    gasPrice?: ValidTypes;
    value?: ValidTypes;
    data?: PrefixedHexString;
    nonce?: ValidTypes;
};

export type EthMinedTransaction = {
    blockHash: PrefixedHexString | null;
    blockNumber: ValidTypes | null;
    from: PrefixedHexString;
    gas: ValidTypes;
    gasPrice: ValidTypes;
    hash: PrefixedHexString;
    input: PrefixedHexString;
    nonce: ValidTypes;
    to: PrefixedHexString | null;
    transactionIndex: ValidTypes | null;
    value: ValidTypes;
    v: ValidTypes;
    r: PrefixedHexString;
    s: PrefixedHexString;
};

export type EthLog =
    | PrefixedHexString[]
    | {
          removed: boolean;
          logIndex: ValidTypes | null;
          transactionIndex: ValidTypes | null;
          transactionHash: PrefixedHexString | null;
          blockHash: PrefixedHexString | null;
          blockNumber: ValidTypes | null;
          address: PrefixedHexString;
          data: PrefixedHexString;
          topics: PrefixedHexString[];
      };

export type CompiledSolidity = {
    code: PrefixedHexString;
    info: {
        source: string;
        language: string;
        languageVersion: string;
        compilerVersion: string;
        abiDefinition: any[];
        userDoc: {
            methods: { [key: string]: any };
        };
        developerDoc: {
            methods: { [key: string]: any };
        };
    };
};
