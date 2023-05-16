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

import * as httpProvider from 'web3-providers-http';
import { Web3Account } from 'web3-eth-accounts';
import Web3, { DEFAULT_RETURN_FORMAT, Transaction } from '../../src';
// import testsData from '../fixtures/transactions.json';

jest.mock('web3-providers-http');

const txes = [
	{
		name: 'masked-1110110000',
		transaction: {
			to: '0x8f3e9c1Bd65EB267d19B176A73217524DC21A5ca',
			nonce: 951,
			gasLimit: '0x67b8bf',
			maxFeePerGas: '0xacd3ccc06a',
			maxPriorityFeePerGas: '0x180c3ca0',
		},
		privateKey: '0x0f8592102198f565b00937d2da3cd00475866ebdb18053243355dd6aa0222ab4',
		unsignedLegacy: '0xdf8203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca8080',
		unsignedEip155: '',
		unsignedBerlin: '0x01e1808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca8080c0',
		unsignedLondon:
			'0x02eb808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca8080c0',
		signedLegacy:
			'0xf8628203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80801ca01824be9b512435421450e39c03604e44962beba31c09b1d4622e99dcad871cf8a048fdf3c98503be7232f1eb46c8399aa5694dd9cf4df793f99b403d2a2eb9ca6d',
		signedEip155: '',
		signedBerlin:
			'0x01f864808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca8080c001a0c29892a39b49497746a92aa56ad1e9d4aa664bdb6e9e42b57d052ca1cecec4bea031cf5c0a49d7fd1a7cf0b40c14b7072de95f2b5540f91866bae078f5e87682cf',
		signedLondon:
			'0x02f86e808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca8080c001a0207ac4bc93d76464f9a8924a3a5179e80b2599a770b6cc9e99ace9d599d9e684a034adcf45bd5f56322a1303364a211455cf0c8d4aaa95e0894d084a391cc4c9e6',
		signatureLegacy: {
			r: '0x1824be9b512435421450e39c03604e44962beba31c09b1d4622e99dcad871cf8',
			s: '0x48fdf3c98503be7232f1eb46c8399aa5694dd9cf4df793f99b403d2a2eb9ca6d',
			v: '0x1c',
		},
		signatureEip155: {
			r: '',
			s: '',
			v: '',
		},
		signatureBerlin: {
			r: '0xc29892a39b49497746a92aa56ad1e9d4aa664bdb6e9e42b57d052ca1cecec4be',
			s: '0x31cf5c0a49d7fd1a7cf0b40c14b7072de95f2b5540f91866bae078f5e87682cf',
			v: '0x1',
		},
		signatureLondon: {
			r: '0x207ac4bc93d76464f9a8924a3a5179e80b2599a770b6cc9e99ace9d599d9e684',
			s: '0x34adcf45bd5f56322a1303364a211455cf0c8d4aaa95e0894d084a391cc4c9e6',
			v: '0x1',
		},
	},
	// {
	//     name: "masked-1110111000",
	//     transaction: {
	//         to: "0x8f3e9c1Bd65EB267d19B176A73217524DC21A5ca",
	//         nonce: 951,
	//         gasLimit: "0x67b8bf",
	//         maxFeePerGas: "0xacd3ccc06a",
	//         maxPriorityFeePerGas: "0x180c3ca0",
	//         data: "0x14a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78",
	//     },
	//     privateKey: "0x0f8592102198f565b00937d2da3cd00475866ebdb18053243355dd6aa0222ab4",
	//     unsignedLegacy: "0xf8a08203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80b88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78",
	//     unsignedEip155: "",
	//     unsignedBerlin: "0x01f8a2808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80b88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78c0",
	//     unsignedLondon: "0x02f8ac808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80b88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78c0",
	//     signedLegacy: "0xf8e38203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80b88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b781ca0c3c353687252c7b25a9b64755195ccc163258f7763f0f2451945f8b351cd6b6ba012a7808af4276b86519ecf0e22d3fe7dad5022bb7c697c1b51bda0ba2a29ef37",
	//     signedEip155: "",
	//     signedBerlin: "0x01f8e5808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80b88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78c080a0b4c7e9d8fe588ed9324720e645680805471a57e3f5c7d1a113bf4d4bf9009ab9a02b466f43e74e9d64a5c89f9d8342253f62302b755fb5a8baac1239867324ad2e",
	//     signedLondon: "0x02f8ef808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80b88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78c080a096d32977437d3a7bfa1c1fb315994eba4b6d194cda0e07a05dc788a2c328bce1a029250a4eadf983b027d6475e0f5a1df4bf8bfcea65c85d5259943c90a31c50e4",
	//     signatureLegacy: {
	//         r: "0xc3c353687252c7b25a9b64755195ccc163258f7763f0f2451945f8b351cd6b6b",
	//         s: "0x12a7808af4276b86519ecf0e22d3fe7dad5022bb7c697c1b51bda0ba2a29ef37",
	//         v: "0x1c",
	//     },
	//     signatureEip155: {
	//         r: "",
	//         s: "",
	//         v: "",
	//     },
	//     signatureBerlin: {
	//         r: "0xb4c7e9d8fe588ed9324720e645680805471a57e3f5c7d1a113bf4d4bf9009ab9",
	//         s: "0x2b466f43e74e9d64a5c89f9d8342253f62302b755fb5a8baac1239867324ad2e",
	//         v: "0x0",
	//     },
	//     signatureLondon: {
	//         r: "0x96d32977437d3a7bfa1c1fb315994eba4b6d194cda0e07a05dc788a2c328bce1",
	//         s: "0x29250a4eadf983b027d6475e0f5a1df4bf8bfcea65c85d5259943c90a31c50e4",
	//         v: "0x0",
	//     },
	// },
	// {
	//     name: "masked-1110110100",
	//     transaction: {
	//         to: "0x8f3e9c1Bd65EB267d19B176A73217524DC21A5ca",
	//         nonce: 951,
	//         gasLimit: "0x67b8bf",
	//         maxFeePerGas: "0xacd3ccc06a",
	//         maxPriorityFeePerGas: "0x180c3ca0",
	//         value: "0xe53c2b",
	//     },
	//     privateKey: "0x0f8592102198f565b00937d2da3cd00475866ebdb18053243355dd6aa0222ab4",
	//     unsignedLegacy: "0xe28203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2b80",
	//     unsignedEip155: "",
	//     unsignedBerlin: "0x01e4808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2b80c0",
	//     unsignedLondon: "0x02ee808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2b80c0",
	//     signedLegacy: "0xf8658203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2b801ca06d873f2ec911fa35ad9ed7a8169c7db7d05624343a8ae6cfec5e7a66ae6ec164a038e28f6e5bb165b8adee528d73080a96ca810e593203f04ce1606f2ee446f860",
	//     signedEip155: "",
	//     signedBerlin: "0x01f867808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2b80c001a0d00a8f7b1911f38859e63caa535a007c15848f6b9223a9b6f3b2cc87c32deff7a00efc7f592c81433203fc69133d7ed44515314d2d70283f31f43cfdb3302614c3",
	//     signedLondon: "0x02f871808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2b80c001a0748a936f7c167082cdb9a5df881f827f7097d89989f181206b81ece6602d364ea013f920bf428d072c075ca4d87636d8beed0ac52a6585741d9db8bd3f939a563d",
	//     signatureLegacy: {
	//         r: "0x6d873f2ec911fa35ad9ed7a8169c7db7d05624343a8ae6cfec5e7a66ae6ec164",
	//         s: "0x38e28f6e5bb165b8adee528d73080a96ca810e593203f04ce1606f2ee446f860",
	//         v: "0x1c",
	//     },
	//     signatureEip155: {
	//         r: "",
	//         s: "",
	//         v: "",
	//     },
	//     signatureBerlin: {
	//         r: "0xd00a8f7b1911f38859e63caa535a007c15848f6b9223a9b6f3b2cc87c32deff7",
	//         s: "0x0efc7f592c81433203fc69133d7ed44515314d2d70283f31f43cfdb3302614c3",
	//         v: "0x1",
	//     },
	//     signatureLondon: {
	//         r: "0x748a936f7c167082cdb9a5df881f827f7097d89989f181206b81ece6602d364e",
	//         s: "0x13f920bf428d072c075ca4d87636d8beed0ac52a6585741d9db8bd3f939a563d",
	//         v: "0x1",
	//     },
	// },
	// {
	//     name: "masked-1110111100",
	//     transaction: {
	//         to: "0x8f3e9c1Bd65EB267d19B176A73217524DC21A5ca",
	//         nonce: 951,
	//         gasLimit: "0x67b8bf",
	//         maxFeePerGas: "0xacd3ccc06a",
	//         maxPriorityFeePerGas: "0x180c3ca0",
	//         data: "0x14a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78",
	//         value: "0xe53c2b",
	//     },
	//     privateKey: "0x0f8592102198f565b00937d2da3cd00475866ebdb18053243355dd6aa0222ab4",
	//     unsignedLegacy: "0xf8a38203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2bb88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78",
	//     unsignedEip155: "",
	//     unsignedBerlin: "0x01f8a5808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2bb88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78c0",
	//     unsignedLondon: "0x02f8af808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2bb88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78c0",
	//     signedLegacy: "0xf8e68203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2bb88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b781ca03db67909302c521e616973cc478933dbf061c643e7e166b961e4c20cf60449aca0550e92db2b4903c1b308afccfa40ede5bc01a9a3bfb5ef7500dda44bd78e6627",
	//     signedEip155: "",
	//     signedBerlin: "0x01f8e7808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2bb88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78c080a05a201c043b1e07e67c379e546aee7c9187c77b3cf364228bcda2f85588f1c7f39f5485686c244ca4cd47f45becd04b7749d25018d20b5b3dac135188791b581e",
	//     signedLondon: "0x02f8f2808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2bb88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78c001a0f229fd067d4d2bd87a67a6caaef79bdeaa82d916ce651a47c1a034ac62b48bf7a037571c3605b3209fdaf36c44ac9b9b24282ce49f624c6989771a25703f7125b8",
	//     signatureLegacy: {
	//         r: "0x3db67909302c521e616973cc478933dbf061c643e7e166b961e4c20cf60449ac",
	//         s: "0x550e92db2b4903c1b308afccfa40ede5bc01a9a3bfb5ef7500dda44bd78e6627",
	//         v: "0x1c",
	//     },
	//     signatureEip155: {
	//         r: "",
	//         s: "",
	//         v: "",
	//     },
	//     signatureBerlin: {
	//         r: "0x5a201c043b1e07e67c379e546aee7c9187c77b3cf364228bcda2f85588f1c7f3",
	//         s: "0x005485686c244ca4cd47f45becd04b7749d25018d20b5b3dac135188791b581e",
	//         v: "0x0",
	//     },
	//     signatureLondon: {
	//         r: "0xf229fd067d4d2bd87a67a6caaef79bdeaa82d916ce651a47c1a034ac62b48bf7",
	//         s: "0x37571c3605b3209fdaf36c44ac9b9b24282ce49f624c6989771a25703f7125b8",
	//         v: "0x1",
	//     },
	// },
	// {
	//     name: "masked-1110110010",
	//     transaction: {
	//         to: "0x8f3e9c1Bd65EB267d19B176A73217524DC21A5ca",
	//         nonce: 951,
	//         gasLimit: "0x67b8bf",
	//         maxFeePerGas: "0xacd3ccc06a",
	//         maxPriorityFeePerGas: "0x180c3ca0",
	//         accessList: [
	//             {
	//                 address: "0xd25d95a6D3bbD713a24d5130536Bb29d1969f1CD",
	//                 storageKeys: [
	//                     "0x490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0",
	//                     "0x9fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018",
	//                     "0xa83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b9",
	//                 ],
	//             },
	//         ],
	//     },
	//     privateKey: "0x0f8592102198f565b00937d2da3cd00475866ebdb18053243355dd6aa0222ab4",
	//     unsignedLegacy: "0xdf8203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca8080",
	//     unsignedEip155: "",
	//     unsignedBerlin: "0x01f89e808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca8080f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b9",
	//     unsignedLondon: "0x02f8a8808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca8080f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b9",
	//     signedLegacy: "0xf8628203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80801ca01824be9b512435421450e39c03604e44962beba31c09b1d4622e99dcad871cf8a048fdf3c98503be7232f1eb46c8399aa5694dd9cf4df793f99b403d2a2eb9ca6d",
	//     signedEip155: "",
	//     signedBerlin: "0x01f8e1808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca8080f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b901a0ae2b89a18f93af07d7761c82d14905c381cd02d543713780c8f172a579c04a6ea026d6726fd1a93036e4dc8b4dd5625befc8438890730c51b8d7c6850d3ef7c6f6",
	//     signedLondon: "0x02f8eb808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca8080f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b901a09a17726b3cfd2dc222a1160d5a4efaa98ee8245caff83183b533f912e13df260a06442c8f772bcbc08ac56f6a9b13e4a6aa9aaec23154e230b86d8d728e2d673d3",
	//     signatureLegacy: {
	//         r: "0x1824be9b512435421450e39c03604e44962beba31c09b1d4622e99dcad871cf8",
	//         s: "0x48fdf3c98503be7232f1eb46c8399aa5694dd9cf4df793f99b403d2a2eb9ca6d",
	//         v: "0x1c",
	//     },
	//     signatureEip155: {
	//         r: "",
	//         s: "",
	//         v: "",
	//     },
	//     signatureBerlin: {
	//         r: "0xae2b89a18f93af07d7761c82d14905c381cd02d543713780c8f172a579c04a6e",
	//         s: "0x26d6726fd1a93036e4dc8b4dd5625befc8438890730c51b8d7c6850d3ef7c6f6",
	//         v: "0x1",
	//     },
	//     signatureLondon: {
	//         r: "0x9a17726b3cfd2dc222a1160d5a4efaa98ee8245caff83183b533f912e13df260",
	//         s: "0x6442c8f772bcbc08ac56f6a9b13e4a6aa9aaec23154e230b86d8d728e2d673d3",
	//         v: "0x1",
	//     },
	// },
	// {
	//     name: "masked-1110111010",
	//     transaction: {
	//         to: "0x8f3e9c1Bd65EB267d19B176A73217524DC21A5ca",
	//         nonce: 951,
	//         gasLimit: "0x67b8bf",
	//         maxFeePerGas: "0xacd3ccc06a",
	//         maxPriorityFeePerGas: "0x180c3ca0",
	//         data: "0x14a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78",
	//         accessList: [
	//             {
	//                 address: "0xd25d95a6D3bbD713a24d5130536Bb29d1969f1CD",
	//                 storageKeys: [
	//                     "0x490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0",
	//                     "0x9fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018",
	//                     "0xa83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b9",
	//                 ],
	//             },
	//         ],
	//     },
	//     privateKey: "0x0f8592102198f565b00937d2da3cd00475866ebdb18053243355dd6aa0222ab4",
	//     unsignedLegacy: "0xf8a08203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80b88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78",
	//     unsignedEip155: "",
	//     unsignedBerlin: "0x01f9011f808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80b88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b9",
	//     unsignedLondon: "0x02f90129808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80b88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b9",
	//     signedLegacy: "0xf8e38203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80b88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b781ca0c3c353687252c7b25a9b64755195ccc163258f7763f0f2451945f8b351cd6b6ba012a7808af4276b86519ecf0e22d3fe7dad5022bb7c697c1b51bda0ba2a29ef37",
	//     signedEip155: "",
	//     signedBerlin: "0x01f90162808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80b88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b901a08534a5bfffd6ecc62ee89e9486518a706a2fca59c6a1b86117f381d058b00229a005c84a37fe0def2aad6d8b8b770bc30129fb6f244b32ed011f493473a5044c99",
	//     signedLondon: "0x02f9016c808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca80b88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b980a00e02673f8baaa40e684b190b9d5f733514c578211e081976daa17b1f0c02052aa00bf7569ce52e964054d6b590dbc8c49536d2b81baf44095ab429d3f563565073",
	//     signatureLegacy: {
	//         r: "0xc3c353687252c7b25a9b64755195ccc163258f7763f0f2451945f8b351cd6b6b",
	//         s: "0x12a7808af4276b86519ecf0e22d3fe7dad5022bb7c697c1b51bda0ba2a29ef37",
	//         v: "0x1c",
	//     },
	//     signatureEip155: {
	//         r: "",
	//         s: "",
	//         v: "",
	//     },
	//     signatureBerlin: {
	//         r: "0x8534a5bfffd6ecc62ee89e9486518a706a2fca59c6a1b86117f381d058b00229",
	//         s: "0x05c84a37fe0def2aad6d8b8b770bc30129fb6f244b32ed011f493473a5044c99",
	//         v: "0x1",
	//     },
	//     signatureLondon: {
	//         r: "0x0e02673f8baaa40e684b190b9d5f733514c578211e081976daa17b1f0c02052a",
	//         s: "0x0bf7569ce52e964054d6b590dbc8c49536d2b81baf44095ab429d3f563565073",
	//         v: "0x0",
	//     },
	// },
	// {
	//     name: "masked-1110110110",
	//     transaction: {
	//         to: "0x8f3e9c1Bd65EB267d19B176A73217524DC21A5ca",
	//         nonce: 951,
	//         gasLimit: "0x67b8bf",
	//         maxFeePerGas: "0xacd3ccc06a",
	//         maxPriorityFeePerGas: "0x180c3ca0",
	//         value: "0xe53c2b",
	//         accessList: [
	//             {
	//                 address: "0xd25d95a6D3bbD713a24d5130536Bb29d1969f1CD",
	//                 storageKeys: [
	//                     "0x490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0",
	//                     "0x9fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018",
	//                     "0xa83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b9",
	//                 ],
	//             },
	//         ],
	//     },
	//     privateKey: "0x0f8592102198f565b00937d2da3cd00475866ebdb18053243355dd6aa0222ab4",
	//     unsignedLegacy: "0xe28203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2b80",
	//     unsignedEip155: "",
	//     unsignedBerlin: "0x01f8a1808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2b80f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b9",
	//     unsignedLondon: "0x02f8ab808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2b80f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b9",
	//     signedLegacy: "0xf8658203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2b801ca06d873f2ec911fa35ad9ed7a8169c7db7d05624343a8ae6cfec5e7a66ae6ec164a038e28f6e5bb165b8adee528d73080a96ca810e593203f04ce1606f2ee446f860",
	//     signedEip155: "",
	//     signedBerlin: "0x01f8e4808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2b80f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b980a06100b102abe9b21f1c7c59a1b710d11e89e12c0441e77fb93f70719b42c27aeca0472f78ffa47efc877a4771c2da5a5423926b2ffc9c6ca26205d0815b5ce7083c",
	//     signedLondon: "0x02f8ee808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2b80f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b980a07e48a91fa0eba6f12f8f50730e0c4ae08c354dc7d682c90be563d215781150f0a07855bc2677d3d2e0c412fe82885c0996c92b7592c0e78ee493bb42f55bcedbe4",
	//     signatureLegacy: {
	//         r: "0x6d873f2ec911fa35ad9ed7a8169c7db7d05624343a8ae6cfec5e7a66ae6ec164",
	//         s: "0x38e28f6e5bb165b8adee528d73080a96ca810e593203f04ce1606f2ee446f860",
	//         v: "0x1c",
	//     },
	//     signatureEip155: {
	//         r: "",
	//         s: "",
	//         v: "",
	//     },
	//     signatureBerlin: {
	//         r: "0x6100b102abe9b21f1c7c59a1b710d11e89e12c0441e77fb93f70719b42c27aec",
	//         s: "0x472f78ffa47efc877a4771c2da5a5423926b2ffc9c6ca26205d0815b5ce7083c",
	//         v: "0x0",
	//     },
	//     signatureLondon: {
	//         r: "0x7e48a91fa0eba6f12f8f50730e0c4ae08c354dc7d682c90be563d215781150f0",
	//         s: "0x7855bc2677d3d2e0c412fe82885c0996c92b7592c0e78ee493bb42f55bcedbe4",
	//         v: "0x0",
	//     },
	// },
	// {
	//     name: "masked-1110111110",
	//     transaction: {
	//         to: "0x8f3e9c1Bd65EB267d19B176A73217524DC21A5ca",
	//         nonce: 951,
	//         gasLimit: "0x67b8bf",
	//         maxFeePerGas: "0xacd3ccc06a",
	//         maxPriorityFeePerGas: "0x180c3ca0",
	//         data: "0x14a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78",
	//         value: "0xe53c2b",
	//         accessList: [
	//             {
	//                 address: "0xd25d95a6D3bbD713a24d5130536Bb29d1969f1CD",
	//                 storageKeys: [
	//                     "0x490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0",
	//                     "0x9fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018",
	//                     "0xa83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b9",
	//                 ],
	//             },
	//         ],
	//     },
	//     privateKey: "0x0f8592102198f565b00937d2da3cd00475866ebdb18053243355dd6aa0222ab4",
	//     unsignedLegacy: "0xf8a38203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2bb88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78",
	//     unsignedEip155: "",
	//     unsignedBerlin: "0x01f90122808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2bb88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b9",
	//     unsignedLondon: "0x02f9012c808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2bb88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b9",
	//     signedLegacy: "0xf8e68203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2bb88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b781ca03db67909302c521e616973cc478933dbf061c643e7e166b961e4c20cf60449aca0550e92db2b4903c1b308afccfa40ede5bc01a9a3bfb5ef7500dda44bd78e6627",
	//     signedEip155: "",
	//     signedBerlin: "0x01f90165808203b7808367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2bb88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b901a0f0b3393cc4a0272a3002864f70641e4219bff7930e060a5b14cb4f98a6c473f9a06720a1e525257b58a4f941f8a077ddc3e6505802ce8b09b336854dc8bb1219f0",
	//     signedLondon: "0x02f9016f808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca83e53c2bb88014a75dcfbe3b2ad41355d1768c038967219cf7189782e8dd20d61d4724136c705fe64ad7f34ba7ebc7bca0b325804461d4dd4d091cb40aa83431efad17159d8995b2392891ec41129a8fa2fa9cd1552ac1fcf86f55391c9500acce27a972ed381df53aaffa8de478f5d905cc37a26a3632a7d3416facaa93aba359d895500b78f87cf87a94d25d95a6d3bbd713a24d5130536bb29d1969f1cdf863a0490abded7314f322ca7f5be6de4f88932795db0a5efaa9f341bbc92b0c7550a0a09fad3dc0d449aba9f76ca580b484b8c887df8d6a4db1f657e6d3d93c7cef6018a0a83596da61d6ee00116d30dc064c5781995d1c3b4f4260f6d198bc5c9fabd5b980a008cd4f7a3506ded5401acd7773e1c9cd6f4dfb39248ede148765a8380e6126eaa0446171fe92718efe95f43d599644e7a6fc9f2e19bf256556f3a46b61047ebdd7",
	//     signatureLegacy: {
	//         r: "0x3db67909302c521e616973cc478933dbf061c643e7e166b961e4c20cf60449ac",
	//         s: "0x550e92db2b4903c1b308afccfa40ede5bc01a9a3bfb5ef7500dda44bd78e6627",
	//         v: "0x1c",
	//     },
	//     signatureEip155: {
	//         r: "",
	//         s: "",
	//         v: "",
	//     },
	//     signatureBerlin: {
	//         r: "0xf0b3393cc4a0272a3002864f70641e4219bff7930e060a5b14cb4f98a6c473f9",
	//         s: "0x6720a1e525257b58a4f941f8a077ddc3e6505802ce8b09b336854dc8bb1219f0",
	//         v: "0x1",
	//     },
	//     signatureLondon: {
	//         r: "0x08cd4f7a3506ded5401acd7773e1c9cd6f4dfb39248ede148765a8380e6126ea",
	//         s: "0x446171fe92718efe95f43d599644e7a6fc9f2e19bf256556f3a46b61047ebdd7",
	//         v: "0x0",
	//     },
	// },
];

