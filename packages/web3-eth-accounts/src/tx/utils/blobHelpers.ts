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
import { sha256 } from 'ethereum-cryptography/sha256';

/**
 * These utilities for constructing blobs are borrowed from https://github.com/Inphi/eip4844-interop.git
 */

/**
 * Converts a vector commitment for a given data blob to its versioned hash.  For 4844, this version
 * number will be 0x01 for KZG vector commitments but could be different if future vector commitment
 * types are introduced
 * @param commitment a vector commitment to a blob
 * @param blobCommitmentVersion the version number corresponding to the type of vector commitment
 * @returns a versioned hash corresponding to a given blob vector commitment
 */
export const computeVersionedHash = (commitment: Uint8Array, blobCommitmentVersion: number) => {
	const computedVersionedHash = new Uint8Array(32);
	computedVersionedHash.set([blobCommitmentVersion], 0);
	computedVersionedHash.set(sha256(commitment).slice(1), 1);
	return computedVersionedHash;
};
