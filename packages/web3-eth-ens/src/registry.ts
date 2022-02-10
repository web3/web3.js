import { inputAddressFormatter, ReceiptInfo } from 'web3-common';
import { Contract, NonPayableCallOptions, TransactionReceipt } from 'web3-eth-contract';
import { Address, isHexStrict, sha3Raw } from 'web3-utils';
import { REGISTRY as registryABI } from './ABI/Registry';
import { namehash } from './utils';

export class Registry {
    private contract: Contract<typeof registryABI>;
    constructor() {
        // TODO when eth.net is finished we can check network 
        this.contract = new Contract(registryABI);
    }
    public getOwner(name: string): Promise<[string]>{
        const promise = new Promise<[string]>((resolve, reject) => {
            this.contract.methods.owner(namehash(name)).call().then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public setOwner(name: string, address: Address, txConfig: NonPayableCallOptions): Promise<ReceiptInfo> {
        const promise = new Promise<ReceiptInfo>((resolve, reject) => {
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

    public setTTL(name: string, ttl: string, txConfig: NonPayableCallOptions): Promise<ReceiptInfo> { 
        const promise = new Promise<ReceiptInfo>((resolve, reject) => {
            this.contract.methods.setTTL(namehash(name), ttl).send(txConfig).then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public setSubnodeOwner(name: string, label: string, address: Address, txConfig: NonPayableCallOptions): Promise<ReceiptInfo> { 
        
        const hexStrictLabel = !isHexStrict(label) ? sha3Raw(label): label;
    
        const promise = new Promise <TransactionReceipt>((resolve, reject) => {
            this.contract.methods.setSubnodeOwner(namehash(name), hexStrictLabel, inputAddressFormatter(address)).send(txConfig).then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public setSubnodeRecord(name: string, label: string, owner: Address, resolver: Address, ttl: string, txConfig: NonPayableCallOptions): Promise<ReceiptInfo>  {
        
        const hexStrictLabel = !isHexStrict(label) ? sha3Raw(label): label;
    
        const promise = new Promise <ReceiptInfo>((resolve, reject) => {
            this.contract.methods.setSubnodeRecord(namehash(name), hexStrictLabel, inputAddressFormatter(owner), inputAddressFormatter(resolver), ttl).send(txConfig).then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public setApprovalForAll(operator: string, approved: boolean, txConfig: NonPayableCallOptions): Promise<ReceiptInfo> { 
        
        const promise = new Promise <ReceiptInfo>((resolve, reject) => {
            this.contract.methods.setApprovalForAll(operator, approved).send(txConfig).then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public isApprovedForAll(owner: Address, operator: Address) {
        
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.isApprovedForAll(inputAddressFormatter(owner), inputAddressFormatter(operator)).call().then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public recordExists(name: string) {
        
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.recordExists(namehash(name)).call().then(bool => {
                resolve(bool)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public getResolver(name: string) {
        
        const promise = new Promise((resolve, reject) => {
            this.contract.methods.getResolver(namehash(name)).call().then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }

    public setResolver(name: string, address: Address, txConfig: NonPayableCallOptions): Promise<ReceiptInfo> {
        
        const promise = new Promise<ReceiptInfo>((resolve, reject) => {
            this.contract.methods.getResolver(namehash(name), inputAddressFormatter(address)).send(txConfig).then(receipt => {
                resolve(receipt)
            }).catch(() => {
                reject('error');
            })
        })
        return promise;
    }
}