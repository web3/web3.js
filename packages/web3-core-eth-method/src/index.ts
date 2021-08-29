

// export function isBlockTag(value: BlockIdentifier): boolean {
//     return Object.values(BlockTags).includes(value as BlockTags);
// }

// /**
//      * Returns the current client version
//      * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
//      * @returns {Promise} Client version
//      */
// export async function getClientVersion(
//     requestArguments?: Partial<Eth1RequestArguments>
// ): Promise<RpcStringResult> {
//     try {
//         return (await this.provider.request({
//             ...requestArguments,
//             method: 'web3_clientVersion',
//             params: [],
//         })) as RpcResponse;
//     } catch (error) {
//         throw error;
//     }
// }