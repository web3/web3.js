import { getPublicKey } from 'ethereum-cryptography/secp256k1';

const fromPrivate = (privateKey: string) => {
	const publicKey = getPublicKey(privateKey);
};

const entropy = (): string => {
	const a = '';
	return a;
};
