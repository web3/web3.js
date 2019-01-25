export default class MethodProxy {
    constructor(target) {
        return new Proxy(target, {
            get: (target, name) => {
                return target[name];
            }
        });
    }
}
