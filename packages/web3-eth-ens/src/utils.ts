import { sha3Raw } from 'web3-utils';
import { toAscii } from 'idna-uts46-hx';

export const normalize = (name: string) =>
	toAscii(name, { useStd3ASCII: true, transitional: false, verifyDnsLength: false });

export const namehash = (inputName: string) => {
	// Reject empty names:
	let node = '';
	for (let i = 0; i < 32; i += 1) {
		node += '00';
	}
	const name = normalize(inputName);

	if (name) {
		const labels = name.split('.');

		for (let i = labels.length - 1; i >= 0; i -= 1) {
			const labelSha = sha3Raw(labels[i]).slice(2);
			node = sha3Raw(`0x${node}${labelSha}`).slice(2);
		}
	}

	return `0x${node}`;
};
