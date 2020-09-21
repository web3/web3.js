export interface IBeaconChainAttestationsParams {
    epoch?: string,
    genesisEpoch?: boolean,
    pageSize?: number,
    pageToken?: string
}

export interface IBeaconChainAttestationsResponse {
    attestations: [
        {
          aggregationBits: string,
          data: {
            slot: string,
            committeeIndex: string,
            beaconBlockRoot: string,
            source: {
              epoch: string,
              root: string
            },
            target: {
              epoch: string,
              root: string
            }
          },
          signature: string
        }
      ],
      nextPageToken: string,
      totalSize: number
}
