/*
 This file is part of web3.js.

 web3.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 web3.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file MethodFactory.jsauthor Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {
    AbstractMethodModelFactory,
    ShhVersionMethodModel,
    GetInfoMethodModel,
    SetMaxMessageSizeMethodModel,
    SetMinPoWMethodModel,
    MarkTrustedPeerMethodModel,
    NewKeyPairMethodModel,
    AddPrivateKeyMethodModel,
    DeleteKeyPairMethodModel,
    HasKeyPairMethodModel,
    GetPublicKeyMethodModel,
    GetPrivateKeyMethodModel,
    NewSymKeyMethodModel,
    AddSymKeyMethodModel,
    GenerateSymKeyFromPasswordMethodModel,
    HasSymKeyMethodModel,
    GetSymKeyMethodModel,
    DeleteSymKeyMethodModel,
    NewMessageFilterMethodModel,
    GetFilterMessagesMethodModel,
    DeleteMessageFilterMethodModel,
    PostMethodModel
} from 'web3-core-method';

export default class MethodModelFactory extends AbstractMethodModelFactory {
    /**
     * @param {Object} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        super(
            {
                getVersion: ShhVersionMethodModel,
                getInfo: GetInfoMethodModel,
                setMaxMessageSize: SetMaxMessageSizeMethodModel,
                setMinPoW: SetMinPoWMethodModel,
                markTrustedPeer: MarkTrustedPeerMethodModel,
                newKeyPair: NewKeyPairMethodModel,
                addPrivateKey: AddPrivateKeyMethodModel,
                deleteKeyPair: DeleteKeyPairMethodModel,
                hasKeyPair: HasKeyPairMethodModel,
                getPublicKey: GetPublicKeyMethodModel,
                getPrivateKey: GetPrivateKeyMethodModel,
                newSymKey: NewSymKeyMethodModel,
                addSymKey: AddSymKeyMethodModel,
                generateSymKeyFromPassword: GenerateSymKeyFromPasswordMethodModel,
                hasSymKey: HasSymKeyMethodModel,
                getSymKey: GetSymKeyMethodModel,
                deleteSymKey: DeleteSymKeyMethodModel,
                newMessageFilter: NewMessageFilterMethodModel,
                getFilterMessages: GetFilterMessagesMethodModel,
                deleteMessageFilter: DeleteMessageFilterMethodModel,
                post: PostMethodModel
            },
            utils,
            formatters
        );
    }
}
