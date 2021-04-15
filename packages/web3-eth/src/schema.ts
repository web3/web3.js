import { BaseAPISchema, } from 'web3-internal-base/types';

export const DefaultSchema: BaseAPISchema = {
  packageName: 'eth',
  methodPrefix: 'eth_',
  methods: [
    {
      name: 'getBlockNumber',
      method: 'blockNumber',
      restMethod: 'post',
      inputFormatter: null,
      outputFormatter: null,
      errors: null,
      errorPrefix: 'Failed to get block number:',
    },
  ],
  // packageName: 'eth',
  // routePrefix: '/',
  // methods: [
  //   {
  //     name: 'getBlockNumber',
  //     route: 'eth_blockNumber',
  //     restMethod: 'get',
  //     inputFormatter: null,
  //     outputFormatter: null,
  //     errors: null,
  //     errorPrefix: 'Failed to get block number:',
  //   },
  // ],
};
