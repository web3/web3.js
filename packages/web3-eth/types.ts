type blockIdentifier = number | 'latest' | 'earliest' | 'pending'

export interface Web3EthOptions {
    packageName?: string
    providerUrl: string
}

export interface EthAddressBlockParmeters {
    address: string
    block?: blockIdentifier
}

export interface EthGetStorageAtParameters extends EthAddressBlockParmeters {
    position: string
}

export interface BlockHashParameter {
    blockHash: string
}

export interface BlockIdentifierParameter {
    blockNumber: blockIdentifier
}

export interface EthSignParameters {
    address: string
    message: string
}

export interface EthTransaction {
    from: string
    to?: string
    gas?: BigInt
    gasPrice?: BigInt
    value?: BigInt
    data?: string
    nonce?: number
}
