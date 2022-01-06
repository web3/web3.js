import {
	fromUtf8,
	hexToNumber,
	hexToNumberString,
	isAddress,
	isHexStrict,
	Numbers,
	numberToHex,
	sha3Raw,
	toChecksumAddress,
	toNumber,
	toUtf8,
	utf8ToHex,
} from 'web3-utils';
import { isBlockTag } from 'web3-validator';
import { FormatterError } from './errors';
import {
	Proof,
	TransactionInput,
	TransactionOutput,
	ReceiptInput,
	ReceiptOutput,
	BlockInput,
	BlockOutput,
	PostOutput,
	PostInput,
	SyncInput,
	SyncOutput,
	Mutable,
	LogsInput,
	LogsOutput,
} from './types';

/**
 * Will format the given storage key array values to hex strings.
 */
export const inputStorageKeysFormatter = (keys: Array<string>) => keys.map(numberToHex);

/**
 * Will format the given proof response from the node.
 */
export const outputProofFormatter = (proof: Proof): Proof => ({
	address: toChecksumAddress(proof.address),
	nonce: hexToNumberString(proof.nonce),
	balance: hexToNumberString(proof.balance),
});

/**
 * Should the format output to a big number
 */
export const outputBigIntegerFormatter = (number: Numbers) => toNumber(number);

/**
 * Returns the given block number as hex string or the predefined block number 'latest', 'pending', 'earliest', 'genesis'
 */
export const inputBlockNumberFormatter = (blockNumber: Numbers | undefined) => {
	if (blockNumber === undefined) {
		return undefined;
	}

	if (typeof blockNumber === 'string' && isBlockTag(blockNumber)) {
		return blockNumber;
	}

	if (blockNumber === 'genesis') {
		return '0x0';
	}

	if (typeof blockNumber === 'string' && isHexStrict(blockNumber)) {
		return blockNumber.toLowerCase();
	}

	return numberToHex(blockNumber);
};

/**
 * Returns the given block number as hex string or does return the defaultBlock property of the current module
 */
export const inputDefaultBlockNumberFormatter = (
	blockNumber: Numbers | undefined,
	defaultBlock: Numbers,
) => {
	if (!blockNumber) {
		return inputBlockNumberFormatter(defaultBlock);
	}

	return inputBlockNumberFormatter(blockNumber);
};

export const inputAddressFormatter = (address: string): string | never => {
	// TODO: Implement IBAN address scheme logic below.

	// const iban = new Iban(address);
	// if (iban.isValid() && iban.isDirect()) {
	// 	return iban.toAddress().toLowerCase();
	// } else if (utils.isAddress(address)) {
	// 	return '0x' + address.toLowerCase().replace('0x', '');
	// }

	if (isAddress(address)) {
		return `0x${address.toLowerCase().replace('0x', '')}`;
	}

	throw new FormatterError(
		`Provided address ${address} is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted.`,
	);
};

/**
 * Formats the input of a transaction and converts all values to HEX
 */
export const txInputOptionsFormatter = (options: TransactionInput): Mutable<TransactionOutput> => {
	const modifiedOptions = { ...options } as unknown as Mutable<TransactionOutput>;

	if (options.to) {
		// it might be contract creation
		modifiedOptions.to = inputAddressFormatter(options.to);
	}

	if (options.data && options.input) {
		throw new FormatterError(
			'You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.',
		);
	}

	if (!options.data && options.input) {
		modifiedOptions.data = options.input;
		delete modifiedOptions.input;
	}

	if (options.data && !options.data.startsWith('0x')) {
		modifiedOptions.data = `0x${options.data}`;
	}

	if (modifiedOptions.data && !isHexStrict(modifiedOptions.data)) {
		throw new FormatterError('The data field must be HEX encoded data.');
	}

	// allow both
	if (options.gas || options.gasLimit) {
		modifiedOptions.gas = toNumber(options.gas ?? options.gasLimit);
	}

	if (options.maxPriorityFeePerGas || options.maxFeePerGas) {
		delete modifiedOptions.gasPrice;
	}

	['gasPrice', 'gas', 'value', 'maxPriorityFeePerGas', 'maxFeePerGas', 'nonce']
		.filter(key => modifiedOptions[key] !== undefined)
		.forEach(key => {
			modifiedOptions[key] = numberToHex(modifiedOptions[key] as Numbers);
		});

	return modifiedOptions as TransactionOutput;
};

/**
 * Formats the input of a transaction and converts all values to HEX
 */
export const inputCallFormatter = (options: TransactionInput, defaultAccount?: string) => {
	const opts = txInputOptionsFormatter(options);

	const from = opts.from ?? defaultAccount;

	if (from) {
		opts.from = inputAddressFormatter(from);
	}

	return opts;
};

