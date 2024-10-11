---
sidebar_position: 3
sidebar_label: 'Gas and Priority Fees'
---

# Gas and Priority Fees

To prevent spam and reward node operators, Ethereum uses a mechanism called ["gas"](https://ethereum.org/en/gas/), which is a cost that is charged to execute a transaction. Gas costs are associated with all transactions that require computation or update state (e.g. transferring tokens from one account to another). Gas costs are not applied to requests that only involve reading state (e.g. querying the balance of an account). The amount of gas required to pay for a transaction is calculated based on the actual computational actions that are required to execute that transaction. For instance, a simple transaction to transfer ETH from one account to another will require less gas than invoking a complicated smart contract function that involves lots of computation and storage. The cost of gas varies based on network usage. Gas costs more during period of high network activity. The cost per unit of gas is known as the "base fee".

In addition to the calculated gas cost, an Ethereum transaction can specify an optional priority fee, which is an additional fee that is paid directly to the operator of the node that executes the transaction. Priority fees are intended to incentive node operators to execute transactions. A priority fee is specified as a value in addition to the base fee, which means that the total cost of the priority fee is always a factor of the amount of gas required to execute a transaction.

With the above in mind, the total cost of fees associated with a transaction is calculated as follows:

Total cost of fees = _units of gas used \* (base fee + priority fee)_

## Estimating Gas

The Ethereum JSON-RPC specifies the [`eth_estimateGas` method](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas), which accepts a transaction and returns an estimate of the amount of gas required to execute that transaction. The transaction will not be executed and added to the blockchain. The estimate may be different (typically more) than the amount of gas actually used by the transaction for a variety of reasons, including EVM mechanics, node performance, and changes to the state of a smart contract. To invoke the `eth_estimateGas` RPC method, use the [`Web3Eth.estimateGas` method](/api/web3-eth/class/Web3Eth#estimateGas) and provide the [`Transaction`](/api/web3-types/interface/Transaction) for which to estimate gas.

Web3.js transactions may specify a gas limit (the maximum amount of gas they are able to consume) by providing the [`Transaction.gas` property](/api/web3/namespace/types#gas). If the specified gas limit is less than the actual amount of gas required to execute the transaction, the transaction will consume an amount of gas equal to the gas limit, which is not refunded, before failing and reverting any state changes made by the transaction.

```ts
const transactionDraft: Transaction = {
	from: '<SENDER ADDRESS>',
	to: '<RECEIVER ADDRESS>',
	value: web3.utils.ethUnitMap.ether,
};

const gas: bigint = await web3.eth.estimateGas(transactionDraft);

const transaction: Transaction = {
	...transactionDraft,
	gas,
};
```

## Calculating Fees

Web3.js exposes a helper, the [`Web3Eth.calculateFeeData` method](/api/web3-eth/class/Web3Eth#calculateFeeData), that can be used to intelligently calculate the value of the base and priority fees to specify for a transaction. `Web3Eth.calculateFeeData` accepts two optional parameters: `baseFeePerGasFactor` (default value: 2) and `alternativeMaxPriorityFeePerGas` (default value: 1 gwei). Both optional parameters are used in calculating the `maxFeePerGas`, which is described below. The return type of `Web3Eth.calculateFeeData` implements the [`FeeData` interface](/api/web3/namespace/types/#FeeData), which specifies four values:

-   `baseFeePerGas`: base fee from the last block
-   `gasPrice`: result of the [`eth_gasPrice` RPC method](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice) (legacy purposes only)
-   `maxPriorityFeePerGas`: result of the [`eth_maxPriorityFeePerGas` RPC method](https://github.com/ethereum/execution-apis/blob/4140e528360fea53c34a766d86a000c6c039100e/src/eth/fee_market.yaml#L29-L42)
-   `maxFeePerGas`: calculated as `baseFeePerGas * baseFeePerGasFactor + (maxPriorityFeePerGas ?? alternativeMaxPriorityFeePerGas)`

Web3.js transactions may specify `maxFeePerGas` and `maxPriorityFeePerGas` values. If both values are specified, `maxFeePerGas` must be greater than or equal to `maxPriorityFeePerGas`. If `maxFeePerGas` is less than the current base fee, the transaction will not execute until the base fee drops to a value that is less than or equal to the `maxFeePerGas`.

```ts
const transactionDraft: Transaction = {
	from: '<SENDER ADDRESS>',
	to: '<RECEIVER ADDRESS>',
	value: web3.utils.ethUnitMap.ether,
};

const feeData: FeeData = await web3.eth.calculateFeeData();

const transaction: Transaction = {
	...transactionDraft,
	maxFeePerGas: feeData.maxFeePerGas,
	maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
};
```

## Generating Access Lists

An access list specifies the addresses and storage keys that a transaction plans to access. Specifying these elements in advance makes a transaction's gas costs more predictable.

The Ethereum JSON-RPC specifies the [`eth_createAccessList` method](https://github.com/ethereum/execution-apis/blob/4140e528360fea53c34a766d86a000c6c039100e/src/eth/execute.yaml#L54-L97), which accepts a transaction and returns an object that lists the addresses and storage keys that the transaction will access, as well as the approximate gas cost for the transaction if the access list is included. The transaction will not be executed and added to the blockchain. To invoke the `eth_createAccessList` RPC method, use the [`Web3Eth.createAccessList` method](/api/web3-eth/function/createAccessList) and provide the [`TransactionForAccessList`](/api/web3-types/interface/TransactionForAccessList) for which to generate the access list.

Web3.js transactions may specify an access list by providing the [`Transaction.accessList` property](/api/web3/namespace/types#accessList).

```ts
const transactionDraft: TransactionForAccessList = {
	from: '<SENDER ADDRESS>',
	to: '<RECEIVER ADDRESS>',
	value: web3.utils.ethUnitMap.ether,
};

const accessListResult: AccessListResult = await web3.eth.createAccessList(transactionDraft);

const transaction: Transaction = {
	...transactionDraft,
	accessList: accessListResult.accessList,
	gas: accessListResult.gasUsed,
};
```

## Smart Contract Fees

The following example demonstrates specifying fee data and creating an access list for a transaction that invokes a [smart contract](/guides/smart_contracts/smart_contracts_guide) function:

```ts
const transfer: NonPayableMethodObject = erc20.methods.transfer(receiver.address, 1);

const transferOpts: NonPayableCallOptions = { from: sender.address };
const accessListResult: AccessListResult = await transfer.createAccessList(transferOpts);
const transactionDraft: Transaction = transfer.populateTransaction(transferOpts);

const feeData: FeeData = await web3.eth.calculateFeeData();

const transferTxn: Transaction = {
	...transactionDraft,
	maxFeePerGas: feeData.maxFeePerGas,
	maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
	accessList: accessListResult.accessList,
	gas: accessListResult.gasUsed,
};

const receipt: TransactionReceipt = await web3.eth.sendTransaction(transferTxn);
```
