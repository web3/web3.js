# web3-core

This is a sub package of [web3.js][repo]

The ```web3-core-package``` contains core functions for [web3.js][repo] packages. This package should be used
if someone wants to implement a new web3 package. 

If you implement your own web3 package then don't forget to add the ```setProvider()``` method to the parent object. 
This because the default behaviour of ```setProvider()``` is that the parent object will also set the provider of the child packages if this method is called.

Provided interface of AbstractWeb3Object:

- ```extend(methods: Object):void ``` Extends the current object with additional RPC methods.
- ```setProvider(provider: any):void ``` This method will set the current provider of this object.
- ```clearSubscriptions():void ``` This method will clear all subscriptions
- ```proxyHandler(target, name): any``` This method will be used for the RPC method handling in the Proxy object. This method can be overwritten if you want to change the default behaviour of the Proxy.
- ```BatchRequest``` With this property we provide the possibility to create batch requests. Please have a look on the official [documentation][docs] for further information.
- ```givenProvider``` This property contains the detected provider.
- ```currentProvider``` This property contains the current provider of this object.
- ```methodController``` This property is an instance of ```MethodController```. This will be used to execute an RPC request. For further information please have a look on the ```MethodController``` in the ```web3-core-method``` package.
- ```methodModelFactory``` This property is an instance of ```AbstractMethodModelFactory```. If this property is given then it will create an "MethodProxy". Please have a look on the ```web3-core-method```readme file for further information.

## Installation

### Node.js

```bash
npm install web3-core-package
```

## Usage

```js
// in node.js
var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;

function MyObject (
    provider,
    providersPackage,
    methodController, // optional
    methodModelFactory // optional
) {
    AbstractWeb3Object.call(
        this,
        provider,
        providersPackage,
        methodController, // optional
        methodModelFactory // optional
    );
};

// Inherit from AbstractWeb3Object
MyObject.prototype = Object.create(AbstractWeb3Object.prototype);
MyObject.prototype.constructor = MyObject;
```

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
