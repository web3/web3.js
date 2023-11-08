module.exports = {
    entryPointStrategy: "expand",
    entryPoints: [
        "./packages/web3-eth/src/web3_eth.ts",
        "./packages/web3-eth-accounts/src/wallet.ts",
        //"./packages/web3-eth-accounts/src/account.ts",
        "./packages/web3-eth-contract/src/contract.ts",
        "./packages/web3-eth-ens/src/ens.ts",
        "./packages/web3-eth-iban/src/iban.ts",
        "./packages/web3-eth-personal/src/personal.ts",
        "./packages/web3-net/src/net.ts"
    ],
    out: "./docs/docs/libdocs",
    // "exclude": [
    //     "**/*.test.ts"
    // ],
    plugin: [
        "typedoc-plugin-markdown",
        "typedoc-plugin-merge-modules"
    ],
    mergeModulesRenameDefaults: true, // NEW option of TypeDoc added by typedoc-plugin-merge-modules plugin
    mergeModulesMergeMode: "project", // NEW option of TypeDoc added by typedoc-plugin-merge-modules plugin
    
    excludeExternals: true,
    excludeReferences: true,
    hideBreadcrumbs: true,
    hideInPageTOC: true,
    tsconfig: "./docs/tsconfig.docs.json",
    excludeNotDocumented: true,
    cleanOutputDir: true,
    excludeNotDocumentedKinds: [
        "Namespace",
        "Enum",
        "EnumMember",
        "Variable",
        "Function",
        "Class",
        "Interface",
        "Constructor",
        "Property",
        "Method",
        "CallSignature",
        "IndexSignature",
        "ConstructorSignature",
        "Accessor",
        "GetSignature",
        "SetSignature",
        "TypeAlias",
        "Reference"
    ],
    excludeInternal: true,
    excludePrivate: true,
    excludeProtected: true,
    visibilityFilters: {
        "protected": false,
        "private": false,
        "inherited": false,
        "external": false
    }
};