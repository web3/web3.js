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
import type { Kzg } from '../depInterfaces';

function kzgNotLoaded(): never {
	throw Error('kzg library not loaded');
}

// eslint-disable-next-line import/no-mutable-exports
export let kzg: Kzg = {
	freeTrustedSetup: kzgNotLoaded,
	loadTrustedSetup: kzgNotLoaded,
	blobToKzgCommitment: kzgNotLoaded,
	computeAggregateKzgProof: kzgNotLoaded,
	verifyKzgProof: kzgNotLoaded,
	verifyAggregateKzgProof: kzgNotLoaded,
};

/**
 * @param kzgLib a KZG implementation (defaults to c-kzg)
 * @param trustedSetupPath the full path (e.g. "/home/linux/devnet4.txt") to a kzg trusted setup text file
 */
export function initKZG(kzgLib: Kzg, trustedSetupPath: string) {
	kzg = kzgLib;
	kzg.loadTrustedSetup(trustedSetupPath);
}
