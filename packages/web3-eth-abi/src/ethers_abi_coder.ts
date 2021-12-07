import { AbiCoder } from '@ethersproject/abi';

const ethersAbiCoder = new AbiCoder((type, value) => {
	if (
		/^u?int/.exec(type) &&
		!Array.isArray(value) &&
		// eslint-disable-next-line @typescript-eslint/ban-types
		(!(!!value && typeof value === 'object') || (value as Function).constructor.name !== 'BN')
	) {
		// Because of tye type def from @ethersproject/abi
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		return value.toString();
	}

	// Because of tye type def from @ethersproject/abi
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	return value;
});

export default ethersAbiCoder;
