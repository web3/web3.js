/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
import { Point } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { assertIsBuffer, zeros } from '../common/utils';

export class Address {
	public readonly buf: Buffer;

	public constructor(buf: Buffer) {
		if (buf.length !== 20) {
			throw new Error('Invalid address length');
		}
		this.buf = buf;
	}

	/**
	 * Returns the zero address.
	 */
	public static zero(): Address {
		return new Address(zeros(20));
	}

	/**
	 * Is address equal to another.
	 */
	public equals(address: Address): boolean {
		return this.buf.equals(address.buf);
	}

	/**
	 * Is address zero.
	 */
	public isZero(): boolean {
		return this.equals(Address.zero());
	}

	/**
	 * Returns hex encoding of address.
	 */
	public toString(): string {
		return `0x${this.buf.toString('hex')}`;
	}

	/**
	 * Returns Buffer representation of address.
	 */
	public toBuffer(): Buffer {
		return Buffer.from(this.buf);
	}

	/**
	 * Returns the ethereum address of a given public key.
	 * Accepts "Ethereum public keys" and SEC1 encoded keys.
	 * @param pubKey The two points of an uncompressed key, unless sanitize is enabled
	 * @param sanitize Accept public keys in other formats
	 */
	public static publicToAddress(_pubKey: Buffer, sanitize = false): Buffer {
		let pubKey = _pubKey;
		assertIsBuffer(pubKey);
		if (sanitize && pubKey.length !== 64) {
			pubKey = Buffer.from(Point.fromHex(pubKey).toRawBytes(false).slice(1));
		}
		if (pubKey.length !== 64) {
			throw new Error('Expected pubKey to be of length 64');
		}
		// Only take the lower 160bits of the hash
		// eslint-disable-next-line deprecation/deprecation
		return Buffer.from(keccak256(pubKey)).slice(-20);
	}
}
