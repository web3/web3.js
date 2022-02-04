import { isHexStrict, sha3Raw } from "web3-utils"

export class ENS {
    private eth: string;
    private registryAddress: string;
    constructor(eth:string){
        this.eth = eth;
    }

    // TODO in registry issue
    public getResolver(name: string): Promise < boolean> { 
        return new Promise<boolean>(() => { return name === name}) 
    }

    // TODO in registry issue
    public setResolver(): boolean {
        return true;
    }


    public supportsInterface(name: string, interfaceId: string): boolean{
        this.getResolver(name).then((resolver) =>  {
            if (!isHexStrict(interfaceId)) {
                interfaceId = sha3Raw(interfaceId).slice(0,10);
            }
    
            return resolver.methods.supportsInterface(interfaceId).call(callback);
        })
        return true;
    }

    // TODO in registry
    public setSubnodeRecord (): boolean { return true };

    // TODO in registry
    public setApprovalForAll (): boolean { return true };

    // TODO in registry
    public isApprovedForAll (): boolean { return true };
    
    // TODO in registry
    public recordExists (): boolean { return true };

    // TODO in registry
    public setSubnodeOwner (): boolean { return true };

    // TODO in registry
    public getTTL (): boolean { return true };

    // TODO in registry
    public setTTL (): boolean { return true };

    // TODO in registry
    public getOwner (): boolean { return true };

    // TODO in registry
    public setOwner (): boolean { return true };

    // TODO in registry
    public getAddress (): boolean { return true };
}