/**
 * Formats the input of a transaction and converts all values to HEX
 */
export const inputTransactionFormatter = (options: TransactionInput, defaultAccount?: string) => {
	const opts = txInputOptionsFormatter(options);

	// check from, only if not number, or object
	if (!(typeof opts.from === 'number') && !(!!opts.from && typeof opts.from === 'object')) {
		opts.from = opts.from ?? defaultAccount;

		if (!options.from && !(typeof options.from === 'number')) {
			throw new FormatterError('The send transactions "from" field must be defined!');
		}

		opts.from = inputAddressFormatter(options.from);
	}

	return opts;
};

/**
 * Hex encodes the data passed to eth_sign and personal_sign
 */
export const inputSignFormatter = (data: string) => (isHexStrict(data) ? data : utf8ToHex(data));

/**
 * Formats the output of a transaction to its proper values
 *
 * @method outputTransactionFormatter
 * @param {Object} tx
 * @returns {Object}
 */
export const outputTransactionFormatter = (tx: TransactionInput): TransactionOutput => {
	const modifiedTx = { ...tx } as unknown as Mutable<TransactionOutput>;

	if (tx.blockNumber) {
		modifiedTx.blockNumber = hexToNumber(tx.blockNumber);
	}

	if (tx.transactionIndex) {
		modifiedTx.transactionIndex = hexToNumber(tx.transactionIndex);
	}

	modifiedTx.nonce = hexToNumber(tx.nonce);
	modifiedTx.gas = hexToNumber(tx.gas);

	if (tx.gasPrice) {
		modifiedTx.gasPrice = outputBigIntegerFormatter(tx.gasPrice);
	}

	if (tx.maxFeePerGas) {
		modifiedTx.maxFeePerGas = outputBigIntegerFormatter(tx.maxFeePerGas);
	}

	if (tx.maxPriorityFeePerGas) {
		modifiedTx.maxPriorityFeePerGas = outputBigIntegerFormatter(tx.maxPriorityFeePerGas);
	}

	if (tx.type) {
		modifiedTx.type = hexToNumber(tx.type);
	}

	modifiedTx.value = outputBigIntegerFormatter(tx.value);

	if (tx.to && isAddress(tx.to)) {
		// tx.to could be `0x0` or `null` while contract creation
		modifiedTx.to = toChecksumAddress(tx.to);
	} else {
		modifiedTx.to = undefined; // set to `null` if invalid address
	}

	if (tx.from) {
		modifiedTx.from = toChecksumAddress(tx.from);
	}

	return modifiedTx;
};

/**
 * Formats the output of a log
 *
 * @method outputLogFormatter
 * @param {Object} log object
 * @returns {Object} log
 */
export const outputLogFormatter = (log: Partial<LogsInput>): LogsOutput => {
	const modifiedLog = { ...log } as unknown as Mutable<LogsOutput>;

	// generate a custom log id
	if (
		typeof log.blockHash === 'string' &&
		typeof log.transactionHash === 'string' &&
		typeof log.logIndex === 'string'
	) {
		const shaId = sha3Raw(
			`${log.blockHash.replace('0x', '')}${log.transactionHash.replace(
				'0x',
				'',
			)}${log.logIndex.replace('0x', '')}`,
		);
		modifiedLog.id = `log_${shaId.replace('0x', '').substr(0, 8)}`;
	} else if (!log.id) {
		modifiedLog.id = undefined;
	}

	if (log.blockNumber) {
		modifiedLog.blockNumber = hexToNumber(log.blockNumber);
	}
	if (log.transactionIndex) {
		modifiedLog.transactionIndex = hexToNumber(log.transactionIndex);
	}

	if (log.logIndex) {
		modifiedLog.logIndex = hexToNumber(log.logIndex);
	}

	if (log.address) {
		modifiedLog.address = toChecksumAddress(log.address);
	}

	return modifiedLog;
};

/**
 * Formats the output of a transaction receipt to its proper values
 */
