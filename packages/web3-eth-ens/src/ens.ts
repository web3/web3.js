import { Address } from 'web3-utils';
import { NonPayableCallOptions, TransactionReceipt } from 'web3-eth-contract';
import { Registry } from './registry';

export class ENS {
    public registryAddress: string;
    private registry: Registry;

    constructor(){
        this.registry = new Registry();
        this.registryAddress = "";
    }

    /**
    * Returns the Resolver by the given address
    */
    public getResolver(name: string): Promise <boolean> { 
        return new Promise<boolean>(() => { return this.registry.getResolver(name)}) 
    }

    /**
    * set the resolver of the given name
    */
    public setResolver(name: string, address: Address, txConfig: NonPayableCallOptions): Promise<TransactionReceipt> {
        return this.registry.setResolver(name, address, txConfig);
    }


    // TODO finish in resolver
    public supportsInterface(): Promise <boolean>{
        return new Promise<boolean>(() => true)
    }

    /**
    * Sets the owner, resolver and TTL for a subdomain, creating it if necessary.
    */
    public setSubnodeRecord (name: string, label: string, owner: Address, resolver: Address, ttl: string, txConfig: NonPayableCallOptions): Promise<TransactionReceipt> { return this.registry.setSubnodeRecord(name, label, owner, resolver, ttl, txConfig);};

    /**
    * Sets or clears an approval by the given operator.
    */
    public setApprovalForAll (operator: Address, approved: boolean, txConfig: NonPayableCallOptions): Promise<TransactionReceipt> { return this.registry.setApprovalForAll(operator, approved, txConfig) };

    /**
    * Returns true if the operator is approved
    */
    public isApprovedForAll (owner: Address, operator: Address): Promise<unknown> { return this.registry.isApprovedForAll(owner, operator); };
    
    /**
    * Returns true if the record exists
    */
    public recordExists (name: string): Promise<unknown> { return this.registry.recordExists(name); };

    /**
    * Returns the address of the owner of an ENS name.
    */
    public setSubnodeOwner (name: string, label: string, address: Address, txConfig: NonPayableCallOptions): Promise<TransactionReceipt> { return this.registry.setSubnodeOwner(name, label, address, txConfig); };

    /**
    * Returns the address of the owner of an ENS name.
    */
    public getTTL (name: string): Promise<unknown> { return this.registry.getTTL(name) };

    /**
    * Returns the address of the owner of an ENS name.
    */
    public setTTL (name: string, ttl: string, txConfig: NonPayableCallOptions): Promise<TransactionReceipt> { return this.registry.setTTL(name, ttl, txConfig) };

    /**
    * Returns the owner by the given name and current configured or detected Registry
    */
    public getOwner (name: string): Promise<unknown> { return this.registry.getOwner(name) };

    /**
    * Returns the address of the owner of an ENS name.
    */
    public setOwner (name: string, address: Address, txConfig: NonPayableCallOptions): Promise<TransactionReceipt> { return this.registry.setOwner(name, address, txConfig) };

    // TODO in resolver
    public getAddress () { return true };

    // TODO in resolver
    public setAddress (): boolean { return true };

    // TODO in resolver
    public getPubkey (): boolean { return true };

    // TODO in resolver
    public setPubkey (): boolean { return true };

    // TODO in resolver
    public getContent (): boolean { return true };

    // TODO in resolver
    public setContent (): boolean { return true };

    // TODO in resolver
    public getContentHash (): boolean { return true };

    // TODO in resolver
    public setContentHash (): boolean { return true };

    // TODO in resolver
    public getMultiHash (): boolean { return true };

    // TODO in resolver
    public setMultiHash (): boolean { return true };

    // TODO after eth.net.getNetworkType is complete
    public checkNetwork (): boolean { 
        return true;
     };
}