
const baseConfig = require('./base.config.js');

module.exports =  {
    ... baseConfig,
   
    entryPoints: [
        "./packages/web3-eth-accounts/src/account.ts",
        //utils
        "./packages/web3-utils/src/converters.ts",
        "./packages/web3-utils/src/hash.ts",
        "./packages/web3-utils/src/validation.ts",
        "./packages/web3-utils/src/random.ts",
        "./packages/web3-utils/src/string_manipulation.ts",
        "./packages/web3-utils/src/uuid.ts",
        //ABI
         "./packages/web3-eth-abi/src/api/functions_api.ts",
         "./packages/web3-eth-abi/src/eip_712.ts",
         "./packages/web3-eth-abi/src/api/errors_api.ts",
         "./packages/web3-eth-abi/src/api/events_api.ts",
         "./packages/web3-eth-abi/src/api/logs_api.ts",
        "./packages/web3-eth-abi/src/api/parameters_api.ts"
    ],
   
    mergeModulesMergeMode: "module", // NEW option of TypeDoc added by typedoc-plugin-merge-modules plugin
    cleanOutputDir: false,
    
};
