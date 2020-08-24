module.exports = [
    {
        'name': 'getVersion',
        'call': 'shh_version',
        'params': 0
    },
    {
        'name': 'getInfo',
        'call': 'shh_info',
        'params': 0
    },
    {
        'name': 'setMaxMessageSize',
        'call': 'shh_setMaxMessageSize',
        'params': 1
    },
    {
        'name': 'setMinPoW',
        'call': 'shh_setMinPoW',
        'params': 1
    },
    {
        'name': 'markTrustedPeer',
        'call': 'shh_markTrustedPeer',
        'params': 1
    },
    {
        'name': 'newKeyPair',
        'call': 'shh_newKeyPair',
        'params': 0
    },
    {
        'name': 'addPrivateKey',
        'call': 'shh_addPrivateKey',
        'params': 1
    },
    {
        'name': 'deleteKeyPair',
        'call': 'shh_deleteKeyPair',
        'params': 1
    },
    {
        'name': 'hasKeyPair',
        'call': 'shh_hasKeyPair',
        'params': 1
    },
    {
        'name': 'getPublicKey',
        'call': 'shh_getPublicKey',
        'params': 1
    },
    {
        'name': 'getPrivateKey',
        'call': 'shh_getPrivateKey',
        'params': 1
    },
    {
        'name': 'newSymKey',
        'call': 'shh_newSymKey',
        'params': 0
    },
    {
        'name': 'addSymKey',
        'call': 'shh_addSymKey',
        'params': 1
    },
    {
        'name': 'generateSymKeyFromPassword',
        'call': 'shh_generateSymKeyFromPassword',
        'params': 1
    },
    {
        'name': 'hasSymKey',
        'call': 'shh_hasSymKey',
        'params': 1
    },
    {
        'name': 'getSymKey',
        'call': 'shh_getSymKey',
        'params': 1
    },
    {
        'name': 'deleteSymKey',
        'call': 'shh_deleteSymKey',
        'params': 1
    },

    {
        'name': 'newMessageFilter',
        'call': 'shh_newMessageFilter',
        'params': 1
    },
    {
        'name': 'getFilterMessages',
        'call': 'shh_getFilterMessages',
        'params': 1
    },
    {
        'name': 'deleteMessageFilter',
        'call': 'shh_deleteMessageFilter',
        'params': 1
    },

    {
        'name': 'post',
        'call': 'shh_post',
        'params': 1,
        'inputFormatter': [null]
    },

    {
        'name': 'unsubscribe',
        'call': 'shh_unsubscribe',
        'params': 1
    }
]
