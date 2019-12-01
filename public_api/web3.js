let configList = new Map();
let defaultConfig = null;

export default class web3 {
    /**
     * Getter for the current context
     *
     * @property current
     *
     * @returns {Context}
     */
    static get default() {
        return defaultConfig;
    }

    /**
     * Sets the default context of Web3
     *
     * @method init
     *
     * @param {String} name
     * @param {Context} context
     *
     * @returns {Boolean}
     */
    static init(name, context) {
        configList.set(name, context);
        defaultConfig = context;
    }

    /**
     * Returns the correct config by the given name
     *
     * @method get
     *
     * @param {String} name
     *
     * @returns {Context}
     */
    static get(name) {
        return configList.get(name);
    }

    /**
     * Sets the default config
     *
     * @method
     *
     *
     * @param name
     */
    static set(name) {
        defaultConfig = configList.get(name);
    }

    /**
     * Add's a config to the web3 namespace
     *
     * @method add
     *
     * @param {String} name
     * @param {Context} context
     */
    static add(name, context) {
        configList.set(name, context);
    }

    /**
     * Removes a config by the given name.
     *
     * @method remove
     *
     * @param {String} name
     */
    static remove(name) {
        configList.delete(name);
    }
}
