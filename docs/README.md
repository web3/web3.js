# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.
### Requirement

Before getting started, ensure that you have ``Yarn`` installed on your machine.

[How to install Yarn](https://www.hostinger.com/tutorials/how-to-install-yarn)
### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.


### How to add tabs for Programming Languages

At the top of the `.md` file, ensure having the following: 

```js
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Use the following snippet for tabs:

<pre>
<xmp lang=html>
<Tabs groupId="prog-lang" queryString>

  <TabItem value="javascript" label="JavaScript"
  	attributes={{className: "javascript-tab"}}>

```javascript
const { Web3 } = require('web3');
// ...
```

  </TabItem>
  
  <TabItem value="typescript" label="TypeScript" default 
  	attributes={{className: "typescript-tab"}}>

```typescript
import { Web3 } from 'web3';
// ...
```

  </TabItem>
</Tabs>
</xmp>
</pre>

Notes: 
- This will put the TypeScript tab as the default. However, if the tutorial steps does not involve installing and configuring TypeScript, put the `default` attribute on the JavaScript tab instead.
- The attribute `groupId="prog-lang"` ensure that whenever the user press on a tab, all other tabs in the page will switch to the same selected tab.
- The attribute `queryString` is used to let the user easily share with the selected tab preserved.
- The attributes `attributes={{className: "javascript-tab"}}` and `attributes={{className: "typescript-tab"}}` will give the tabs a unified design that uses the official colors of JavaScript and TypeScript.
- If you get an error like `Uncaught runtime errors`, after you added the tabs: be sure to delete all unnecessary spaces, namely any space after <TabItem ...> and before the code block, and keep only new-line character. This is to keep it just like the code snippet above.