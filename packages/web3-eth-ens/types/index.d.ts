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
 * @file index.d.ts
 * @author Samuel Furter <samuel@ethereum.org>, Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import { PromiEvent, TransactionConfig, TransactionReceipt } from 'web3-core';
import { TransactionRevertInstructionError } from 'web3-core-helpers';
import { Eth } from 'web3-eth';
import { Contract } from 'web3-eth-contract';

// TODO: Define as soon as implemented the generic contract
export class Ens {
    constructor(eth: Eth);

    registryAddress: string | null;
    registry: Registry;

    supportsInterface(
        name: string,
        interfaceId: string,
        callback?: (error: Error, supported: boolean) => void
    ): Promise<boolean>;

    /**
     * @deprecated Please use the "getResolver" method instead of "resolver"
     */
    resolver(
        name: string,
        callback?: (error: Error, contract: Contract) => void
    ): Promise<Contract>;

    getResolver(
        name: string,
        callback?: (error: Error, contract: Contract) => void
    ): Promise<Contract>;

    setResolver(
        name: string,
        address: string,
        sendOptions?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>

    setSubnodeOwner(
        name: string,
        label: string,
        address: string,
        sendOptions?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>

    getTTl(
        name: string,
        callback?: (error: Error, ttl: string) => void
    ): Promise<string>;

    setTTL(
        name: string,
        ttl: string | number,
        sendOptions?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>;

    getOwner(
        name: string,
        callback?: (error: Error, owner: string) => void
    ): Promise<string>;

    setOwner(
        name: string,
        address: string,
        sendOptions?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>;

    getAddress(
        name: string,
        callback?: (error: Error, address: string) => void
    ): Promise<string>;

    setAddress(
        name: string,
        address: string,
        sendOptions: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<any>;

    getPubkey(
        name: string,
        callback?: (error: Error, result: { [x: string]: string }) => void
    ): Promise<{ [x: string]: string }>;

    setPubkey(
        name: string,
        x: string,
        y: string,
        sendOptions: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<any>;

    getText(
        name: string,
        key: string,
        callback?: (error: Error, ensName: string) => void
    ): Promise<string>;

    setText(
        name: string,
        key: string,
        value: string,
        sendOptions: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<any>;

    getContent(
        name: string,
        callback?: (error: Error, contentHash: string) => void
    ): Promise<string>;

    setContent(
        name: string,
        hash: string,
        sendOptions: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<any>;

    getMultihash(
        name: string,
        callback?: (error: Error, multihash: string) => void
    ): Promise<string>;

    setMultihash(
        name: string,
        hash: string,
        sendOptions: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<any>;

    getContenthash(
        name: string,
        callback?: (error: Error, contenthash: string) => void
    ): Promise<string>;

    setContenthash(
        name: string,
        hash: string,
        sendOptions: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<any>;
}

export class Registry {
    constructor(ens: Ens);

    ens: Ens;

    contract: Contract | null;

    owner(
        name: string,
        callback?: (error: Error, address: string) => void
    ): Promise<string>;

    resolver(name: string): Promise<Contract>;
}
