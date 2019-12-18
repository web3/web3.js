import ConfigurationTypes from "¥./ConfigurationTypes";
import EthereumConfiguration from "../../internal/ethereum/src/config/EthereumConfiguration";
import web3 from "../index";

const ConfigurationMap = {
    [ConfigurationTypes.ETHEREUM]: EthereumConfiguration
};

export default function (type?: ConfigurationTypes, config?: any) {
    if (!type) {
        return web3.config;
    }
    
    if (!config) {
        config = web3.config[type];

        if (!config) {
            throw new Error('Missing configuration!');
        }

        return config;
    }

    if (config === web3.config[type]) {
        return config;
    }

    return new ConfigurationMap[type](Object.assign(config, web3.config[type].toJSON()))
}
