
function ProviderAdapterResolver (provider) {
    this.providerAdapter = this.resolveProvider(provider);
}


ProviderAdapterResolver.prototype.resolveProvider = function () {
    // Check if http ws ipc or ethereum provider
    // Instantiate the correct provider and set it to this.provider
    // autodetect provider
    // if(p && typeof p === 'string' && this.providers) {
    //
    //     // HTTP
    //     if(/^http(s)?:\/\//i.test(p)) {
    //         p = new this.providers.HttpProvider(p);
    //
    //     // WS
    //     } else if(/^ws(s)?:\/\//i.test(p)) {
    //         p = new this.providers.WebsocketProvider(p);
    //
    //     // IPC
    //     } else if(p && typeof net === 'object'  && typeof net.connect === 'function') {
    //         p = new this.providers.IpcProvider(p, net);
    //
    //     } else if(p) {
    //         throw new Error('Can\'t autodetect provider for "'+ p +'"');
    //     }
    // }
};

ProviderAdapterResolver.prototype.getProvider = function () {
    return this.provider;
};
