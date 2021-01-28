Hello welcome to web3.js in house packages

This read me is temporary and will either be update or removed when rewrite is complete for now I'm using it just to document this concern:

please only add completed packages here I don't want to bring over 1.x packages into here without being updated!

this way it's very obvious whats going on





### Notes:

#### Base/Croe:

the addProviders function originally in web3-core has been removed from the now base class and functionality needs to be added in web3 package if deemed necessary

```js
 static addProviders (pkg) {
    pkg.givenProvider = Manager.givenProvider;
    pkg.providers = Manager.providers;
  }
```


setRequest is no longer a method. The idea is to only have one request manager and then just change the provider not ever change the request manager

#### Request manager:

setProvider now will return on first exection line if no provider or net object is provided

setting the provider will never result in provider being set as null


#### todo's:

- [ ] migrate over errors `require('web3-core-helpers').errors`