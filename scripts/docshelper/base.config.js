module.exports = {
    entryPointStrategy: "expand",
    out: "./docs/docs/libdocs/",

    // "exclude": [
    //     "**/*.test.ts"
    // ],
    plugin: [
        "typedoc-plugin-markdown",
        "typedoc-plugin-merge-modules"
    ],

    mergeModulesRenameDefaults: true, // NEW option of TypeDoc added by typedoc-plugin-merge-modules plugin

    hideInPageTOC: true,
    hideBreadcrumbs: true,
    hidePageTitle: true,

    //publicPath: "https://docs.web3js.org/libdocs/",
    //filenameSeparator : "-",
    //indexTitle: "",
    //preserveAnchorCasing: true,
    disableSources:true,
    excludeExternals: true,
    excludeReferences: true,
    tsconfig: "./docs/tsconfig.docs.json",
    excludeNotDocumented: true,
    
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
