/* eslint-disable no-bitwise */
import { utils, getPublicKey } from 'ethereum-cryptography/secp256k1';
import { pbkdf2Sync } from 'ethereum-cryptography/pbkdf2'
import { scryptSync } from 'ethereum-cryptography/scrypt'
import { encrypt as createCipheriv, decrypt as createDecipheriv} from 'ethereum-cryptography/aes'
import { toChecksumAddress, bytesToHex, sha3Raw, HexString, randomBytes, hexToBytes, validateBytesInput,
	isBuffer,
	isValidString, } from 'web3-utils';
import { InvalidPrivateKeyError, PrivateKeyLengthError, InvalidKdfError, KeyDerivationError } from 'web3-common';
import { V3Keystore, ScryptParams, PBKDF2SHA256Params, CipherOptions } from './types'

const validateKeyStore = (keyStore: V3Keystore | string): boolean => !!keyStore;

// Will be added later
export const sign = (): boolean => true;

// Will be added later
export const signTransaction = (): boolean => true;

// Generate a version 4 uuid
// https://github.com/uuidjs/uuid/blob/main/src/v4.js#L5
// https://github.com/ethers-io/ethers.js/blob/ce8f1e4015c0f27bf178238770b1325136e3351a/packages/json-wallets/src.ts/utils.ts#L54
const uuidV4 = () => {
    const bytes = randomBytes(16);

    // Section: 4.1.3:
    // - time_hi_and_version[12:16] = 0b0100
    bytes[6] = (bytes[6] & 0x0f) | 0x40;

    // Section 4.4
    // - clock_seq_hi_and_reserved[6] = 0b0
    // - clock_seq_hi_and_reserved[7] = 0b1
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hexString = bytesToHex(bytes);

    return [
        hexString.substring(2, 10),
        hexString.substring(10, 14),
        hexString.substring(14, 18),
        hexString.substring(18, 22),
        hexString.substring(22, 34),
     ].join("-");
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
    encrypt: (a: string,b: string) => Promise<V3Keystore>;
} => {
	if (!(isValidString(privateKey) || isBuffer(privateKey))) {
		throw new InvalidPrivateKeyError(privateKey);
	}

	const stringPrivateKey = Buffer.isBuffer(privateKey)
		? Buffer.from(privateKey).toString('hex')
		: privateKey;

	const stringPrivateKeyNoPrefix = stringPrivateKey.startsWith('0x')
		? stringPrivateKey.slice(2)
		: stringPrivateKey;

	// TODO Replace with isHexString32Bytes function in web3-eth PR:
	// Must be 64 hex characters
	if (stringPrivateKeyNoPrefix.length !== 64) {
		throw new PrivateKeyLengthError(stringPrivateKeyNoPrefix);
	}

	const publicKey = getPublicKey(stringPrivateKeyNoPrefix);

	const publicKeyString = `0x${publicKey.slice(2)}`;
	const publicHash = sha3Raw(publicKeyString);
	const publicHashHex = bytesToHex(publicHash);
	const address = toChecksumAddress(publicHashHex.slice(-40)); // To get the address, take the last 20 bytes of the public hash
	return { address, privateKey: stringPrivateKey, signTransaction, sign, encrypt };
}
/**
 *  Decrypts a keystore v3 JSON, and creates the account.
 * 
 * */
