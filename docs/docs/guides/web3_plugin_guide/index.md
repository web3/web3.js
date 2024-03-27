---
sidebar_position: 1
sidebar_label: 'Getting started'
---

# Getting Started

Welcome to the web3.js Plugins Guide, an exciting new feature introduced in web3.js v4! In addition to the core web3.js libraries, plugins bring specialized functionalities tailored for end-users (functionalities that you, as a developer, can create). These enhancements may involve creating wrappers for specific contracts, adding extra features to RPC methods, or extending the capabilities of web3.js methods. Dive in and explore this innovative addition to web3.js v4!

- [Plugin Developer Guide (For Creators)](/guides/web3_plugin_guide/plugin_authors)
- [Plugin User Guide (Usage)](/guides/web3_plugin_guide/plugin_users)

- You can find all the web3 plugins🧩 [here](https://web3js.org/plugins) 

- To list your web3 plugin🧩 into the web3js.org/plugins page, you can submit a PR [here](https://github.com/web3/web3js-landing/blob/main/src/pluginList.ts)

## Create a plugin

```javascript
//1. import the `Web3PluginBase` module
const { Web3PluginBase } = require("web3");

//2. Create a Class extending the `Web3Pluginbase`
class MyPlugin extends Web3PluginBase {
    
    //3. Add a name to the plugin
    pluginNamespace = "pluginExample"; 

    //4. Createa any methods with your desired functionality
    async doSomething(){
        console.log("Hello web3!");
        //send transactions
        //initialize contracts
        //deploy or interact with contracts
        //add your own library, logic or functionality
        //much more...
    }
}

module.exports = MyPlugin;
```

## Use a plugin

```javascript
//1. import the plugin and web3 module
const { Web3 } = require("web3");
const MyPlugin = require("./plugin");

//2. Initialize the web3 instance
const web3 = new Web3("https://eth.llamarpc.com");

//3. Register plugin to add the current Web3Context
web3.registerPlugin(new MyPlugin());

//4. Use the plugin methods
web3.pluginExample.doSomething();
//--> Hello web3!
```

## Using web3 packages on the plugin

### Import eth module
Here you will find a file `plugin.js` with the plugin code and a `usage.js` file with the example usage, feel free to navigate between both files.

<iframe width="100%" height="700px" src="https://stackblitz.com/edit/vitejs-vite-ujbf9d?embed=1&file=plugin.js&showSidebar=1"></iframe>   

### Import utils module
Here you will find a file `plugin.js` with the plugin code and a `usage.js` file with the example usage, feel free to navigate between both files.

<iframe width="100%" height="700px" src="https://stackblitz.com/edit/vitejs-vite-snkfuk?embed=1&file=plugin.js&showSidebar=1"></iframe>   


