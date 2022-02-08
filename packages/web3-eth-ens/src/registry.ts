import { rejects } from 'assert/strict';
import { resolve } from 'path/posix';
import { PromiEvent } from 'web3-common';
import { Contract } from 'web3-eth-contract';
import { AbiInput } from 'web3-utils';
import { REGISTRY as registryABI } from './ABI/Registry';
import { namehash } from './utils';

class Registry {
    private ens;
    private contract;
    constructor() {
        this.contract = new Contract(registryABI)
    }
    public getOwner(name: string){
        const promiEvent = new PromiEvent(() => {
            const value = this.contract.then((contract: any) => {
                return contract.methods.owner(namehash(name)).call()
            })
            resolve(value);
        }).catch(() => {
            promiEvent.reject();
        })
        return promiEvent.eventEmitter;
        
        
    }
}