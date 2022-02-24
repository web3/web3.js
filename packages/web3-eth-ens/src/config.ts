export const registryContractAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

// https://docs.ens.domains/contract-developer-guide/writing-a-resolver
// resolver interface Ids
export const interfaceIds: { [T: string]: string } = {
	addr: '0x3b3b57de',
	name: '0x691f3431',
	abi: '0x2203ab56',
	pubkey: '0xc8690233',
	text: '0x59d1d43c',
	contenthash: '0xbc1c58d1',
};

// functions list supported in resolver interfaces
export const methodsInInterface: { [T: string]: string } = {
	setAddr: 'addr',
	addr: 'addr',
	setPubkey: 'pubkey',
	pubkey: 'pubkey',
	setContenthash: 'contenthash',
	contenthash: 'contenthash',
};
