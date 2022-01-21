import { IbanLengthError } from 'web3-common';

export const validIbanToAddress: [string, string][] = [
	['XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36', '0x8ba1f109551bD432803012645Ac136ddd64DBA72'],
	['XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', '0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8'],
];

export const invalidIbanToAddress: [string, IbanLengthError][] = [
	['XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK', new IbanLengthError()],
];

export const invalidAddress: [string][] = [
	['0x1'],
	['0xE247a45c287191d435A8a5D72A7C8dc030451E9F'], // Invalid checksum
	['-0x407d73d8a49eeb85d32cf465507dd71d507100c1'],
];

export const validFromBban: [string, string][] = [['ETHXREGGAVOFYORK', 'XE81ETHXREGGAVOFYORK']];
