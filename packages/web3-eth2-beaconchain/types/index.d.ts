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

export interface IBeaconChainAttestationsStreamResponse {
  result: {
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
  },
  error: {
    grpcCode: number,
    httpCode: number,
    message: string,
    httpStatus: string,
    details: [
      {
        typeUrl: string,
        value: string
      }
    ]
  }
}

export interface IBeaconChainAttestationsIndexedResponse {
  indexedAttestations: [
    {
      attestingIndices: [
        string
      ],
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

export interface IBeaconChainAttestationsIndexedStreamResponse {
  result: {
    attestingIndices: [
      string
    ],
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
  },
  error: {
    grpcCode: number,
    httpCode: number,
    message: string,
    httpStatus: string,
    details: [
      {
        typeUrl: string,
        value: string
      }
    ]
  }
}

export interface IBeaconChainAttestationsPoolParams {
  pageSize?: number,
  pageToken?: string
}

export interface IBeaconChainBlocksParams {
  root: string,
  slot: string,
  epoch: string,
  genesis?: boolean,
  pageSize?: number,
  pageToken?: string
}

export interface IBeaconChainBlocksResponse {
  blockContainers: [
    {
      block: {
        block: {
          slot: string,
          proposerIndex: string,
          parentRoot: string,
          stateRoot: string,
          body: {
            randaoReveal: string,
            eth1Data: {
              depositRoot: string,
              depositCount: string,
              blockHash: string
            },
            graffiti: string,
            proposerSlashings: [
              {
                header1: {
                  header: {
                    slot: string,
                    proposerIndex: string,
                    parentRoot: string,
                    stateRoot: string,
                    bodyRoot: string
                  },
                  signature: string
                },
                header2: {
                  header: {
                    slot: string,
                    proposerIndex: string,
                    parentRoot: string,
                    stateRoot: string,
                    bodyRoot: string
                  },
                  signature: string
                }
              }
            ],
            attesterSlashings: [
              {
                attestation1: {
                  attestingIndices: [
                    string
                  ],
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
                },
                attestation2: {
                  attestingIndices: [
                    string
                  ],
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
              }
            ],
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
            deposits: [
              {
                proof: [
                  string
                ],
                data: {
                  publicKey: string,
                  withdrawalCredentials: string,
                  amount: string,
                  signature: string
                }
              }
            ],
            voluntaryExits: [
              {
                exit: {
                  epoch: string,
                  validatorIndex: string
                },
                signature: string
              }
            ]
          }
        },
        signature: string
      },
      blockRoot: string
    }
  ],
  nextPageToken: string,
  totalSize: number
}

export interface IBeaconChainChainHeadResponse {
  headSlot: string,
  headEpoch: string,
  headBlockRoot: string,
  finalizedSlot: string,
  finalizedEpoch: string,
  finalizedBlockRoot: string,
  justifiedSlot: string,
  justifiedEpoch: string,
  justifiedBlockRoot: string,
  previousJustifiedSlot: string,
  previousJustifiedEpoch: string,
  previousJustifiedBlockRoot: string
}

export interface IBeaconChainConfigResponse {
  config: {
    additionalProp1: string,
    additionalProp2: string,
    additionalProp3: string
  }
}
