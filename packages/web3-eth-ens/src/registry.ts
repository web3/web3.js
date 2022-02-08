import { PromiEvent, inputAddressFormatter } from 'web3-common';
import { Contract, NonPayableCallOptions } from 'web3-eth-contract';
import { Address, isHexStrict, sha3Raw } from 'web3-utils';
import { REGISTRY as registryABI } from './ABI/Registry';
import { namehash } from './utils';
import { ENS } from './ens';

export class Registry {
    private ens: ENS;
    private contract: Contract<typeof registryABI>;
    constructor(ens: ENS) {
        // TODO when eth.net is finished we can check network 
        this.contract = new Contract(registryABI);
        this.ens = ens;
    }
    public getOwner(name: string){
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.owner(namehash(name)).call().then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public setOwner(name: string, address: Address, txConfig: NonPayableCallOptions): Promise<unknown> {
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.setOwner(namehash(name), inputAddressFormatter(address)).send(txConfig).then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public getTTL(name: string) {
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.getTTL(namehash(name)).call().then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public setTTL(name: string, ttl: string, txConfig: NonPayableCallOptions) { // ttl should be bytes32
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.setTTL(namehash(name), ttl).call(txConfig).then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public setSubnodeOwner(name: string, label: string, address: Address, txConfig: NonPayableCallOptions) { // ttl should be bytes32
        
        const hexStrictLabel = !isHexStrict(label) ? sha3Raw(label): label;
    
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.setSubnodeOwner(namehash(name), hexStrictLabel, inputAddressFormatter(address)).send(txConfig).then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public setSubnodeRecord(name: string, label: string, owner: Address, resolver: Address, ttl: string, txConfig: NonPayableCallOptions) { // ttl should be bytes32
        
        const hexStrictLabel = !isHexStrict(label) ? sha3Raw(label): label;
    
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.setSubnodeRecord(namehash(name), hexStrictLabel, inputAddressFormatter(owner), inputAddressFormatter(resolver), ttl).send(txConfig).then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public setApprovalForAll(operator: string, approved: boolean, txConfig: NonPayableCallOptions) { // ttl should be bytes32
        
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.setApprovalForAll(operator, approved).send(txConfig).then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public isApprovalForAll(owner: Address, operator: Address) { // ttl should be bytes32
        
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.isApprovalForAll(inputAddressFormatter(owner), inputAddressFormatter(operator)).call().then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public recordExists(name: string) { // ttl should be bytes32
        
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.recordExists(namehash(name)).call().then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public getResolver(name: string) { // ttl should be bytes32
        
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.getResolver(namehash(name)).call().then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public setResolver(name: string, address: Address, txConfig: NonPayableCallOptions) { // ttl should be bytes32
        
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.getResolver(namehash(name), inputAddressFormatter(address)).send(txConfig).then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }
}