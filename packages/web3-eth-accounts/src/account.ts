/* eslint-disable no-bitwise */
import { utils, getPublicKey } from 'ethereum-cryptography/secp256k1';
import { pbkdf2Sync } from 'ethereum-cryptography/pbkdf2'
import { scryptSync } from 'ethereum-cryptography/scrypt'
import { encrypt as createCipheriv, decrypt as createDecipheriv} from 'ethereum-cryptography/aes'
import { toChecksumAddress, bytesToHex, sha3Raw, HexString, randomBytes, hexToBytes } from 'web3-utils';
import { V3Keystore, ScryptParams, PBKDF2SHA256Params, CipherOptions } from './types'
import { InvalidPrivateKeyError, PrivateKeyLengthError } from './errors';

const validateKeyStore = (keyStore: V3Keystore | string): boolean => !!keyStore;

// Will be added later
export const sign = (): boolean => true;

// Will be added later
export const signTransaction = (): boolean => true;


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

export const decrypt = async (v3Keystore: V3Keystore | string, password: string, nonStrict?: boolean): Promise<{
    address: string;
    privateKey: string;
    signTransaction: () => boolean; // From 1.x
    sign: () => boolean;
    encrypt: (a: string,b: string) => Promise<V3Keystore>;
}>=> {
    if(!(typeof password === 'string')) throw new Error('');
    
    const json = (!!v3Keystore && typeof v3Keystore === 'object') ? v3Keystore : JSON.parse(nonStrict ? v3Keystore.toLowerCase() : v3Keystore) as V3Keystore;

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

        if (kdfparams.prf !== 'hmac-sha256') {
            throw new Error('Unsupported parameters to PBKDF2');
        }

        derivedKey = pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt), kdfparams.c, kdfparams.dklen, 'sha256');
    } else {
        throw new Error('Unsupported key derivation scheme');
    }

    const ciphertext = hexToBytes(`0X${json.crypto.ciphertext}`);
    const mac = sha3Raw(Buffer.from([...derivedKey.slice(16, 32), ...ciphertext])).replace('0x', '');
    
    if (mac !== json.crypto.mac) {
        throw new Error('Key derivation failed - possibly wrong password');
    }

    const seed = await createDecipheriv(Buffer.from(json.crypto.ciphertext, 'hex'), derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'));
  
    return privateKeyToAccount(Buffer.from(seed));
};

/**
 * encrypt privateKey given a password, returns a V3 Keystore
 * https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
 */
export const encrypt = async (privateKey: string, password: string | Buffer, options?: CipherOptions): Promise<V3Keystore> => {
    const account = privateKeyToAccount(privateKey);

    const salt = options?.salt || randomBytes(32);
    const iv = options?.iv || randomBytes(16);
    const kdf = options?.kdf || 'scrypt';

    let derivedKey;
    let kdfparams: ScryptParams | PBKDF2SHA256Params ;

    // derive key from key derivation function
	if (kdf === 'pbkdf2') {
        kdfparams = {
            dklen: options?.dklen || 32,
            salt: salt,
            c: options?.c || 262144,
            prf: 'hmac-sha256'
        }
        derivedKey = pbkdf2Sync(Buffer.from(password), Buffer.from(salt), kdfparams.c, kdfparams.dklen, 'sha256')
    } else if (kdf === 'scrypt') {
        // FIXME: support progress reporting callback
        kdfparams = {
		n: options?.n || 8192,
		r: options?.r || 8,
		p: options?.p || 1,
        dklen: options?.dklen || 32,
        salt: salt.toString('hex')
        }   
        derivedKey = scryptSync(Buffer.from(password), Buffer.from(salt), kdfparams.n, kdfparams.p, kdfparams.r,kdfparams.dklen);
	} else {
		throw new Error('Unsupported kdf');
	}

    const cipherKey =  Buffer.from(privateKey.replace('0x', ''), 'hex')

	const cipher = await createCipheriv(cipherKey, Buffer.from(derivedKey.slice(0,16)), Buffer.from(iv), 'aes-128-ctr');

    const ciphertext = bytesToHex(cipher).slice(2);
	if (!ciphertext) {
		throw new Error('unsupported cipher');
	}
    const mac =  sha3Raw(Buffer.from([...derivedKey.slice(16,32), ...cipher])).replace('0x', '');

	return {
        version: 3,
        id: uuidV4(),
        address: account.address.toLowerCase().replace('0x', ''),
        crypto: {
            ciphertext, // remove prefix
            cipherparams: {
                iv: iv.toString('hex')
            },
            cipher: 'aes-128-ctr',
            kdf: kdf,
            kdfparams,
            mac: mac
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
    encrypt: (a:string, b: string) =>  Promise<V3Keystore>;
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


// encrypt("0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6", "123", {iv: "6ffb8102fa0fc9ff916f5fb67f2797a0", salt: "210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd"})
encrypt("0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6", "123");