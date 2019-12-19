import ConfigurationTypes from "./ConfigurationTypes";
import Configuration from "./Configuration";
import EthereumConfiguration from "../../internal/ethereum/src/config/EthereumConfiguration";
import web3 from "../index";

const ConfigurationMap = {
    [ConfigurationTypes.ETHEREUM]: EthereumConfiguration
};

/**
 * Returns the correctly mapped configuration object
 *
 * @function getConfig
 *
 * @param {ConfigurationTypes} type
 * @param {any} config
 */
export default function (type?: ConfigurationTypes, config?: any): any {
    // No configuration type
    if (!type) {
        // Overwrite properties from Configuration class with the passed config params
        if (config) {
            return new Configuration(config, web3.config.toJSON());
        }

        // Return default Configuration
        return web3.config;
    }

    // No overwrites
    if (!config) {
        // Get default config of the passed type
        config = web3.config[type];

        if (!config) {
            throw new Error("Configuration with type '" + type + "' doesn't exist.");
        }

        return config;
    }

    // Return default config if passed config is identical to it
    if (config === web3.config[type]) {
        return web3.config[type];
    }

    // Get default config by type and apply passed overwrites
    return new ConfigurationMap[type](config, web3.config[type].toJSON());
}
