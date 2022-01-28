import { IbanOptions } from '../../src/types';

export const validIbanToAddressData: [string, string][] = [
	['XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36', '0x8ba1f109551bD432803012645Ac136ddd64DBA72'],
	['XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', '0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8'],
	['XE76LL5FJYLSMDVW5J02HWU6R5ZVPHURYM9', '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01'],
	['XE76LL5FJYLSMDVW5J02HWU6R5ZVPHURYM9', '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01'],
];

export const invalidIbanToAddressData: [string, Error][] = [
	[
		'XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK',
		new Error('Iban is indirect and cannot be converted. Must be length of 34 or 35'),
	],
	[
		'XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK365',
		new Error('Iban is indirect and cannot be converted. Must be length of 34 or 35'),
	],
];

export const invalidAddressData: [string][] = [
	['0x1'],
	['0xE247a45c287191d435A8a5D72A7C8dc030451E9F'], // Invalid checksum
	['-0x407d73d8a49eeb85d32cf465507dd71d507100c1'],
];

export const validFromBbanData: [string, string][] = [['ETHXREGGAVOFYORK', 'XE81ETHXREGGAVOFYORK']];

export const validCreateIndirectData: [IbanOptions, string][] = [
	[
		{
			institution: 'XREG',
			identifier: 'GAVOFYORK',
		},
		'XE81ETHXREGGAVOFYORK',
	],
];

export const isValidData: [any, boolean][] = [
	['XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36', true],
	['XE81ETHXREGGAVOFYORK', true],
	[1, false], // anything that is not a string should return false
	[[], false],
	[true, false],
	[{}, false],
	['ZZ68539007547034', false], // iban must start with the XE
	['BE68539007547034', false],
	['LC55HEMM000100010012001200023015', false],
];

export const validIsDirectData: [string, boolean][] = [
	['XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36', true],
	['XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', true],
	['ZZ68539007547034', false],
	['BE68539007547034', false],
];

export const validIsIndirectData: [string, boolean][] = [
	['XE81ETHXREGGAVOFYORK', true],
	['XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', false],
	['XE81ETHXREGGAVOFYO', false],
];