export const decrypt = async (v3Keystore: V3Keystore | string, password: string, nonStrict?: boolean): Promise<{
    address: string;
    privateKey: HexString;
    signTransaction: () => boolean; // From 1.x
    sign: () => boolean;
    encrypt: (a: string,b: string) => Promise<V3Keystore>;
}>=> {
    
    const json = (typeof v3Keystore === 'object') ? v3Keystore : JSON.parse(nonStrict ? v3Keystore.toLowerCase() : v3Keystore) as V3Keystore;

    validateKeyStore(json)

    if (json.version !== 3) throw new Error('Not a valid V3 wallet');

    let derivedKey;
    if (json.crypto.kdf === 'scrypt') {
        const kdfparams = json.crypto.kdfparams as ScryptParams;

        // TODO support progress reporting callback
        kdfparams.salt = typeof kdfparams.salt === 'string' ? Buffer.from(kdfparams.salt, 'hex') : kdfparams.salt

        derivedKey = scryptSync(Buffer.from(password), Buffer.from(kdfparams.salt), kdfparams.n, kdfparams.p, kdfparams.r, kdfparams.dklen);
    } else if (json.crypto.kdf === 'pbkdf2') {
        const kdfparams: PBKDF2SHA256Params = json.crypto.kdfparams as PBKDF2SHA256Params;

        derivedKey = pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt), kdfparams.c, kdfparams.dklen, 'sha256');
    } else {
        throw new InvalidKdfError();
    }

    const ciphertext = hexToBytes(`0X${json.crypto.ciphertext}`);
    const mac = sha3Raw(Buffer.from([...derivedKey.slice(16, 32), ...ciphertext])).replace('0x', '');
    
    if (mac !== json.crypto.mac) {
        throw new KeyDerivationError();
    }

    const seed = await createDecipheriv(Buffer.from(json.crypto.ciphertext, 'hex'), derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'));
  
    return privateKeyToAccount(Buffer.from(seed));
};

/**
 * encrypt a private key given a password, returns a V3 JSON Keystore
 * https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
 */
export const encrypt = async (privateKey: HexString, password: string | Buffer, options?: CipherOptions): Promise<V3Keystore> => {

    if (!(isValidString(privateKey) || isBuffer(privateKey))) {
		throw new InvalidPrivateKeyError(privateKey);
	}

    const account = privateKeyToAccount(privateKey);

    // if given salt or iv is a string, convert it to a Uint8Array
    let salt;
    if (options?.salt){
        salt = typeof options.salt === 'string' ? Buffer.from(options.salt, 'hex'): options.salt
    } else {
        salt = randomBytes(32);
    }
    validateBytesInput(salt);

    let iv;
    if (options?.iv){
        iv = typeof options.iv === 'string' ? Buffer.from(options.iv, 'hex'): options.iv
    } else {
        iv = randomBytes(16)
    }
    validateBytesInput(iv);

    const kdf = options?.kdf ?? 'scrypt';

    let derivedKey;
    let kdfparams: ScryptParams | PBKDF2SHA256Params;

    // derive key from key derivation function
	if (kdf === 'pbkdf2') {
        kdfparams = {
            dklen: options?.dklen ?? 32,
            salt: salt.toString('hex'),
            c: options?.c ?? 262144,
            prf: 'hmac-sha256'
        }
        derivedKey = pbkdf2Sync(Buffer.from(password), Buffer.from(salt), kdfparams.c, kdfparams.dklen, 'sha256')
    } else if (kdf === 'scrypt') {
        // FIXME: support progress reporting callback
        kdfparams = {
		n: options?.n ?? 8192,
		r: options?.r ?? 8,
		p: options?.p ?? 1,
        dklen: options?.dklen ?? 32,
        salt: salt.toString('hex')
        }   
        derivedKey = scryptSync(Buffer.from(password), Buffer.from(salt), kdfparams.n, kdfparams.p, kdfparams.r,kdfparams.dklen);
	} else {
		throw new InvalidKdfError();
	}

    const cipherKey =  Buffer.from(privateKey.replace('0x', ''), 'hex')

	const cipher = await createCipheriv(cipherKey, Buffer.from(derivedKey.slice(0,16)), iv, 'aes-128-ctr');

    const ciphertext = bytesToHex(cipher).slice(2);

    const mac =  sha3Raw(Buffer.from([...derivedKey.slice(16,32), ...cipher])).replace('0x', '');

	return {
        version: 3,
        id: uuidV4(),
        address: account.address.toLowerCase().replace('0x', ''),
        crypto: {
            ciphertext,
            cipherparams: {
                iv: iv.toString('hex')
            },
            cipher: 'aes-128-ctr',
            kdf,
            kdfparams,
            mac
        }
    }
};

/**
 * Returns an acoount
 */
export const create = (): {
    address: HexString;
    privateKey: string;
    signTransaction: () => boolean; // From 1.x
    sign: () => boolean;
    encrypt: (a: string, b: string) =>  Promise<V3Keystore>;
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
