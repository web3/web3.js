import { getPublicKey } from 'ethereum-cryptography/secp256k1';
import { HexString } from './types'
const fromPrivate = (privateKey: string) => {
	const publicKey = getPublicKey(privateKey);
};

const create = (entropy: HexString ): string => {
	const a = '';
	return a;
};
