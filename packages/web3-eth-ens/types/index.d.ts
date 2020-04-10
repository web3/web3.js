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

// Minimum TypeScript Version: 3.0

import { PromiEvent, TransactionConfig, TransactionReceipt } from 'web3-core';
import { TransactionRevertInstructionError } from 'web3-core-helpers';
import { Eth } from 'web3-eth';
import { Contract } from 'web3-eth-contract';

// TODO: Define as soon as implemented the generic contract
export class Ens {
    constructor(eth: Eth);

    registryAddress: string | null;
    registry: Registry;

    /**
     * @deprecated This callback signature is deprecated
     */
    supportsInterface(
        name: string,
        interfaceId: string,
        callback?: (value: any) => void
    ): Promise<boolean>;
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
    /**
     * @deprecated Please use the "getResolver" method instead of "resolver"
     */
    resolver(
        name: string,
        callback?: (value: any) => void
    ): Promise<Contract>;

    /**
     * @deprecated This callback signature is deprecated
     */
    getResolver(
        name: string,
        callback?: (value: any) => void
    ): Promise<Contract>;
    getResolver(
        name: string,
        callback?: (error: Error, contract: Contract) => void
    ): Promise<Contract>;

    setResolver(
        name: string,
        address: string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>

    setSubnodeOwner(
        name: string,
        label: string,
        address: string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>

    setRecord(
        name: string,
        owner: string,
        resolver: string,
        ttl: number | string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>

    setSubnodeRecord(
        name: string,
        label: string,
        owner: string,
        resolver: string,
        ttl: number | string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>

    setApprovalForAll(
        operator: string,
        approved: boolean,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>

    /**
     * @deprecated This callback signature is deprecated
     */
    isApprovedForAll(
        owner: string,
        operator: string,
        callback?: (value: any) => void
    ): Promise<boolean>;
    isApprovedForAll(
        owner: string,
        operator: string,
        callback?: (error: Error, result: boolean) => void
    ): Promise<boolean>;

    /**
     * @deprecated This callback signature is deprecated
     */
    recordExists(
        name: string,
        callback?: (value: any) => void
    ): Promise<boolean>;
    recordExists(
        name: string,
        callback?: (error: Error, result: boolean) => void
    ): Promise<boolean>;

    /**
     * @deprecated This callback signature is deprecated
     */
    getTTL(
        name: string,
        callback?: (value: any) => void
    ): Promise<string>;
    getTTL(
        name: string,
        callback?: (error: Error, ttl: string) => void
    ): Promise<string>;

    setTTL(
        name: string,
        ttl: string | number,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>;

    /**
     * @deprecated This callback signature is deprecated
     */
    getOwner(
        name: string,
        callback?: (value: any) => void
    ): Promise<string>;
    getOwner(
        name: string,
        callback?: (error: Error, owner: string) => void
    ): Promise<string>;

    setOwner(
        name: string,
        address: string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>;

    /**
     * @deprecated This callback signature is deprecated
     */
    getAddress(
        name: string,
        callback?: (value: any) => void
    ): Promise<string>;
    getAddress(
        name: string,
        callback?: (error: Error, address: string) => void
    ): Promise<string>;

    setAddress(
        name: string,
        address: string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>;

    /**
     * @deprecated This callback signature is deprecated
     */
    getPubkey(
        name: string,
        callback?: (value: any) => void
    ): Promise<{ [x: string]: string }>;
    getPubkey(
        name: string,
        callback?: (error: Error, result: { [x: string]: string }) => void
    ): Promise<{ [x: string]: string }>;

    setPubkey(
        name: string,
        x: string,
        y: string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>;

    /**
     * @deprecated This callback signature is deprecated
     */
    getText(
        name: string,
        key: string,
        callback?: (value: any) => void
    ): Promise<string>;
    getText(
        name: string,
        key: string,
        callback?: (error: Error, ensName: string) => void
    ): Promise<string>;

    setText(
        name: string,
        key: string,
        value: string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>;

    /**
     * @deprecated This callback signature is deprecated
     */
    getContent(
        name: string,
        callback?: (value: any) => void
    ): Promise<string>;
    getContent(
        name: string,
        callback?: (error: Error, contentHash: string) => void
    ): Promise<string>;

    setContent(
        name: string,
        hash: string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>;

    /**
     * @deprecated This callback signature is deprecated
     */
    getMultihash(
        name: string,
        callback?: (value: any) => void
    ): Promise<string>;
    getMultihash(
        name: string,
        callback?: (error: Error, multihash: string) => void
    ): Promise<string>;

    setMultihash(
        name: string,
        hash: string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>;

    /**
     * @deprecated This callback signature is deprecated
     */
    getContenthash(
        name: string,
        callback?: (value: any) => void
    ): Promise<string>;
    getContenthash(
        name: string,
        callback?: (error: Error, contenthash: string) => void
    ): Promise<string>;

    setContenthash(
        name: string,
        hash: string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>;
}

export class Registry {
    constructor(ens: Ens);

    ens: Ens;

    contract: Contract | null;

    /**
     * @deprecated Please use the "getOwner" method instead of "owner"
     */
    owner(
        name: string,
        callback?: (error: Error, address: string) => void
    ): Promise<string>;
    /**
     * @deprecated Please use the "getOwner" method instead of "owner"
     */
    owner(
        name: string,
        callback?: (value: any) => void
    ): Promise<string>;

    /**
     * @deprecated This callback signature is deprecated
     */
    getOwner(
        name: string,
        callback?: (value: any) => void
    ): Promise<string>;
    getOwner(
        name: string,
        callback?: (error: Error, address: string) => void
    ): Promise<string>;

    setOwner(
        name: string,
        address: string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>;

    /**
     * @deprecated This callback signature is deprecated
     */
    getTTl(
        name: string,
        callback?: (value: any) => void
    ): Promise<string>;
    getTTl(
        name: string,
        callback?: (error: Error, ttl: string) => void
    ): Promise<string>;

    setTTL(
        name: string,
        ttl: string | number,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>;

    setSubnodeOwner(
        name: string,
        label: string,
        address: string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>

    /**
     * @deprecated Please use the "getResolver" method instead of "resolver"
     */
    resolver(
        name: string,
        callback?: (error: Error, contract: Contract) => void
    ): Promise<Contract>;
    /**
     * @deprecated Please use the "getResolver" method instead of "resolver"
     */
    resolver(
        name: string,
        callback?: (value: any) => void
    ): Promise<Contract>;

    /**
     * @deprecated This callback signature is deprecated
     */
    getResolver(
        name: string,
        callback?: (value: any) => void
    ): Promise<Contract>;
    getResolver(
        name: string,
        callback?: (error: Error, contract: Contract) => void
    ): Promise<Contract>;

    setResolver(
        name: string,
        address: string,
        txConfig?: TransactionConfig,
        callback?: (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
}
