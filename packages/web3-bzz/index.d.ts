/**
 * @file index.d.ts
 * @author Josh Stevens <josh.stevens@hotmail.co.uk>
 * @date 2018
 */

export declare class Bzz {
    pick(): Object | boolean;
    download(bzzHash: string, localPath: string): Promise<Buffer|Object|string>;
    upload(data: string | Buffer | Uint8Array | Object): Promise<string>;
    isAvailable(): Promise<boolean>;
    hasProvider(): boolean;
    throwProviderError();
    setProvider(provider: Object | string): boolean;
}
