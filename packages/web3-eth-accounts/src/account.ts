import { utils, getPublicKey } from 'ethereum-cryptography/secp256k1';
// import { scryptSync } from 'ethereum-cryptography/scrypt'
import { toChecksumAddress, bytesToHex, sha3Raw, HexString, randomBytes } from 'web3-utils';
import { pbkdf2Sync, createCipheriv } from 'crypto';
import { InvalidPrivateKeyError, PrivateKeyLengthError } from './errors';
// Will be added later
// Will be added later
export const sign = (): boolean => true;

// Will be added later
export const signTransaction = (): boolean => true;

const deriveKey = async (password: string, salt: string, c: number, dklen: number): Promise<Buffer> => {
    if (typeof window !== 'undefined'){
		const pbkdf2Params = {name: 'PBKDF2', hash: "SHA-256", salt, c}
		const cryptoKey =  await window.crypto.subtle.importKey('raw', Buffer.from(password), {name: 'PBKDF2'}, false, ["deriveBits", "deriveKey"])
		const hmacOptions = {name: "HMAC", hash: "SHA-256"}
		let key = await window.crypto.subtle.deriveKey(pbkdf2Params, cryptoKey, hmacOptions, false, ["decrypt"])
		console.log(key)
    }
	const derivedKey = pbkdf2Sync(Buffer.from(password), Buffer.from(salt, 'hex'), c, dklen, 'sha256')
	console.log(derivedKey)
    return derivedKey;
}

/**
 * Get account from private key
 */
export const privateKeyToAccount = (
    privateKey: string | Buffer,
): {
    address: string;
    privateKey: string;
    signTransaction: () => boolean; // From 1.x
    sign: () => boolean;
    encrypt: (a:string,b:string) => string;
} => {
    if (!privateKey) {
        throw new InvalidPrivateKeyError(privateKey);
    }

    const stringPrivateKey =
        typeof privateKey === 'object' ? Buffer.from(privateKey).toString('hex') : privateKey;

    const updatedKey = stringPrivateKey.startsWith('0x')
        ? stringPrivateKey.slice(2)
        : stringPrivateKey;

    // Must be 64 hex characters
    if (updatedKey.length !== 64) {
        throw new PrivateKeyLengthError(updatedKey);
    }

    const publicKey = getPublicKey(updatedKey);

    const publicKeyString = `0x${publicKey.slice(2)}`;
    const publicHash = sha3Raw(publicKeyString);
    const publicHashHex = bytesToHex(publicHash);
    const address = toChecksumAddress(publicHashHex.slice(-40));
    return { address, privateKey: stringPrivateKey, signTransaction, sign, encrypt };
};


export const encrypt = (privateKey: string, password: string): string => {
    // const account = privateKeyToAccount(privateKey);

    const salt = randomBytes(32);
    const iv = randomBytes(16);

    const kdf = 'scrypt';


    const kdfparams = {
        dklens: 32,
        salt: salt.toString('hex'),
        c: 262144,
        prf: '',
		n:0,
		r:8,
		p:1,
    }


	// if (kdf === 'pbkdf2') {
    //     kdfparams.c = 262144;
    //     kdfparams.prf = 'hmac-sha256';
    //     derivedKey = pbkdf2Sync();
    // }
	if (kdf === 'scrypt') {
		kdfparams.n = 8192;
		kdfparams.r = 8;
		kdfparams.p = 1;
	} else {
		throw new Error('Unsupported kdf');
	}

	const derivedKey = deriveKey(password, kdfparams.salt, kdfparams.c, kdfparams.dklens)

	const cipher = createCipheriv('aes-128-ctr', derivedKey.slice(0,16), iv);
	if (!cipher) {
		throw new Error('unsupported cipher');
	}

	// const ciphertext = Buffer.from([...cipher.update(Buffer.from(account.privateKey.replace('0x', ''), 'hex')], ...cipher.final());

	// const mac = sha3(Buffer.from([...derivedKey.slice(16, 32), ...ciphertext])).replace('0x', '');

	// return {
    //     version: 3,
    //     id: uuid.v4({random: options.uuid || cryp.randomBytes(16)}),
    //     address: account.address.toLowerCase().replace('0x', ''),
    //     crypto: {
    //         ciphertext: ciphertext.toString('hex'),
    //         cipherparams: {
    //             iv: iv.toString('hex')
    //         },
    //         cipher: options.cipher || 'aes-128-ctr',
    //         kdf: kdf,
    //         kdfparams: kdfparams,
    //         mac: mac.toString('hex')
    //     }
    // };

	return privateKey
};

encrypt("123", "123")
/**
 * Returns an acoount
 */
export const create = (): {
    address: HexString;
    privateKey: string;
    signTransaction: () => boolean; // From 1.x
    sign: () => boolean;
    encrypt: (a:string, b: string) => string;
} => {
    const privateKey = utils.randomPrivateKey();
    const address = getPublicKey(privateKey);
    return {
        privateKey: `0x${Buffer.from(privateKey).toString('hex')}`,
        address: `0x${Buffer.from(address).toString('hex')}`,
        signTransaction,
        sign,
        encrypt,
    };
};

// window.crypto.subtle.deriveKey()
