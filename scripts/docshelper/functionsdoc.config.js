
const baseConfig = require('./base.config.js');

module.exports =  {
    ... baseConfig,
   
    entryPoints: [
        "./packages/web3-eth-accounts/src/account.ts",
        //utils
        "./packages/web3-utils/src/converters.ts",
        "./packages/web3-utils/src/hash.ts"
    ],
   
    mergeModulesMergeMode: "module", // NEW option of TypeDoc added by typedoc-plugin-merge-modules plugin
    cleanOutputDir: false,
    
};