describe('signTransaction', () => {
	let blockNum = 1;

	// it.each(testsData)(
	// 	'Integration test of transaction %s with Web3, Web3.Eth, Web3.Accounts and Provider should pass',
	// 	async txObj => {
	// 		const web3: Web3 = new Web3(new httpProvider.HttpProvider('http://127.0.0.1:8080'));
	//
	// 		const account: Web3Account = web3.eth.accounts.privateKeyToAccount(txObj.privateKey);
	//
	// 		web3.eth.wallet?.add(txObj.privateKey);
	//
	// 		const normalTx: Transaction = {
	// 			...txObj.transaction,
	// 			from: account.address,
	// 		};
	//
	// 		// either make it legacy or type 0x2 tx, instead of keeping both gasPrice and (maxPriorityFeePerGas maxFeePerGas)
	// 		if (txObj.transaction?.maxPriorityFeePerGas) {
	// 			delete normalTx['gasPrice'];
	// 		} else {
	// 			delete normalTx['maxPriorityFeePerGas'];
	// 			delete normalTx['maxFeePerGas'];
	// 		}
	//
	// 		jest.spyOn(httpProvider.HttpProvider.prototype, 'request').mockImplementation(
	// 			async (payload: any) => {
	// 				const response = {
	// 					jsonrpc: '2.0',
	// 					id: payload.id,
	// 					result: {},
	// 				};
	//
	// 				switch (payload.method) {
	// 					case 'net_version':
	// 						response.result = '1';
	// 						break;
	//
	// 					case 'eth_chainId':
	// 						response.result = '0x1';
	// 						break;
	//
	// 					case 'eth_blockNumber':
	// 						blockNum += 10;
	// 						response.result = `0x${blockNum.toString(16)}`;
	// 						break;
	//
	// 					case 'eth_getTransactionReceipt':
	// 						response.result = {
	// 							blockHash:
	// 								'0xa957d47df264a31badc3ae823e10ac1d444b098d9b73d204c40426e57f47e8c3',
	// 							blockNumber: `0x${blockNum.toString(16)}`,
	// 							cumulativeGasUsed: '0xa12515',
	// 							// "effectiveGasPrice": payload.effectiveGasPrice,
	// 							from: payload.from,
	// 							gasUsed: payload.gasLimit,
	// 							// "logs": [{}],
	// 							// "logsBloom": "0xa957d47df264a31badc3ae823e10ac1d444b098d9b73d204c40426e57f47e8c3", // 256 byte bloom filter
	// 							status: '0x1',
	// 							to: payload.to,
	// 							transactionHash:
	// 								'0x85d995eba9763907fdf35cd2034144dd9d53ce32cbec21349d4b12823c6860c5',
	// 							transactionIndex: '0x66',
	// 							// "type": payload.type
	// 						};
	// 						break;
	//
	// 					case 'eth_sendRawTransaction':
	// 						if (txObj.transaction.maxPriorityFeePerGas !== undefined) {
	// 							// eslint-disable-next-line jest/no-conditional-expect
	// 							expect(payload.params[0]).toBe(txObj.signedLondon); // validate transaction for London HF
	// 						} else {
	// 							// eslint-disable-next-line jest/no-conditional-expect
	// 							expect(payload.params[0]).toBe(txObj.signedBerlin); // validate transaction for Berlin HF
	// 						}
	// 						response.result =
	// 							'0x895ebb29d30e0afa891a5ca3a2687e073bd2c7ab544117ac386c8d8ff3ad583b';
	// 						break;
	//
	// 					default:
	// 						throw new Error(`Unknown payload ${payload}`);
	// 				}
	//
	// 				return new Promise(resolve => {
	// 					resolve(response as any);
	// 				});
	// 			},
	// 		);
	//
	// 		const res = await web3.eth.sendTransaction(normalTx, DEFAULT_RETURN_FORMAT, {
	// 			ignoreGasPricing: true,
	// 			checkRevertBeforeSending: false,
	// 		});
	// 		expect(res).toBeDefined();
	// 	},
	// );
	it.each(txes)(
		'Integration test of transaction %s with Web3, Web3.Eth, Web3.Accounts and Provider should pass',
		async txObj => {
			console.log('RUN ONCE', txObj);
			const web3: Web3 = new Web3(new httpProvider.HttpProvider('http://127.0.0.1:8080'));

			const account: Web3Account = web3.eth.accounts.privateKeyToAccount(txObj.privateKey);

			web3.eth.wallet?.add(txObj.privateKey);

			const normalTx: Transaction = {
				...txObj.transaction,
				from: account.address,
			};

			// either make it legacy or type 0x2 tx, instead of keeping both gasPrice and (maxPriorityFeePerGas maxFeePerGas)
			// if (txObj.transaction?.maxPriorityFeePerGas) {
			// 	delete normalTx['gasPrice'];
			// } else {
			// 	delete normalTx['maxPriorityFeePerGas'];
			// 	delete normalTx['maxFeePerGas'];
			// }

			jest.spyOn(httpProvider.HttpProvider.prototype, 'request').mockImplementation(
				async (payload: any) => {
					console.log('response payload', payload);
					const response = {
						jsonrpc: '2.0',
						id: payload.id,
						result: {},
					};
					console.log('payload', payload);
					switch (payload.method) {
						case 'net_version':
							response.result = '1';
							break;

						case 'eth_chainId':
							response.result = '0x1';
							break;

						case 'eth_blockNumber':
							blockNum += 10;
							response.result = `0x${blockNum.toString(16)}`;
							break;

						case 'eth_getTransactionReceipt':
							response.result = {
								blockHash:
									'0xa957d47df264a31badc3ae823e10ac1d444b098d9b73d204c40426e57f47e8c3',
								blockNumber: `0x${blockNum.toString(16)}`,
								cumulativeGasUsed: '0xa12515',
								// "effectiveGasPrice": payload.effectiveGasPrice,
								from: payload.from,
								gasUsed: payload.gasLimit,
								// "logs": [{}],
								// "logsBloom": "0xa957d47df264a31badc3ae823e10ac1d444b098d9b73d204c40426e57f47e8c3", // 256 byte bloom filter
								status: '0x1',
								to: payload.to,
								transactionHash:
									'0x85d995eba9763907fdf35cd2034144dd9d53ce32cbec21349d4b12823c6860c5',
								transactionIndex: '0x66',
								// "type": payload.type
							};
							break;

						case 'eth_sendRawTransaction':
							if (txObj.transaction.maxPriorityFeePerGas !== undefined) {
								// eslint-disable-next-line jest/no-conditional-expect
								expect(payload.params[0]).toBe(txObj.signedLondon); // validate transaction for London HF
							} else {
								// eslint-disable-next-line jest/no-conditional-expect
								expect(payload.params[0]).toBe(txObj.signedBerlin); // validate transaction for Berlin HF
							}
							response.result =
								'0x895ebb29d30e0afa891a5ca3a2687e073bd2c7ab544117ac386c8d8ff3ad583b';
							break;

						default:
							throw new Error(`Unknown payload ${payload}`);
					}

					return new Promise(resolve => {
						resolve(response as any);
					});
				},
			);

			console.log('SEND', normalTx);
			const res = await web3.eth.sendTransaction(normalTx, DEFAULT_RETURN_FORMAT, {
				// ignoreGasPricing: true,
				// checkRevertBeforeSending: false,
			});
			expect(res).toBeDefined();
		},
	);
});

0x02f8708205398203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca8080c080a0036fc20be13e2bbd9cadbbc6827fcdf21a2b9d9b17e32e140d62c67b90d5167da020e0d8a16a30e9d3ddd78374b9469be5179c73dafa9e5a8b82994748cbbb3e93;
0x02f86e808203b784180c3ca085acd3ccc06a8367b8bf948f3e9c1bd65eb267d19b176a73217524dc21a5ca8080c001a0207ac4bc93d76464f9a8924a3a5179e80b2599a770b6cc9e99ace9d599d9e684a034adcf45bd5f56322a1303364a211455cf0c8d4aaa95e0894d084a391cc4c9e6;
