import './style.css';
import { Web3 } from 'web3';

const web3 = new Web3('https://eth.llamarpc.com');

//create a new account
const account = web3.eth.accounts.create();
console.log('Account:', account);

//hash message
//"\\x19Ethereum Signed Message:\\n" + message.length + message
const hash = web3.eth.accounts.hashMessage('Hello web3');

//sign message
const signature = account.sign('Hello web3');

// For more methods: https://docs.web3js.org/libdocs/Accounts

document.querySelector('#app').innerHTML = `
Account address: ${account.address} <br> 
Account PrivateKey: ${account.privateKey} <br> 
Hash: ${hash} <br> 
Signature: ${signature.signature}
`;
