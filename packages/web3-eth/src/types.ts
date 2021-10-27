// TODO Move to web3-common
export type HexString = string;
export type NumberString = string;
export type DesiredReturnType = HexString | number | NumberString | bigint;

interface EthSyncingIsSyncing<ReturnType = HexString> {
    startingBlock: ReturnType,
    currentBlock: ReturnType,
    highestBlock: ReturnType
}
type EthSyncingNotSyncing = Boolean;
export type EthSyncingResponse<ReturnType = HexString> = EthSyncingIsSyncing<ReturnType> | EthSyncingNotSyncing;
