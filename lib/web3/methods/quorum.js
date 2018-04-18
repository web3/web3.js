//#########################################################################################
// QUORUM FUNCTIONS
// Created by H.M Tran Diep - July 2017
// Add Quorum functions to the Web3 instance
//#########################################################################################

"use strict";

var formatters = require('../formatters');
var Method = require('../method');
var Property = require('../property');

function Quorum(web3) {
    this._requestManager = web3._requestManager;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });

    properties().forEach(function(p) {
        p.attachToObject(self);
        p.setRequestManager(self._requestManager);
    });
}

var methods = function () {
    var getNodeInfo = new Method({
        name: 'getNodeInfo',
        call: 'quorum_getNodeInfo',
        params: 0
    });

    var isBlockMaker = new Method({
        name: 'isBlockMaker',
        call: 'quorum_isBlockMaker',
        params: 1,
        inputFormatter: [formatters.inputAddressFormatter]
    });

    var isVoter = new Method({
        name: 'isVoter',
        call: 'quorum_isVoter',
        params: 1,
        inputFormatter: [formatters.inputAddressFormatter]
    });

    var makeBlock = new Method({
        name: 'makeBlock',
        call: 'quorum_makeBlock',
        params: 0
    });

    var vote = new Method({
        name: 'vote',
        call: 'quorum_vote',
        params: 0
    });

    var pauseBlockMaker = new Method({
        name: 'vote',
        call: 'quorum_pauseBlockMaker',
        params: 0
    });

    var resumeBlockMaker = new Method({
        name: 'vote',
        call: 'quorum_resumeBlockMaker',
        params: 0
    });

    var canonicalHash = new Method({
        name: 'canonicalHash',
        call: 'quorum_canonicalHash',
        params: 1,
        inputFormatter: [null]
    });

    return [
        getNodeInfo,
        isBlockMaker,
        isVoter,
        makeBlock,
        vote,
        pauseBlockMaker,
        resumeBlockMaker

    ];
};

var properties = function () {
    return [
        new Property({
            name: 'nodeInfo',
            getter: 'quorum_nodeInfo'
        })
    ];
};

module.exports = Quorum;
