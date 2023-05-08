---
sidebar_label: 'Infer Contract Types from JSON Artifact'
---

# Infer Contract Types from JSON Artifact

Web3.js is a popular library used for interacting with EVM blockchains. One of its key features is the ability to invoke EVM smart contracts deployed on the blockchain. In this blog post, we will show how to interact with the smart contract in typescript, with a special focus on how to infer types from JSON artifact files.

Before we dive into the problem, let's take a quick look at the problem. Web3.js provides a simple and convenient way to interact with Solidity contracts. To use Web3.js to interact with a Solidity contract, you need to know the contract's address and the ABI (Application Binary Interface) of the contract. The ABI is JSON data that contains the definition of the functions in the contract, including their, name, input parameters and return values.

Web3.js uses ABI type to dynamically load available methods and events but Typescript currently [doesn't support loading JSON as const](https://github.com/microsoft/TypeScript/issues/32063). If you go to the [Playground Link](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAhgIwJYwLwwNoCga5gbxz1wCIkwAHAVyghIC5MjjdCWWywoBTAJzDgAbACoBPCtwYwS0XuQDmJADTN20gQFtJjEpu4B9ZavYko47dNkKSxvAF8VagreKce-IWIlSZUOWEVHJ3U4LR8IUQ0EEEFDIKdTc3C-axcYO1sAXXi8XzgeAFkaRCRBJDMfMHAKOFFEQUkc0jNvHVBIPypgKBBeG2IHVTYOOCqwSJAqOkYAMyEIbibpcmpaKWwnYYTyABNuAA9uHalOxbTScncBESSdOB2d3m4IOiXXPR8QAHcwPiNg6QtCwke6PZ50NKDTbnZZgPaHY6MU5vXKXPjXLzA0FPF7-YK6ULAiASOF-FHNW7SbHg-pqKFqLZqTjwo5SOaCBbk2FXTyUkhUS4AJgArAA2PEJD46ABuQiojRhiVa0gFXBF4shWSWBLCOgAghQKLwQLLBBLckCfNxpdwuLTcPTWLYQWMJlM2fMziYVjRpkxoQDmQdWUjePKuW50bzlSCHjjXoqpdIZsaNOaTJa7nGaZCUYzvaSEScw178WiPDcY9TcRGk6YQOmOJmqdncbm0vmOLtg4iYOzOYryxi+aqoOrG+9CT5TfKJxaR0KxfaWBl2NlnXXhLxRhAZmTnc2SNbbVBl47nAXVn6NgzB1wo5Wsa2E4G699fn0I4fqxCnOfiJ2rhDtGT5gjWiZTjoxK2nsn6Kt+z7LgMWobpBVKCII3yjMAComJMUBXusHZ3jyj4+KO461mhJBzhSMYUUumprtq0D5NwRRQCUZQVDKSDcF8jZKsCMxUGA3RIOAZ45J2nCEYwN7sIBqL3hWmI+D+tEhLqlgkrBmlCepiHtgGZYqcO9GLuKVHaSCGiTHaX4LmqjF-ihJh1nAhrGjagn4XJ-q3oGwFkTo0QxPpdb6YeYVmkxLDriYrGFMUyDcaIlTVLU9S4U2fIiWJUASWAUlDM6PprPJxFBWZIGGWBL74h5wCgKJp6OVWRmucxqE2QgQjYdwADyMy+TQ-kKSwSkXDVIUqpZEXUVFTlji5dJuRwSXsSlpTlOlvH8YJh75eJkmqOeMnldeCUcHWezAEgGjzKNBG+kRJnbDNak6KOAAcC02UtFlcH9cXENdribRxXG7dOfECdqR2iSdxVndJZWUK9lXvUywVfS29X-USun7oGCEE8ZgWmaReP8vN1lElQCB+HA3RHAAanKOUJIeDEal18Xard3DAE8cALHqGFYWJXO5H5mMBYpJEPjTMWEz4gPAqroN4ODuSQ9taUZZQWUIA0h15UjhWnQMaOXvLE0AUrql8hp9PhMTcGky7nV0nmTvmcCvNq1mew7Bzgizu1gfzdruC66QdbkCL3Bi9wEuYV8A3PeNVVU8rfKq27Ogaz4Wv82DLGcclnGpTDOhjDUdSmzLdHCZbRUlY7dsVZg8dacCHzanLPcO3gU3cvnMZWAEwfSCXUEpDPscwH3eTV9DPHSNKcPmzGx1WyjNuld3V2C9RERROFQ9jfbucfdTfLT4EEEA1HyT+Ioy+r-rNc7ZvJDbwOgjC2BUO6o2Pl2DGI9V51h6JxQQABlKghpBDpWvi9Eed8cafWWpRF+wJ55zWcnzNa3VEpVy2r-Q2+14YHhAcjTuY90Y52xgWB+HUCZF0BA2N+Id4xIXsH7aq7Do7ENnrZeybV4K4NWuwVcAserAmZpAPcnsODD2vFgthk9NYgCvvg9WvDpBl1IQo8hbEoa13-g3E2ZtgF73btbQRECgJQM0awyBIi6r8K4SQFMIA0xGNjOTP8Qi87Ow4T4gxOgeiEOCfwimithE6PInTaJVI7KtTiUHL+Z8bLKN3HwAAYqmbOt8PGuK8aFPRZpfFxJMXI9aEMKGWL-ntdQmUm52LoQ40BTiHREEyPACAMB2jQAANxAA) and choose ".d.ts" you can check type difference with and without `as const`.

```typescript
import { Contract, Web3 } from 'web3';
import ERC20 from './node_modules/@openzeppelin/contracts/build/contracts/ERC20.json';

(async function () {
	const web3 = new Web3('rpc url');

	const contract = new Contract(ERC20.abi, '0x7af963cF6D228E564e2A0aA0DdBF06210B38615D', web3);

	const holder = '0xa8F6eB216e26C1F7d924A801E46eaE0CE8ed1A0A';

	//Error because Contract doesn't know what methods exists
	const balance = await contract.methods.balanceOf(holder).call();
})();
```

To work around it you need to copy abi into a Typescript file like this:

```typescript
import {Contract, Web3} from "web3";


const ERC20 = [
    ...
    // "as const" is important part, without it typescript would create generic type and remove available methods from type
] as const;

(async function() {
    const web3 = new Web3("rpc url")

    const contract = new Contract(ERC20, "0x7af963cF6D228E564e2A0aA0DdBF06210B38615D", web3)

    const holder = "0xa8F6eB216e26C1F7d924A801E46eaE0CE8ed1A0A"

    //Works now
    const balance = await contract.methods.balanceOf(holder).call()
})()
```

Now it's working but it also means that abi is no longer updated when you bump your npm dependencies.
To solve this problem, you can use a custom script that copies the JSON artifact of the contract into a TypeScript file as a const variable. This script can be run as part of your build process so that the TypeScript file is always up-to-date with the latest version of the contract's ABI.

Script:

```typescript title="gen.ts"
import fs from 'fs';
import path from 'path';

//read destination directory submitted as first param
var destination = process.argv.slice(2)[0];

//read all contract artifacts from artifacts.json which should be in the directoy from where script should be executed
const artifactContent = fs.readFileSync('./artifacts.json', 'utf-8');

const artifacts: string[] = JSON.parse(artifactContent);

(async function () {
	for (const artifact of artifacts) {
		let content;
		try {
			//try to import from node_modules
			content = JSON.stringify(await import(artifact));
		} catch (e) {
			//try to read as path on disc
			content = fs.readFileSync(artifact, 'utf-8');
		}
		const filename = path.basename(artifact, '.json');
		//create and write typescript file
		fs.writeFileSync(
			path.join(destination, filename + '.ts'),
			`const artifact = ${content.trimEnd()} as const; export default artifact;`,
		);
	}
})();
```

To use this script, just create an `artifacts.json` file at the root of your project with all the artifacts you are using.

```json title="artifacts.json"
[
	"@openzeppelin/contracts/build/contracts/ERC20.json",
	"@openzeppelin/contracts/build/contracts/ERC1155.json",
	"./build/contracts/MyContract.json"
]
```

and run the script with `node -r ts-node/register <script name>.ts <destination>` and you can then
use those generated files in your code:

```typescript
import { Contract, ContractAbi, Web3 } from 'web3';
import ERC20 from './artifacts/ERC20';

(async function () {
	const web3 = new Web3('https://goerli.infura.io/v3/fd1f29ab70844ef48e644489a411d4b3');

	const contract = new Contract(
		ERC20.abi as ContractAbi,
		'0x7af963cF6D228E564e2A0aA0DdBF06210B38615D',
		web3,
	);

	const holder = '0xa8F6eB216e26C1F7d924A801E46eaE0CE8ed1A0A';

	const balance = await contract.methods.balanceOf(holder).call();
	const ticker = await contract.methods.symbol().call();

	console.log(`${holder} as ${balance.toString()} ${ticker} tokens`);
})();
```

You can see full example at [https://github.com/web3/web3-contract-types-example](https://github.com/web3/web3-contract-types-example)
