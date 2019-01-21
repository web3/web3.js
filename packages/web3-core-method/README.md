# web3-core-method

This is a sub package of [web3.js][repo]

The Method module abstracts the JSON-RPC method and is used within most [web3.js][repo] packages.

## Installation

```bash
npm install web3-core-method
```

## Exported classes

 ``` js
 MethodModuleFactory
 AbstractMethod 
 AbstractMethodFactory
 
 /**
 * Methods
 */
 
 // Network
 GetProtocolVersionMethod 
 VersionMethod 
 ListeningMethod 
 PeerCountMethod 
 
 // Node
 GetNodeInfoMethod
 GetCoinbaseMethod
 IsMiningMethod 
 GetHashrateMethod
 IsSyncingMethod
 GetGasPriceMethod
 SubmitWorkMethod
 GetWorkMethod
 
 // Account
 GetAccountsMethod
 GetBalanceMethod
 GetTransactionCountMethod
 RequestAccountsMethod
 
 // Block
 GetBlockNumberMethod
 GetBlockMethod 
 GetUncleMethod 
 GetBlockTransactionCountMethod
 GetBlockUncleCountMethod
 
 // Transaction
 GetTransactionMethod
 GetTransactionFromBlockMethod
 GetTransactionReceipt
 SendRawTransactionMethod
 SignTransactionMethod
 SendTransactionMethod
 
 // Global
 GetCodeMethod
 SignMethod
 CallMethod
 GetStorageAtMethod
 EstimateGasMethod
 GetPastLogsMethod
 
 // Personal
 EcRecoverMethod
 ImportRawKeyMethod
 ListAccountsMethod
 LockAccountMethod
 NewAccountMethod
 PersonalSendTransactionMethod
 PersonalSignMethod
 PersonalSignTransactionMethod
 UnlockAccountMethod
 
 // SHH
 AddPrivateKeyMethod
 AddSymKeyMethod
 DeleteKeyPairMethod
 DeleteMessageFilterMethod
 DeleteSymKeyMethod
 GenerateSymKeyFromPasswordMethod
 GetFilterMessagesMethod
 GetInfoMethod
 GetPrivateKeyMethod
 GetPublicKeyMethod
 GetSymKeyMethod
 HasKeyPairMethod
 HasSymKeyMethod
 MarkTrustedPeerMethod
 NewKeyPairMethod
 NewMessageFilterMethod
 NewSymKeyMethod
 PostMethod
 SetMaxMessageSizeMethod
 SetMinPoWMethod
 ShhVersionMethod
```

## Types 

All the typescript typings are placed in the types folder. 

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