export const outputTransactionReceiptFormatter = (receipt: ReceiptInput): ReceiptOutput => {
	if (typeof receipt !== 'object') {
		throw new FormatterError(`Received receipt is invalid: ${String(receipt)}`);
	}
	const modifiedReceipt = { ...receipt } as unknown as Mutable<ReceiptOutput>;

	if (receipt.blockNumber) {
		modifiedReceipt.blockNumber = hexToNumber(receipt.blockNumber);
	}

	if (receipt.transactionIndex) {
		modifiedReceipt.transactionIndex = hexToNumber(receipt.transactionIndex);
	}

	modifiedReceipt.cumulativeGasUsed = hexToNumber(receipt.cumulativeGasUsed);
	modifiedReceipt.gasUsed = hexToNumber(receipt.gasUsed);

	if (receipt.logs && Array.isArray(receipt.logs)) {
		modifiedReceipt.logs = receipt.logs.map(outputLogFormatter);
	}

	if (receipt.contractAddress) {
		modifiedReceipt.contractAddress = toChecksumAddress(receipt.contractAddress);
	}

	if (receipt.status) {
		modifiedReceipt.status = Boolean(parseInt(receipt.status, 10));
	}

	return modifiedReceipt;
};

/**
 * Formats the output of a block to its proper values
 *
 * @method outputBlockFormatter
 * @param {Object} block
 * @returns {Object}
 */
export const outputBlockFormatter = (block: BlockInput): BlockOutput => {
	const modifiedBlock = { ...block } as unknown as Mutable<BlockOutput>;

	// transform to number
	modifiedBlock.gasLimit = hexToNumber(block.gasLimit);
	modifiedBlock.gasUsed = hexToNumber(block.gasUsed);
	modifiedBlock.size = hexToNumber(block.size);
	modifiedBlock.timestamp = hexToNumber(block.timestamp);

	if (block.number) {
		modifiedBlock.number = hexToNumber(block.number);
	}

	if (block.difficulty) {
		modifiedBlock.difficulty = outputBigIntegerFormatter(block.difficulty);
	}

	if (block.totalDifficulty) {
		modifiedBlock.totalDifficulty = outputBigIntegerFormatter(block.totalDifficulty);
	}

	if (block.transactions && Array.isArray(block.transactions)) {
		modifiedBlock.transactions = block.transactions.map(outputTransactionFormatter);
	}

	if (block.miner) {
		modifiedBlock.miner = toChecksumAddress(block.miner);
	}

	if (block.baseFeePerGas) {
		modifiedBlock.baseFeePerGas = hexToNumber(block.baseFeePerGas);
	}

	return modifiedBlock;
};

/**
 * Formats the input of a whisper post and converts all values to HEX
 */
export const inputPostFormatter = (post: PostOutput): PostInput => {
	const modifiedPost = { ...post } as unknown as Mutable<PostInput>;

	if (post.ttl) {
		modifiedPost.ttl = numberToHex(post.ttl);
	}

	if (post.workToProve) {
		modifiedPost.workToProve = numberToHex(post.workToProve);
	}

	if (post.priority) {
		modifiedPost.priority = numberToHex(post.priority);
	}

	// fallback
	if (post.topics && !Array.isArray(post.topics)) {
		modifiedPost.topics = post.topics ? [post.topics] : [];
	}

	// format the following options
	modifiedPost.topics = modifiedPost.topics?.map(topic =>
		topic.startsWith('0x') ? topic : fromUtf8(topic),
	);

	return modifiedPost;
};

/**
 * Formats the output of a received post message
 *
 * @method outputPostFormatter
 * @param {Object}
 * @returns {Object}
 */
export const outputPostFormatter = (post: PostInput): PostOutput => {
	const modifiedPost = { ...post } as unknown as Mutable<PostOutput>;

	if (post.expiry) {
		modifiedPost.expiry = hexToNumber(post.expiry);
	}

	if (post.sent) {
		modifiedPost.sent = hexToNumber(post.sent);
	}

	if (post.ttl) {
		modifiedPost.ttl = hexToNumber(post.ttl);
	}

	if (post.workProved) {
		modifiedPost.workProved = hexToNumber(post.workProved);
	}

	// post.payloadRaw = post.payload;
	// post.payload = utils.hexToAscii(post.payload);

	// if (utils.isJson(post.payload)) {
	//     post.payload = JSON.parse(post.payload);
	// }

	// format the following options
	if (!post.topics) {
		modifiedPost.topics = [];
	}

	modifiedPost.topics = modifiedPost.topics?.map(toUtf8);

	return modifiedPost;
};

export const outputSyncingFormatter = (result: SyncInput): SyncOutput => {
	const modifiedResult = { ...result } as unknown as Mutable<SyncOutput>;

	modifiedResult.startingBlock = hexToNumber(result.startingBlock);
	modifiedResult.currentBlock = hexToNumber(result.currentBlock);
	modifiedResult.highestBlock = hexToNumber(result.highestBlock);

	if (result.knownStates) {
		modifiedResult.knownStates = hexToNumber(result.knownStates);
	}

	if (result.pulledStates) {
		modifiedResult.pulledStates = hexToNumber(result.pulledStates);
	}

	return modifiedResult;
};
