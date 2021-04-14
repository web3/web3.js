import { BaseAPISchema } from 'web3-internal-base';

export const DefaultSchema: BaseAPISchema = {
  packageName: 'eth',
  routePrefix: '/',
  methods: [
    {
      name: 'getBlockNumber',
      route: 'eth_blockNumber',
      restMethod: 'get',
      inputFormatter: null,
      outputFormatter: null,
      errors: null,
      errorPrefix: 'Failed to get block number:',
    },
  ],
};
