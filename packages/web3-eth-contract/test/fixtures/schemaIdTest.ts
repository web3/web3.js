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
// No source code, abi was provided in issue #5772
// The source code should be: https://bscscan.com/address/0x66665ca5cb0f83e9cb813e89ca64bd6cdd4c6666#code
export const contractAbi = [
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address[]',
				name: 'airdroppees',
				type: 'address[]',
			},
			{
				indexed: false,
				internalType: 'uint256[]',
				name: 'amounts',
				type: 'uint256[]',
			},
		],
		name: 'AirDropsSent',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'arkWallet',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'status',
				type: 'bool',
			},
		],
		name: 'ArkWalletSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'withdrawPercent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'compoundPercent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'airdropPercent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'autoSell',
				type: 'bool',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'autoDeposit',
				type: 'bool',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'autoBond',
				type: 'bool',
			},
		],
		name: 'AutomatedActionTaken',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'stepSize',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'maxPercent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'percentIncrease',
				type: 'uint256',
			},
		],
		name: 'BasicTaxSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [],
		name: 'BnbRescued',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'level',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'price',
				type: 'uint256',
			},
		],
		name: 'BondLevelPriceSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'bondAddress',
				type: 'address',
			},
		],
		name: 'BondSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'buyReferralPercent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'buySwapTax',
				type: 'uint256',
			},
		],
		name: 'BuyTaxesSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'Compounded',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'lowerLimit',
				type: 'uint256',
			},
		],
		name: 'CwrLowerLimitSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'cwrWithoutNft',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'cwrLowLimit',
				type: 'uint256',
			},
		],
		name: 'CwrSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'Deposit',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'minDeposit',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'maxDeposit',
				type: 'uint256',
			},
		],
		name: 'DepositLimitsSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'referralPercent',
				type: 'uint256',
			},
		],
		name: 'DepositTaxesSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'referrer',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'DirectReferralRewardsPaid',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'legacyAddress',
				type: 'address',
			},
		],
		name: 'LegacySet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'LiquidityTaxSentToPool',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'withdrawPercent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'compoundPercent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'airdropPercent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'autoSell',
				type: 'bool',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'autoDeposit',
				type: 'bool',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'autoBond',
				type: 'bool',
			},
		],
		name: 'ManualActionTaken',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'MaxPayoutSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
		],
		name: 'NewAccountOpened',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'RoiIncreased',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'RoiReduced',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'penalizedPerMille',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'normalPerMille',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'reducedPerMille',
				type: 'uint256',
			},
		],
		name: 'RoiSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'referrer',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'roundRobinPosition',
				type: 'uint256',
			},
		],
		name: 'RoundRobinReferralRewardsPaid',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'SomeoneHasReachedMaxPayout',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'SomeoneIsDoneCompounding',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'maxCwr',
				type: 'uint256',
			},
		],
		name: 'SomeoneIsUsingHisNftToHyperCompound',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'referrer',
				type: 'address',
			},
		],
		name: 'SomeoneJoinedTheSystem',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'totalAirdropAmount',
				type: 'uint256',
			},
		],
		name: 'SomeoneWasFeelingGenerous',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'SomeoneWasNaughtyAndWillBePunished',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'SomeoneWillAirdropSoon',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256',
			},
		],
		name: 'SparkPotPercentSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'whoWasntEligible',
				type: 'address',
			},
		],
		name: 'SparkPotToppedUp',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'winner',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'prizeMoney',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'winnerNumber',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
		],
		name: 'SparkWinnerPaid',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'robinPercent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'airdropLiqPercent',
				type: 'uint256',
			},
		],
		name: 'SpecialTaxesSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256',
			},
		],
		name: 'SwapBuyTaxSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'swapAddress',
				type: 'address',
			},
		],
		name: 'SwapSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'taxAmount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'withdrawPercent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'compoundPercent',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'airdropPercent',
				type: 'uint256',
			},
		],
		name: 'TaxesFromAction',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'hoursInCycle',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'averageDays',
				type: 'uint256',
			},
		],
		name: 'TimeVariablesSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'UnpenalizedSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'taxAmount',
				type: 'uint256',
			},
		],
		name: 'Withdrawn',
		type: 'event',
	},
	{
		inputs: [],
		name: 'ARK',
		outputs: [
			{
				internalType: 'contract IBEP20',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'BUSD',
		outputs: [
			{
				internalType: 'contract IBEP20',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'CEO',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'MULTIPLIER',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'VRF',
		outputs: [
			{
				internalType: 'contract ICCVRF',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'accountReachedMaxPayout',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'actions',
		outputs: [
			{
				internalType: 'uint256',
				name: 'compoundSeconds',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'withdrawSeconds',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'nftLevels',
				type: 'uint256',
			},
		],
		name: 'addLevelsFromBond',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'addSparkPlayer',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address[]',
				name: 'airdroppees',
				type: 'address[]',
			},
			{
				internalType: 'uint256[]',
				name: 'amounts',
				type: 'uint256[]',
			},
		],
		name: 'airdrop',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'airdropBalance',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'airdropLiqTax',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'airdropped',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'airdropsReceived',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'approvee',
				type: 'address',
			},
		],
		name: 'approveNewContract',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'basicTax',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'bond',
		outputs: [
			{
				internalType: 'contract IBOND',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'bondLevelPrices',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'buyReferralTax',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'buyTax',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'amountOfBond',
				type: 'uint256',
			},
		],
		name: 'calculateUsdValueOfBond',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'checkMaxPayout',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'checkNdv',
		outputs: [
			{
				internalType: 'int256',
				name: '',
				type: 'int256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'checkRoi',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'checkWhaleTax',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'compounds',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'cwr',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'cwrAverageTime',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'cwrLowerLimit',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'referrer',
				type: 'address',
			},
		],
		name: 'deposit',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'referrer',
				type: 'address',
			},
		],
		name: 'depositFor',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address[]',
				name: 'investors',
				type: 'address[]',
			},
			{
				internalType: 'uint256[]',
				name: 'amounts',
				type: 'uint256[]',
			},
			{
				internalType: 'address[]',
				name: 'referrers',
				type: 'address[]',
			},
			{
				internalType: 'uint256',
				name: 'launchTime',
				type: 'uint256',
			},
		],
		name: 'depositPresaleTokens',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'depositReferralTax',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'depositTax',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'deposits',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'directRewards',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'doneCompounding',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'prizeAmount',
				type: 'uint256',
			},
		],
		name: 'drawSparkWinnerWithAmount',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'percentOfSpark',
				type: 'uint256',
			},
		],
		name: 'drawSparkWinnerWithPercent',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address[]',
				name: 'investors',
				type: 'address[]',
			},
		],
		name: 'generateUplineForPresale',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'getAvailableReward',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'getBondValue',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'getLevelOfInvestor',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'getNftLevels',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'timeSinceLastAction',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'withdrawPercent',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'compoundPercent',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'airdropPercent',
				type: 'uint256',
			},
		],
		name: 'getRollingAverageCwr',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'getTotalReferralRewards',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
		],
		name: 'hasAccount',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'isArk',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'uplineAddress',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'uplinePosition',
				type: 'uint256',
			},
		],
		name: 'isEligible',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'lastAction',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'legacy',
		outputs: [
			{
				internalType: 'contract ILEGACY',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'maxCwr',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'maxCwrWithoutNft',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'maxDeposit',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'maxPayoutAmount',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'maxPayoutPercentage',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'maxTax',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'minDeposit',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'newDeposits',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'nonceProcessed',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'out',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'penalized',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'postTaxOut',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'principalBalance',
		outputs: [
			{
				internalType: 'uint256',
				name: 'this fucking name',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'prizeAtNonce',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'referrerOf',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'tokenToRescue',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256',
			},
		],
		name: 'rescueAnyToken',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'rescueBnb',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'roi',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'roiNormal',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'roiPenalized',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'roiReduced',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'roundRobinPosition',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'roundRobinRewards',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'roundRobinTax',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'arkWallet',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: 'status',
				type: 'bool',
			},
		],
		name: 'setArkWallet',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'stepSize',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'maxPercent',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'percentIncrease',
				type: 'uint256',
			},
		],
		name: 'setBasicTax',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'bondAddress',
				type: 'address',
			},
		],
		name: 'setBondAddress',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'level',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'price',
				type: 'uint256',
			},
		],
		name: 'setBondLevelPrice',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'buyPercent',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'buyReferralPercent',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'buySwapTax',
				type: 'uint256',
			},
		],
		name: 'setBuyTaxes',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'cwrWithoutNft',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'cwrLowLimit',
				type: 'uint256',
			},
		],
		name: 'setCwr',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'percentTax',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'percentReferral',
				type: 'uint256',
			},
		],
		name: 'setDepositTaxes',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'legacyAddress',
				type: 'address',
			},
		],
		name: 'setLegacyAddress',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'minAmount',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'maxAmount',
				type: 'uint256',
			},
		],
		name: 'setMaxAndMinDeposit',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'setMaxPayout',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'penalizedPerMille',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'normalPerMille',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'reducedPerMille',
				type: 'uint256',
			},
		],
		name: 'setRoi',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256',
			},
		],
		name: 'setSparkPotPercent',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'robinPercent',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'airdropLiqPercent',
				type: 'uint256',
			},
		],
		name: 'setSpecialTaxes',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'swapAddress',
				type: 'address',
			},
		],
		name: 'setSwapAddress',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'hoursInCycle',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'averageDays',
				type: 'uint256',
			},
		],
		name: 'setTimeVariables',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'sparkPlayerAdded',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'sparkPot',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'sparkPotPercent',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_nonce',
				type: 'uint256',
			},
			{
				internalType: 'uint256[]',
				name: 'randomNumbers',
				type: 'uint256[]',
			},
		],
		name: 'supplyRandomness',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'swap',
		outputs: [
			{
				internalType: 'contract ISWAP',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'swapBuyTax',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'withdrawPercent',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'compoundPercent',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'airdropPercent',
				type: 'uint256',
			},
			{
				internalType: 'bool',
				name: 'autoSell',
				type: 'bool',
			},
			{
				internalType: 'bool',
				name: 'autoDeposit',
				type: 'bool',
			},
			{
				internalType: 'bool',
				name: 'autoBond',
				type: 'bool',
			},
		],
		name: 'takeAction',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'investor',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'withdrawPercent',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'compoundPercent',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'airdropPercent',
				type: 'uint256',
			},
			{
				internalType: 'bool',
				name: 'autoSell',
				type: 'bool',
			},
			{
				internalType: 'bool',
				name: 'autoDeposit',
				type: 'bool',
			},
			{
				internalType: 'bool',
				name: 'autoBond',
				type: 'bool',
			},
		],
		name: 'takeAutomatedAction',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'tax',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'taxIncrease',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'taxLevelSteps',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'timeOfEntry',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'timer',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalAccounts',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalPrizeMoneyPaid',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalWinners',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'upline',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'withdrawn',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		stateMutability: 'payable',
		type: 'receive',
	},
];

export const contractBytecode =
	'608060405260056020556014602155600a6022556105dc6023556102ee60245561012c6025556200003b670de0b6b3a7640000610fa062000322565b60265562000053670de0b6b3a7640000600a62000322565b6027556200006d670de0b6b3a76400006201388062000322565b6028556212750060295562015180602a556005602b55600a602c556005602d556008602e556005602f5560056030556002603155600a603255670de0b6b3a7640000611f40620000be919062000322565b603355603760345560056035556032603655348015620000dd57600080fd5b50601e602052680d8d726b7177a800007f873299c6a6c39b8b92f01922bb622df4a3236ea2876aac2da76f6c092cf7e98f8190557f8a1ea6ccfdf9f988bdc16303c81231f9b192785454b34880c28e5c30362354c555681b1ae4d6e2ef5000007f4bbb14a9b8bdd7baf7e45936eef68b1d3b69ec665e4d3d9f22d086627a2b08808190557f2eca6469c5988648711d819e241e59ec9e94a879e5d491ce337260f9e75414128190557f86d72ecda2f02015d839a182675ed983893a479e8f4279fb5498fd7244fa5dfe8190557f3b995de482df97a2c9d456eaddef4a2d8e37e8b7ceaa84df3200ae34890448f38190557f07e07990268d552e861c3b3b30762ae1d401e128d88dcdc061f5fba57e7ac9f88190557f8dd77d38164a78ad615ed6f87db5c81e75803d1677bf75ecfbbe3c73b83871418190557f2fcdb860d99ada637bba31889280ce2d4217586b5da61641dd5742bcbb7aa46a55683635c9adc5dea000007f4150be2f2e4ca26ea4353f7f6543634639cb7af12002f06e7614303d57e128f98190557fe065eaad7f40a2cd4bc1efc6f4344c19df9fe636b15760bd5961fc0e3be3cc288190557fc2cdcac6815e8dba5c073d2c4a622d2de1453a902e3ebd096b6c8686d03a6e518190557f4dfc35b27a2a15eb38750f68a286ed8b8346956ebe7227ceb2dd7dd5c373ac268190557fb967cce98cabd8d1f7aeda98d36c0158d6775cfe7c62f16953241eb7720ce15b819055600f6000527f32abc6767b4a526ba081342d89c77eb5e415f12f68af45f1f8433a1280ad46885562000350565b60008160001904831182151516156200034b57634e487b7160e01b600052601160045260246000fd5b500290565b615e1480620003606000396000f3fe60806040526004361061066b5760003560e01c80637b36e28911610344578063c1a1fef1116101b6578063e1dbf31211610102578063f032556a116100a0578063f765fd8f1161007a578063f765fd8f14611444578063f80c6d961461145a578063f8d96c981461148a578063fc7e286d146114a057600080fd5b8063f032556a146113e1578063f35aeb5d1461140e578063f42faa0f1461142457600080fd5b8063eba6d25a116100dc578063eba6d25a1461134c578063ecf6ce711461136c578063ef5ebd081461138c578063efa9a934146113c157600080fd5b8063e1dbf312146112d9578063e68fc0ee14611309578063e6ca9a0c1461133657600080fd5b8063d21cacdf1161016f578063da2c750e11610149578063da2c750e1461126a578063da7a468914611297578063df522367146112ad578063e0d64ac8146112c357600080fd5b8063d21cacdf146111e4578063d23f96e41461121a578063d80a84341461124a57600080fd5b8063c1a1fef1146110fd578063c447672d1461112a578063c64d7e2814611157578063c8820f6c14611184578063c8e40fbf146111a4578063c984bdc5146111c457600080fd5b80639af39af811610290578063a7f3f0d21161022e578063aaae028411610208578063aaae02841461108b578063ad4a11b8146110a1578063bcc941b6146110d1578063bfdf8ce4146110e757600080fd5b8063a7f3f0d21461102b578063a92bda2f1461104b578063aa4761911461106b57600080fd5b8063a10885711161026a578063a108857114610fab578063a126285b14610fcd578063a26ddbca14610ff5578063a2bb29391461101557600080fd5b80639af39af814610f3b5780639c36c75014610f5b5780639d480b3014610f8b57600080fd5b806388c9cb3c116102fd57806396341b83116102d757806396341b8314610eb0578063975c26ef14610edd57806397dc365b14610ef357806399154b4914610f1357600080fd5b806388c9cb3c14610e5a5780638cd05ecb14610e7057806394cbccf714610e9057600080fd5b80637b36e28914610d6d5780637dc4b9cc14610d8d5780637e8fa3f414610dad5780638119c06514610dcd57806387db03b114610ded5780638841f45514610e1a57600080fd5b806350a9cd00116104dd578063672434821161042957806370720d1f116103c75780637344a44d116103a15780637344a44d14610cf557806376cff68c14610d0a57806377d2f5ea14610d205780637899d80f14610d4057600080fd5b806370720d1f14610c7b57806370fcb0a714610ca8578063712bf66014610cd557600080fd5b80636d8813c5116104035780636d8813c514610bf85780636e08dbb514610c0e5780636e553f6514610c2e5780636ef6109214610c4e57600080fd5b80636724348214610b8b57806367c930c814610bab5780636a8cdb5214610bd857600080fd5b80635feb0dec1161049657806362383349116104705780636238334914610b1557806363845a9d14610b3557806363e824c014610b4b57806364c9ec6f14610b6b57600080fd5b80635feb0dec14610ab25780636083e59a14610adf5780636216e9cf14610af557600080fd5b806350a9cd0014610a0657806358451f9714610a265780635acabf6314610a3c5780635ad97ed914610a525780635d36c07314610a725780635f2cd40f14610a9257600080fd5b8063247e9cf3116105b757806346a1cd0811610555578063484f4ea91161052f578063484f4ea9146109845780634d208de3146109c45780634f7041a5146109da578063509c3d48146109f057600080fd5b806346a1cd081461092457806347314fa01461094457806348489c7c1461096457600080fd5b80633ade7ed7116105915780633ade7ed7146108ab57806341645677146108d857806341b3d185146108f857806344d8c5ba1461090e57600080fd5b8063247e9cf31461085257806327f082f41461087f5780632ef017601461089557600080fd5b80631b86b93f1161062457806320b57614116105fe57806320b57614146107c257806321970f45146107ef57806322219f371461081c5780632245faba1461083257600080fd5b80631b86b93f146107555780631cad4dac146107755780631e90c8601461079557600080fd5b8063027e9e9614610677578063059f8b161461069957806306aa2b19146106c85780630f9ba0c9146106f55780631870517a146107155780631a1f20301461073557600080fd5b3661067257005b600080fd5b34801561068357600080fd5b506106976106923660046154fd565b6114cd565b005b3480156106a557600080fd5b506106b5670de0b6b3a764000081565b6040519081526020015b60405180910390f35b3480156106d457600080fd5b506106b56106e3366004615534565b60166020526000908152604090205481565b34801561070157600080fd5b5061069761071036600461554f565b611567565b34801561072157600080fd5b506106976107303660046155c8565b6115f1565b34801561074157600080fd5b506106976107503660046155f4565b611674565b34801561076157600080fd5b50610697610770366004615534565b611706565b34801561078157600080fd5b50610697610790366004615616565b6117bc565b3480156107a157600080fd5b506106b56107b0366004615534565b600a6020526000908152604090205481565b3480156107ce57600080fd5b506106b56107dd366004615534565b60156020526000908152604090205481565b3480156107fb57600080fd5b506106b561080a366004615534565b60176020526000908152604090205481565b34801561082857600080fd5b506106b560245481565b34801561083e57600080fd5b506106b561084d366004615534565b61185c565b34801561085e57600080fd5b506106b561086d366004615534565b60196020526000908152604090205481565b34801561088b57600080fd5b506106b5602b5481565b3480156108a157600080fd5b506106b560375481565b3480156108b757600080fd5b506106b56108c6366004615534565b600b6020526000908152604090205481565b3480156108e457600080fd5b506106976108f3366004615694565b6118d5565b34801561090457600080fd5b506106b560275481565b34801561091a57600080fd5b506106b560235481565b34801561093057600080fd5b506106b561093f366004615534565b611a3d565b34801561095057600080fd5b5061069761095f3660046156d6565b611afb565b34801561097057600080fd5b506106b561097f366004615534565b611b63565b34801561099057600080fd5b506109ac73e9e7cea3dedca5984780bafc599bd69add087d5681565b6040516001600160a01b0390911681526020016106bf565b3480156109d057600080fd5b506106b5602d5481565b3480156109e657600080fd5b506106b5602e5481565b3480156109fc57600080fd5b506106b560355481565b348015610a1257600080fd5b50610697610a213660046155c8565b611bba565b348015610a3257600080fd5b506106b560045481565b348015610a4857600080fd5b506106b560215481565b348015610a5e57600080fd5b50610697610a6d3660046156ef565b611c32565b348015610a7e57600080fd5b50610697610a8d3660046157f8565b611cd7565b348015610a9e57600080fd5b506106b5610aad36600461583f565b611dff565b348015610abe57600080fd5b506106b5610acd366004615534565b600e6020526000908152604090205481565b348015610aeb57600080fd5b506106b560265481565b348015610b0157600080fd5b506106b5610b10366004615869565b611ec0565b348015610b2157600080fd5b506106b5610b30366004615534565b612009565b348015610b4157600080fd5b506106b560315481565b348015610b5757600080fd5b50610697610b663660046155f4565b61206a565b348015610b7757600080fd5b506000546109ac906001600160a01b031681565b348015610b9757600080fd5b50610697610ba63660046158ab565b6120d7565b348015610bb757600080fd5b506106b5610bc6366004615534565b60186020526000908152604090205481565b348015610be457600080fd5b50610697610bf3366004615534565b612385565b348015610c0457600080fd5b506106b560345481565b348015610c1a57600080fd5b50610697610c2936600461583f565b612518565b348015610c3a57600080fd5b50610697610c49366004615961565b61263e565b348015610c5a57600080fd5b506106b5610c69366004615534565b60146020526000908152604090205481565b348015610c8757600080fd5b506106b5610c96366004615534565b60126020526000908152604090205481565b348015610cb457600080fd5b506106b5610cc3366004615534565b60096020526000908152604090205481565b348015610ce157600080fd5b506106b5610cf0366004615534565b61291a565b348015610d0157600080fd5b50610697612974565b348015610d1657600080fd5b506106b560365481565b348015610d2c57600080fd5b50610697610d3b3660046156d6565b612a67565b348015610d4c57600080fd5b506106b5610d5b366004615534565b600c6020526000908152604090205481565b348015610d7957600080fd5b506106b5610d88366004615534565b612ad2565b348015610d9957600080fd5b50610697610da8366004615534565b612b4e565b348015610db957600080fd5b506109ac610dc836600461583f565b612cda565b348015610dd957600080fd5b506002546109ac906001600160a01b031681565b348015610df957600080fd5b506106b5610e08366004615534565b60136020526000908152604090205481565b348015610e2657600080fd5b50610e4a610e35366004615534565b603c6020526000908152604090205460ff1681565b60405190151581526020016106bf565b348015610e6657600080fd5b506106b5602a5481565b348015610e7c57600080fd5b506106b5610e8b366004615534565b612d12565b348015610e9c57600080fd5b50610697610eab3660046155f4565b612d40565b348015610ebc57600080fd5b506106b5610ecb366004615534565b601b6020526000908152604090205481565b348015610ee957600080fd5b506106b560325481565b348015610eff57600080fd5b50610697610f0e366004615534565b612dad565b348015610f1f57600080fd5b506109ac73111120a4cfacf4c78e0d6729274fd5a5ae2b111181565b348015610f4757600080fd5b50610697610f563660046156d6565b612f39565b348015610f6757600080fd5b50610e4a610f76366004615534565b60036020526000908152604090205460ff1681565b348015610f9757600080fd5b506106b5610fa6366004615534565b612f9b565b348015610fb757600080fd5b506109ac600080516020615dbf83398151915281565b348015610fd957600080fd5b506109ac73c0de0ab6e25cc34fb26de4617313ca559f78c0de81565b34801561100157600080fd5b50610697611010366004615984565b61302e565b34801561102157600080fd5b506106b560225481565b34801561103757600080fd5b506001546109ac906001600160a01b031681565b34801561105757600080fd5b506106976110663660046155f4565b613088565b34801561107757600080fd5b506106b56110863660046156d6565b6130f5565b34801561109757600080fd5b506106b560255481565b3480156110ad57600080fd5b50610e4a6110bc366004615534565b60116020526000908152604090205460ff1681565b3480156110dd57600080fd5b506106b5603a5481565b3480156110f357600080fd5b506106b560295481565b34801561110957600080fd5b506106b5611118366004615534565b60066020526000908152604090205481565b34801561113657600080fd5b506106b56111453660046156d6565b603d6020526000908152604090205481565b34801561116357600080fd5b506106b56111723660046156d6565b601e6020526000908152604090205481565b34801561119057600080fd5b506106b561119f3660046159eb565b613228565b3480156111b057600080fd5b50610e4a6111bf366004615534565b61356d565b3480156111d057600080fd5b506106b56111df366004615534565b6135b7565b3480156111f057600080fd5b506109ac6111ff366004615534565b601a602052600090815260409020546001600160a01b031681565b34801561122657600080fd5b50610e4a6112353660046156d6565b603e6020526000908152604090205460ff1681565b34801561125657600080fd5b50610e4a61126536600461583f565b61364f565b34801561127657600080fd5b506106b5611285366004615534565b60086020526000908152604090205481565b3480156112a357600080fd5b506106b560205481565b3480156112b957600080fd5b506106b560335481565b3480156112cf57600080fd5b506106b560395481565b3480156112e557600080fd5b50610e4a6112f4366004615534565b60106020526000908152604090205460ff1681565b34801561131557600080fd5b506106b5611324366004615534565b60056020526000908152604090205481565b34801561134257600080fd5b506106b560305481565b34801561135857600080fd5b506106976113673660046155f4565b613712565b34801561137857600080fd5b506106976113873660046155f4565b613794565b34801561139857600080fd5b506113ac6113a736600461583f565b61381c565b604080519283526020830191909152016106bf565b3480156113cd57600080fd5b506106976113dc366004615a27565b613858565b3480156113ed57600080fd5b506106b56113fc366004615534565b600d6020526000908152604090205481565b34801561141a57600080fd5b506106b5602f5481565b34801561143057600080fd5b5061069761143f3660046155f4565b613b65565b34801561145057600080fd5b506106b5602c5481565b34801561146657600080fd5b50610e4a611475366004615534565b600f6020526000908152604090205460ff1681565b34801561149657600080fd5b506106b560285481565b3480156114ac57600080fd5b506106b56114bb366004615534565b60076020526000908152604090205481565b33600080516020615dbf833981519152146115035760405162461bcd60e51b81526004016114fa90615aca565b60405180910390fd5b6001600160a01b038216600081815260036020908152604091829020805460ff19168515159081179091558251938452908301527ffdd0af5ddd6e15c3303b396526dac86fc4a4170dc3c49f6b2f8be7eaef6ab71e91015b60405180910390a15050565b3360009081526003602052604090205460ff166115965760405162461bcd60e51b81526004016114fa90615b01565b6115a587878787878787613be2565b7f3bd7a9294f73c1d2c19fe647eacaf32ac6401ebf4c344c6837243d27dbdeb237878787878787876040516115e09796959493929190615b2f565b60405180910390a150505050505050565b33600080516020615dbf8339815191521461161e5760405162461bcd60e51b81526004016114fa90615aca565b602e839055602f829055602b81905560408051848152602081018490529081018290527f3c7edbed8bc53d5a57483faee5ef44ec5991097c5ea442b6455a5da576e4e434906060015b60405180910390a1505050565b33600080516020615dbf833981519152146116a15760405162461bcd60e51b81526004016114fa90615aca565b6116b3670de0b6b3a764000083615b86565b6027556116c8670de0b6b3a764000082615b86565b60268190556027546040517fd29c8e99ff3fd51a9566b37aaf881cb33696ceab6568ff7d30c001915a17e10e9261155b928252602082015260400190565b3360009081526003602052604090205460ff166117355760405162461bcd60e51b81526004016114fa90615b01565b6001600160a01b0381166000908152603c602052604090205460ff166117b957603b805460018082019092557fbbe3212124853f8b0084a66a2d057c2966e251e132af3691db153ab65f0d1a4d0180546001600160a01b0319166001600160a01b0384169081179091556000908152603c60205260409020805460ff191690911790555b50565b33600080516020615dbf833981519152146117e95760405162461bcd60e51b81526004016114fa90615aca565b6032849055611800670de0b6b3a764000084615b86565b603355603482905560358190556040805185815260208101859052908101839052606081018290527fcee478f1abf35fa922edacaec15fdc4fb5d3947a77ebfa21044904e0e8978285906080015b60405180910390a150505050565b60015460405163f431a6e160e01b81526001600160a01b038381166004830152600092839291169063f431a6e190602401602060405180830381865afa1580156118aa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118ce9190615ba5565b9392505050565b33600080516020615dbf833981519152146119025760405162461bcd60e51b81526004016114fa90615aca565b60008060005b83811015611a365784848281811061192257611922615bbe565b90506020020160208101906119379190615534565b6001600160a01b038082166000908152601a6020908152604080832054601d83528184209092528220805460ff1916600117905590911694509092505b600f811015611a23576001600160a01b038381166000908152601c602090815260408220805460018101825590835291200180546001600160a01b031916918616918217905515611a11576001600160a01b038084166000908152601d602090815260408083209784168352878252808320805460ff19166001179055601a825280832054909316808352969052205460ff1615611a1157600093505b80611a1b81615bd4565b915050611974565b5080611a2e81615bd4565b915050611908565b5050505050565b602a546001600160a01b03821660009081526012602052604081205490918291611a679042615bed565b11611a94576001600160a01b038316600090815260126020526040902054611a8f9042615bed565b611a98565b602a545b602a546001600160a01b0385166000908152600b6020908152604080832054600590925282205493945090926103e892918591611ad59190615b86565b611adf9190615b86565b611ae99190615c16565b611af39190615c16565b949350505050565b3360009081526003602052604090205460ff16611b2a5760405162461bcd60e51b81526004016114fa90615b01565b603880546000908152603d6020526040902082905554611b4b90600a61449b565b60388054906000611b5b83615bd4565b919050555050565b6001600160a01b038116600090815260146020908152604080832054601683528184205460088452828520546007909452918420548493919291611ba691615c2a565b611bb09190615c52565b6118ce9190615c52565b33600080516020615dbf83398151915214611be75760405162461bcd60e51b81526004016114fa90615aca565b6020838155602183905560228290556040805185815291820184905281018290527f456448565426f9548428cf84d628e4e4140c73a21aa30fb5027cff5e00511c4790606001611667565b33600080516020615dbf83398151915214611c5f5760405162461bcd60e51b81526004016114fa90615aca565b60405163095ea7b360e01b81526001600160a01b0383169063095ea7b390611c8f90849060001990600401615c79565b6020604051808303816000875af1158015611cae573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611cd29190615c92565b505050565b3373c0de0ab6e25cc34fb26de4617313ca559f78c0de14611cf6575050565b6000828152603e602052604090205460ff16611dfb576000611d178261450b565b90506001600160a01b038116611d3257611cd283600a61449b565b6000838152603d6020526040902054611d4b8282614593565b8060376000828254611d5d9190615bed565b925050819055508060396000828254611d769190615caf565b9091555050603a8054906000611d8b83615bd4565b90915550506000848152603e6020908152604091829020805460ff19166001179055603a5482516001600160a01b0386168152918201849052918101919091524260608201527f20d24ea328eb761750e14534e77d275defcc6ba00e146fee4ab91882943be11d9060800161184e565b5050565b600080611e0b84612ad2565b6001600052601e6020527f873299c6a6c39b8b92f01922bb622df4a3236ea2876aac2da76f6c092cf7e98f54909150811015611e4a5782915050611eba565b82815b601e6000611e5c846001615caf565b815260200190815260200160002054811115611eb55781611e7c81615bd4565b6000818152601e6020526040902054909350611e99915082615bed565b9050600e821115611eb057600f9350505050611eba565b611e4d565b509150505b92915050565b6001600160a01b0385166000908152601f6020526040812054816064611ee68689615b86565b611ef09190615c16565b905060006064611f008689615caf565b611f0a908a615b86565b611f149190615c16565b905060015b602954611f268385615caf565b1015611fe1576001600160a01b038a166000908152601f60205260409020611f4e8286615bed565b81548110611f5e57611f5e615bbe565b90600052602060002090600202016000015483611f7b9190615caf565b6001600160a01b038b166000908152601f60205260409020909350611fa08286615bed565b81548110611fb057611fb0615bbe565b90600052602060002090600202016001015482611fcd9190615caf565b915080611fd981615bd4565b915050611f19565b50600081611ff1846103e8615b86565b611ffb9190615c16565b9a9950505050505050505050565b6025546001600160a01b03821660009081526008602090815260408083205460059092528220549192839260649261204091615caf565b61204a9190615b86565b6120549190615c16565b9050602854811115611eba575060285492915050565b33600080516020615dbf833981519152146120975760405162461bcd60e51b81526004016114fa90615aca565b6024819055602382905560408051838152602081018390527f7faa84203e1b6ec193e81d9e27eb14c76b0d1069cbc5a386d0ae2f15458ede41910161155b565b80518251146121285760405162461bcd60e51b815260206004820152601960248201527f4172726179206c656e6774687320646f6e2774206d617463680000000000000060448201526064016114fa565b60c88251111561217a5760405162461bcd60e51b815260206004820152601a60248201527f546f6f206d616e7920616464726573736573206174206f6e636500000000000060448201526064016114fa565b6000805b835181101561231a57600083828151811061219b5761219b615bbe565b6020026020010151905060008583815181106121b9576121b9615bbe565b60200260200101519050336001600160a01b0316816001600160a01b0316036121e3575050612308565b6001600160a01b0381166000908152601660209081526040808320546008835281842054600790935290832054909161221b91615caf565b6122259190615caf565b905060265481111561225957600086858151811061224557612245615bbe565b602002602001018181525050505050612308565b6026546122668483615caf565b111561229c578060265461227a9190615bed565b92508286858151811061228f5761228f615bbe565b6020026020010181815250505b6122a68284614593565b6001600160a01b038216600090815260166020526040812080548592906122ce908490615caf565b909155505033600090815260066020526040812080548592906122f2908490615bed565b9091555061230290508386615caf565b94505050505b8061231281615bd4565b91505061217e565b507f857bbe8e26a451b79df5ebffe834e947aba1dfa5b2918951dde65306523a210d338260405161234c929190615c79565b60405180910390a17fa461fbc92aabf9b3583797a26a5686e2f42c37e0169c78dcd483b1127d8598328383604051611667929190615cc2565b33600080516020615dbf833981519152146123b25760405162461bcd60e51b81526004016114fa90615aca565b600080546001600160a01b0319166001600160a01b03831690811790915560405163095ea7b360e01b815273111120a4cfacf4c78e0d6729274fd5a5ae2b11119163095ea7b39161240a919060001990600401615c79565b6020604051808303816000875af1158015612429573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061244d9190615c92565b5060005460405163095ea7b360e01b815273e9e7cea3dedca5984780bafc599bd69add087d569163095ea7b391612494916001600160a01b03169060001990600401615c79565b6020604051808303816000875af11580156124b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124d79190615c92565b506040516001600160a01b03821681527f3153d002b244d7427874a391fcd3b7723d75a7a083c9f0aa057ff38d1c23ebce906020015b60405180910390a150565b33600080516020615dbf833981519152146125455760405162461bcd60e51b81526004016114fa90615aca565b60648111156125965760405162461bcd60e51b815260206004820152601960248201527f43616e27742074616b65206d6f7265207468616e20313030250000000000000060448201526064016114fa565b6040516370a0823160e01b81523060048201526001600160a01b0383169063a9059cbb903390606490859085906370a0823190602401602060405180830381865afa1580156125e9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061260d9190615ba5565b6126179190615b86565b6126219190615c16565b6040518363ffffffff1660e01b8152600401611c8f929190615c79565b336000908152601c602052604081205490036127a857336001600160a01b0382160361266c57506000612695565b336000908152601a6020526040902080546001600160a01b0319166001600160a01b0383161790555b604080513381526001600160a01b03831660208201527fc141ce544dea1e7767f01ca4e8e7df76f2c104e0e5bbfb2173e4b99799658d72910160405180910390a1336000908152601d602090815260408083209091528120805460ff191660011790555b600f8110156127a657336000908152601c602090815260408220805460018101825590835291200180546001600160a01b0319166001600160a01b0384169081179091551561279457336000908152601d602090815260408083206001600160a01b039586168452808352818420805460ff19166001179055601a8352818420549095168084529490915290205460ff161561279457600091505b8061279e81615bd4565b9150506126f9565b505b6040516323b872dd60e01b81523360048201523060248201526044810183905273111120a4cfacf4c78e0d6729274fd5a5ae2b1111906323b872dd906064016020604051808303816000875af1158015612806573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061282a9190615c92565b50336000908152601a602052604090205461284e906001600160a01b03168361462c565b33600090815260166020908152604080832054600883528184205460079093529083205493955091926128819190615caf565b61288b9190615caf565b60265490915061289b8483615caf565b11156128b95760405162461bcd60e51b81526004016114fa90615d46565b6027546128c68483615caf565b10156129105760405162461bcd60e51b815260206004820152601960248201527813195cdcc81d1a185b881b5a5b9a5b5d5b4819195c1bdcda5d603a1b60448201526064016114fa565b611cd23384614593565b6033546001600160a01b038216600090815260096020526040812054909182916129449190615c16565b6035546129519190615b86565b60325461295e9190615caf565b9050603454811115611eba575060345492915050565b33600080516020615dbf833981519152146129a15760405162461bcd60e51b81526004016114fa90615aca565b604051600090600080516020615dbf8339815191529047908381818185875af1925050503d80600081146129f1576040519150601f19603f3d011682016040523d82523d6000602084013e6129f6565b606091505b5050905080612a3b5760405162461bcd60e51b8152602060048201526011602482015270726573637565426e62206661696c65642160781b60448201526064016114fa565b6040517fa8de0dea500f77a13b141e29b404718e8cdd6ac813e35185f938499f4f95a59490600090a150565b3360009081526003602052604090205460ff16612a965760405162461bcd60e51b81526004016114fa90615b01565b606481603754612aa69190615b86565b612ab09190615c16565b603880546000908152603d602052604090209190915554611b4b90600a61449b565b600080546040516319b09e5f60e11b81526001600160a01b038481166004830152839216906333613cbe90602401602060405180830381865afa158015612b1d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b419190615ba5565b90506000611af3826130f5565b33600080516020615dbf83398151915214612b7b5760405162461bcd60e51b81526004016114fa90615aca565b600280546001600160a01b0319166001600160a01b03831690811790915560405163095ea7b360e01b815273111120a4cfacf4c78e0d6729274fd5a5ae2b11119163095ea7b391612bd3919060001990600401615c79565b6020604051808303816000875af1158015612bf2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c169190615c92565b5060025460405163095ea7b360e01b815273e9e7cea3dedca5984780bafc599bd69add087d569163095ea7b391612c5d916001600160a01b03169060001990600401615c79565b6020604051808303816000875af1158015612c7c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612ca09190615c92565b506040516001600160a01b03821681527fb003761af082bc7ba844287d7c11fb9bc756d6de66992025afff77d6636eeddb9060200161250d565b601c6020528160005260406000208181548110612cf657600080fd5b6000918252602090912001546001600160a01b03169150829050565b6001600160a01b0381166000908152601860209081526040808320546017909252822054611eba9190615caf565b33600080516020615dbf83398151915214612d6d5760405162461bcd60e51b81526004016114fa90615aca565b602c829055602d81905560408051838152602081018390527f60c3e9a8d735b42d4fa8b1e6b7233676674de3da872741c5c2a30d90f839db6c910161155b565b33600080516020615dbf83398151915214612dda5760405162461bcd60e51b81526004016114fa90615aca565b600180546001600160a01b0319166001600160a01b03831690811790915560405163095ea7b360e01b815273111120a4cfacf4c78e0d6729274fd5a5ae2b11119163095ea7b391612e32919060001990600401615c79565b6020604051808303816000875af1158015612e51573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612e759190615c92565b5060015460405163095ea7b360e01b815273e9e7cea3dedca5984780bafc599bd69add087d569163095ea7b391612ebc916001600160a01b03169060001990600401615c79565b6020604051808303816000875af1158015612edb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612eff9190615c92565b506040516001600160a01b03821681527f061b77b72b2300c712eb1566b374d2f3bafce44b3e7a667b0447d6f7bc37450f9060200161250d565b33600080516020615dbf83398151915214612f665760405162461bcd60e51b81526004016114fa90615aca565b60368190556040518181527fdd74946fcb0d87fdf16c9b3f3b568865a75ce99ddfa06f3816b914a9f9d6511d9060200161250d565b60006001600160a01b038216612fb357506000919050565b60015460405163f431a6e160e01b81526001600160a01b038481166004830152600092169063f431a6e190602401602060405180830381865afa158015612ffe573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906130229190615ba5565b90506118ce8382611dff565b61303d33878787878787613be2565b7f6d671b608a8819d48d3501862dbb56d420f82b8f68e35d6934cdca269482fb39338787878787876040516130789796959493929190615b2f565b60405180910390a1505050505050565b33600080516020615dbf833981519152146130b55760405162461bcd60e51b81526004016114fa90615aca565b6030829055603181905560408051838152602081018390527fdf33ee7a2f175f0b1e56048bc7c374e24d9b3282bbe3def65bc7420829fa388f910161155b565b600080734004d3856499d947564521511dcd28e1155c460b6001600160a01b03166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561314a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061316e9190615ba5565b6040516370a0823160e01b8152734004d3856499d947564521511dcd28e1155c460b600482015290915060009073e9e7cea3dedca5984780bafc599bd69add087d56906370a0823190602401602060405180830381865afa1580156131d7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906131fb9190615ba5565b905060008261320a8387615b86565b613215906002615b86565b61321f9190615c16565b95945050505050565b3360009081526003602052604081205460ff166132575760405162461bcd60e51b81526004016114fa90615b01565b6001600160a01b0384166000908152601c602052604081205490036133e757836001600160a01b0316826001600160a01b03160361329857600091506132c7565b6001600160a01b038481166000908152601a6020526040902080546001600160a01b0319169184169190911790555b604080516001600160a01b038087168252841660208201527fc141ce544dea1e7767f01ca4e8e7df76f2c104e0e5bbfb2173e4b99799658d72910160405180910390a16001600160a01b0384166000908152601d602090815260408083209091528120805460ff191660011790555b600f8110156133e5576001600160a01b038581166000908152601c602090815260408220805460018101825590835291200180546001600160a01b0319169185169182179055156133d3576001600160a01b038086166000908152601d602090815260408083209684168352868252808320805460ff19166001179055601a825280832054909316808352959052205460ff16156133d357600092505b806133dd81615bd4565b915050613336565b505b6040516323b872dd60e01b81523360048201523060248201526044810184905273111120a4cfacf4c78e0d6729274fd5a5ae2b1111906323b872dd906064016020604051808303816000875af1158015613445573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906134699190615c92565b506001600160a01b038085166000908152601a602052604090205461348f911684614715565b6001600160a01b038516600090815260166020908152604080832054600883528184205460079093529083205493965091926134cb9190615caf565b6134d59190615caf565b6026549091506134e58583615caf565b11156135035760405162461bcd60e51b81526004016114fa90615d46565b6027546135108583615caf565b101561355a5760405162461bcd60e51b815260206004820152601960248201527813195cdcc81d1a185b881b5a5b9a5b5d5b4819195c1bdcda5d603a1b60448201526064016114fa565b6135648585614593565b50919392505050565b6027546001600160a01b03821660009081526008602090815260408083205460059092528220549192916135a19190615caf565b10156135af57506000919050565b506001919050565b6001600160a01b0381166000908152600f602052604081205460ff16156135e057505060205490565b6001600160a01b038216600090815260166020908152604080832054600883528184205460079093529220546136169190615caf565b6136209190615bed565b6001600160a01b038316600090815260146020526040902054111561364757505060225490565b505060215490565b60006001600160a01b03831661366757506000611eba565b60015460405163f431a6e160e01b81526001600160a01b038581166004830152600092169063f431a6e190602401602060405180830381865afa1580156136b2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906136d69190615ba5565b9050828111156136ea576001915050611eba565b6136f48482611dff565b905082811115613708576001915050611eba565b5060009392505050565b33600080516020615dbf8339815191521461373f5760405162461bcd60e51b81526004016114fa90615aca565b61374b82610e10615b86565b602a5561375b8162015180615b86565b60295560408051838152602081018390527ffa06a9b7f12742aa22dc8a9b3a9248b981daf3a4b45bc7cdec0a336a0356036b910161155b565b33600080516020615dbf833981519152146137c15760405162461bcd60e51b81526004016114fa90615aca565b6137d381670de0b6b3a7640000615b86565b6000838152601e60209081526040918290209290925580518481529182018390527f62e5557902d294e63e89d9491ce41f3b04ab64579cf0469142cd85f62dfbcb08910161155b565b601f602052816000526040600020818154811061383857600080fd5b600091825260209091206002909102018054600190910154909250905082565b33600080516020615dbf833981519152146138855760405162461bcd60e51b81526004016114fa90615aca565b60008060008060005b8a811015613ad4578b8b828181106138a8576138a8615bbe565b90506020020160208101906138bd9190615534565b92508787828181106138d1576138d1615bbe565b90506020020160208101906138e69190615534565b604080516001600160a01b038087168252831660208201529193507fc141ce544dea1e7767f01ca4e8e7df76f2c104e0e5bbfb2173e4b99799658d72910160405180910390a16001600160a01b038381166000908152601a6020526040902080546001600160a01b03191691841691909117905561397c828b8b8481811061397057613970615bbe565b9050602002013561462c565b6001600160a01b03841660009081526019602090815260408083208a9055600d82528083206103e890558051808201909152828152908101829052602954929650916139cc906201518090615c16565b61a8c08084526020840152905060015b818111613a31576001600160a01b0386166000908152601f6020908152604082208054600181810183559184529282902086516002909402019283559085015191015580613a2981615bd4565b9150506139dc565b506021546001600160a01b0386166000908152600b6020908152604080832093909355602354600e825283832055601281528282208b9055600590529081208054889290613a80908490615caf565b90915550506001600160a01b03851660009081526007602052604081208054889290613aad908490615caf565b90915550613abd90508688615caf565b965050508080613acc90615bd4565b91505061388e565b506040516323b872dd60e01b81523360048201523060248201526044810185905273111120a4cfacf4c78e0d6729274fd5a5ae2b1111906323b872dd906064016020604051808303816000875af1158015613b33573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613b579190615c92565b505050505050505050505050565b33600080516020615dbf83398151915214613b925760405162461bcd60e51b81526004016114fa90615aca565b6025829055613ba9670de0b6b3a764000082615b86565b60285560408051838152602081018390527ff337c059bbf6df8e79a45075755db25c98dcf3ef9f7fb677d294f1b12babb925910161155b565b8115613c105782158015613bf4575080155b613c105760405162461bcd60e51b81526004016114fa90615d73565b8215613c3e5781158015613c22575080155b613c3e5760405162461bcd60e51b81526004016114fa90615d73565b8015613c6c5782158015613c50575081155b613c6c5760405162461bcd60e51b81526004016114fa90615d73565b6001600160a01b03871660009081526010602052604090205460ff16614492576027546001600160a01b038816600090815260086020908152604080832054600590925290912054613cbe9190615caf565b106144925783613cce8688615caf565b613cd89190615caf565b606414613d3a5760405162461bcd60e51b815260206004820152602a60248201527f416c6c20617661696c61626c652072657761726473206861766520746f20626560448201526908185b1b1bd8d85d195960b21b60648201526084016114fa565b602a546001600160a01b038816600090815260126020526040812054909190613d639042615bed565b11613d90576001600160a01b038816600090815260126020526040902054613d8b9042615bed565b613d94565b602a545b6001600160a01b0389166000908152601260209081526040808320429055602a54600b835281842054600590935290832054939450919284916103e891613ddb9190615b86565b613de59190615c16565b613def9190615b86565b613df99190615c16565b90506000613e068a614831565b6001600160a01b038b16600090815260096020526040902054909150613e2d908390615caf565b811015613e41576064975060009650600098505b6001600160a01b038a1660009081526011602052604090205460ff1615613e775750602854613e70888a615caf565b9850600097505b6028546001600160a01b038b16600090815260096020526040902054613e9e908490615caf565b1115613f22576001600160a01b038a16600090815260096020526040902054613ec79082615bed565b6001600160a01b038b16600081815260106020908152604091829020805460ff1916600117905590519182529193507f43ecfe8e9cbbb73d1c72b1c520c3d88350cac4fb37a0f4fb2fb39809744f27be910160405180910390a15b81600003613f3257505050614492565b6001600160a01b038a1660009081526009602052604081208054849290613f5a908490615caf565b90915550613f6990508a6148e5565b6001600160a01b038a1660009081526008602090815260408083205460059092528220805491929091613f9d908490615caf565b90915550506001600160a01b038a1660009081526008602090815260408083205460079092528220805491929091613fd6908490615caf565b90915550506001600160a01b038a166000908152600860209081526040808320839055600c90915281205460649061400e9085615b86565b6140189190615c16565b604080516001600160a01b038e168152602081018390529081018b9052606081018c9052608081018a90529091507f32b6191f6cf8358f1c1ff91d5284bf0f29b7726229d4831695183cf1d744af139060a00160405180910390a161407d8184615bed565b6001600160a01b038c166000908152600a60205260408120805492955085929091906140aa908490615caf565b909155505089156142f757600060646140c3858d615b86565b6140cd9190615c16565b9050600060646140dd8d85615b86565b6140e79190615c16565b905087156140fe576140f98d83614968565b614185565b73111120a4cfacf4c78e0d6729274fd5a5ae2b11116001600160a01b031663a9059cbb8e846040518363ffffffff1660e01b8152600401614140929190615c79565b6020604051808303816000875af115801561415f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906141839190615c92565b505b604080516001600160a01b038f168152602081018490529081018290527f92ccf450a286a957af52509bc1c9939d1a6a481783e142e41e2499f0bb66ebc69060600160405180910390a1881561424b57600260009054906101000a90046001600160a01b03166001600160a01b0316630f09fb2b8e846040518363ffffffff1660e01b8152600401614218929190615c79565b600060405180830381600087803b15801561423257600080fd5b505af1158015614246573d6000803e3d6000fd5b505050505b86156142c757600260009054906101000a90046001600160a01b03166001600160a01b031663160f99c18e846040518363ffffffff1660e01b8152600401614294929190615c79565b600060405180830381600087803b1580156142ae57600080fd5b505af11580156142c2573d6000803e3d6000fd5b505050505b6001600160a01b038d16600090815260146020526040812080548492906142ef908490615caf565b909155505050505b88156143a5576000606461430b858c615b86565b6143159190615c16565b9050600060646143258c85615b86565b61432f9190615c16565b905061433c8d8383614a99565b7fc16de066392da7e40ceccb739c331fc48a2e76bf147449613c48023d960eec328d8360405161436d929190615c79565b60405180910390a16001600160a01b038d166000908152601360205260408120805484929061439d908490615caf565b909155505050505b871561448057600060646143b9858b615b86565b6143c39190615c16565b9050600060646143d38b85615b86565b6143dd9190615c16565b90506143e98d82614b08565b6001600160a01b038d1660009081526006602052604081208054849290614411908490615caf565b90915550506040517f371da857a495d18f283658629e64f5353d32967cd0499e7bcf0248aaca5cd45790614448908f908590615c79565b60405180910390a16001600160a01b038d1660009081526015602052604081208054849290614478908490615caf565b909155505050505b61448d8b858c8c8c614c67565b505050505b50505050505050565b6040516307d4f3c160e21b8152600481018390526024810182905273c0de0ab6e25cc34fb26de4617313ca559f78c0de90631f53cf049066071afd498d0000906044016000604051808303818588803b1580156144f757600080fd5b505af1158015614492573d6000803e3d6000fd5b60008060005b835181101561370857603b8054855186908490811061453257614532615bbe565b60200260200101516145449190615daa565b8154811061455457614554615bbe565b60009182526020822001546001600160a01b0316925061457590839061364f565b15614581575092915050565b8061458b81615bd4565b915050614511565b8060000361459f575050565b6001600160a01b03821660009081526019602052604081205490036145cd576145c882826150e0565b6145fb565b6001600160a01b038216600090815260086020526040812080548392906145f5908490615caf565b90915550505b7fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c828260405161155b929190615c79565b6000806064602c548461463f9190615b86565b6146499190615c16565b90506001600160a01b03841661466b576146638184615bed565b915050611eba565b60006064602d548561467d9190615b86565b6146879190615c16565b905061469485600061364f565b1561470b576146a38582614593565b6001600160a01b038516600090815260186020526040812080548392906146cb908490615caf565b90915550506040517fc7179a47e2d73b6df8f2b5d49e0682835761abe036064c834717c5b58435dee4906147029087908490615c79565b60405180910390a15b61321f8285615bed565b600080602b5460646147279190615bed565b614732846064615b86565b61473c9190615c16565b905060006064602e54836147509190615b86565b61475a9190615c16565b90506001600160a01b03851661477d576147748185615bed565b92505050611eba565b60006064602f548461478f9190615b86565b6147999190615c16565b90506147a686600061364f565b1561481d576147b58682614593565b6001600160a01b038616600090815260186020526040812080548392906147dd908490615caf565b90915550506040517fc7179a47e2d73b6df8f2b5d49e0682835761abe036064c834717c5b58435dee4906148149088908490615c79565b60405180910390a15b6148278286615bed565b9695505050505050565b6025546001600160a01b03821660009081526008602090815260408083205460059092528220549192839260649261486891615caf565b6148729190615b86565b61487c9190615c16565b9050602854811115611eba576001600160a01b038316600081815260116020908152604091829020805460ff1916600117905590519182527f432f3c8f1e9bdcdf4ee47e234177e38a3a97809c68e76735ea926cdf250da72f910160405180910390a192915050565b6033546001600160a01b03821660009081526009602052604090205461490b9190615c16565b6035546149189190615b86565b6032546149259190615caf565b6001600160a01b0382166000908152600c6020526040902081905560345410156117b9576034546001600160a01b0382166000908152600c602052604090205550565b6001600160a01b038083166000908152601a602052604090205461498d91168261462c565b6001600160a01b038316600090815260166020908152604080832054600883528184205460079093529083205493945091926149c99190615caf565b6149d39190615caf565b6026549091506149e38383615caf565b1115614a015760405162461bcd60e51b81526004016114fa90615d46565b614a0b8383614593565b6001600160a01b03831660009081526008602090815260408083205460059092528220805491929091614a3f908490615caf565b90915550506001600160a01b03831660009081526008602090815260408083205460079092528220805491929091614a78908490615caf565b909155505050506001600160a01b0316600090815260086020526040812055565b6001600160a01b03831660009081526005602052604081208054849290614ac1908490615caf565b90915550506001600160a01b0383166000908152600c6020526040812054603054614aec9084615b86565b614af69190615c16565b9050614b02848261523c565b50505050565b6031546001600160a01b0383166000908152600c6020526040812054909190614b319084615c16565b614b3b9190615b86565b60405163a9059cbb60e01b815290915073111120a4cfacf4c78e0d6729274fd5a5ae2b11119063a9059cbb90614b8b90734004d3856499d947564521511dcd28e1155c460b908590600401615c79565b6020604051808303816000875af1158015614baa573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190614bce9190615c92565b50734004d3856499d947564521511dcd28e1155c460b6001600160a01b031663fff6cae96040518163ffffffff1660e01b8152600401600060405180830381600087803b158015614c1e57600080fd5b505af1158015614c32573d6000803e3d6000fd5b505050507fa758ba70582bcbe64d7d78a314f251fd6406f38748e31d9ef59ae5df5ee303e68160405161166791815260200190565b6001600160a01b0385166000908152601f6020908152604080832054815180830190925283825291810192909252906064614ca28588615b86565b614cac9190615c16565b81526064614cba8487615caf565b614cc49088615b86565b614cce9190615c16565b60208083019182526001600160a01b0389166000908152601f82526040812080546001818101835591835292822085516002909402019283559251919092015580805b602954614d1e8385615caf565b1015614dd9576001600160a01b038a166000908152601f60205260409020614d468287615bed565b81548110614d5657614d56615bbe565b90600052602060002090600202016000015483614d739190615caf565b6001600160a01b038b166000908152601f60205260409020909350614d988287615bed565b81548110614da857614da8615bbe565b90600052602060002090600202016001015482614dc59190615caf565b915080614dd181615bd4565b915050614d11565b50600081614de9846103e8615b86565b614df39190615c16565b6001600160a01b038b166000908152600e6020526040902054909150811115614e1f57614e1f8a615419565b6001600160a01b038a166000908152600e6020526040902054811115614ead5760405162461bcd60e51b815260206004820152603e60248201527f43575220746f6f20686967682c20696e63726561736520796f7572206d61782060448201527f4357522062792070757263686173696e672061204c6567616379204e4654000060648201526084016114fa565b6001600160a01b038a166000908152600d60209081526040808320849055600f90915290205460ff166150d45760245481108015614f0457506001600160a01b038a1660009081526011602052604090205460ff16155b15614f77576001600160a01b038a166000818152600f60209081526040808320805460ff191660011790558154600b8352928190209290925590519182527f561fae4ad43ccac317ad39028a07bae8cfef1b0ea03935d1d9dfd5328ebb9848910160405180910390a15050505050611a36565b6001600160a01b038a1660009081526016602090815260408083205460088352818420546007909352922054614fad9190615caf565b614fb79190615bed565b6001600160a01b038b16600090815260146020526040902054111561505a576021546001600160a01b038b166000908152600b60205260409020540361505a576040516001600160a01b038b1681527f89da702fc215c0ef519362e5d921a67b471416d1167eaae0de1239ebf1d1816e9060200160405180910390a150506022546001600160a01b0389166000908152600b602052604090205550611a36915050565b6022546001600160a01b038b166000908152600b6020526040902054036150d4576040516001600160a01b038b1681527f81443f8f8af71e19272b96a5925011033d1c512bd6793ea58fff7fbbd8eb1e1c9060200160405180910390a16021546001600160a01b038b166000908152600b60205260409020555b50505050505050505050565b6001600160a01b0382166000908152601960209081526040808320429055600d82528083206103e8905580518082019091528281529081019190915260006201518060295461512f9190615c16565b61a8c08084526020840152905060015b818111615194576001600160a01b0385166000908152601f602090815260408220805460018181018355918452928290208651600290940201928355908501519101558061518c81615bd4565b91505061513f565b506021546001600160a01b0385166000908152600b6020908152604080832093909355602354600e82528383205560128152828220429055600581528282208690556007905290812084905560048054916151ee83615bd4565b9091555050604080516001600160a01b03861681526020810185905242918101919091527f2f8552207eb58998f17d6c05f783de2dce757a6eb80efe31fd8abca40310bcdc9060600161184e565b6001600160a01b0382166000908152601b6020908152604080832054601c909252822080549192918390811061527457615274615bbe565b6000918252602090912001546001600160a01b0316905080158061529f575061529d818361364f565b155b156153205760006064603654856152b69190615b86565b6152c09190615c16565b905080603760008282546152d49190615caf565b9091555050604080518281526001600160a01b03841660208201527fcd067b9603322036754bf90f8bb4ff9e2e3bba590f24fff73719f9e76337d848910160405180910390a1506153b2565b61532a8184614593565b6001600160a01b03811660009081526017602052604081208054859290615352908490615caf565b90915550506001600160a01b038481166000908152601b6020908152604091829020548251938516845290830186905282820152517f5eb78c649ae31908f20fd1198500ec329d7fe42f60f124831418961158ba10619181900360600190a15b6001600160a01b0384166000908152601b602052604081208054916153d683615bd4565b90915550506001600160a01b0384166000908152601b6020526040902054600e1015614b02575050506001600160a01b03166000908152601b6020526040812055565b6001546040516303a4d02160e11b81526001600160a01b03838116600483015290911690630749a04290602401602060405180830381865afa158015615463573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906154879190615ba5565b6001600160a01b0382166000908152600e602052604090819020829055517f3b4271ca0c795a5e8a7ab73df04f34cbc9495c12230d12a0814ebbdc7df17a2f9161250d91849190615c79565b80356001600160a01b03811681146154ea57600080fd5b919050565b80151581146117b957600080fd5b6000806040838503121561551057600080fd5b615519836154d3565b91506020830135615529816154ef565b809150509250929050565b60006020828403121561554657600080fd5b6118ce826154d3565b600080600080600080600060e0888a03121561556a57600080fd5b615573886154d3565b96506020880135955060408801359450606088013593506080880135615598816154ef565b925060a08801356155a8816154ef565b915060c08801356155b8816154ef565b8091505092959891949750929550565b6000806000606084860312156155dd57600080fd5b505081359360208301359350604090920135919050565b6000806040838503121561560757600080fd5b50508035926020909101359150565b6000806000806080858703121561562c57600080fd5b5050823594602084013594506040840135936060013592509050565b60008083601f84011261565a57600080fd5b50813567ffffffffffffffff81111561567257600080fd5b6020830191508360208260051b850101111561568d57600080fd5b9250929050565b600080602083850312156156a757600080fd5b823567ffffffffffffffff8111156156be57600080fd5b6156ca85828601615648565b90969095509350505050565b6000602082840312156156e857600080fd5b5035919050565b6000806040838503121561570257600080fd5b61570b836154d3565b9150615719602084016154d3565b90509250929050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561576157615761615722565b604052919050565b600067ffffffffffffffff82111561578357615783615722565b5060051b60200190565b600082601f83011261579e57600080fd5b813560206157b36157ae83615769565b615738565b82815260059290921b840181019181810190868411156157d257600080fd5b8286015b848110156157ed57803583529183019183016157d6565b509695505050505050565b6000806040838503121561580b57600080fd5b82359150602083013567ffffffffffffffff81111561582957600080fd5b6158358582860161578d565b9150509250929050565b6000806040838503121561585257600080fd5b61585b836154d3565b946020939093013593505050565b600080600080600060a0868803121561588157600080fd5b61588a866154d3565b97602087013597506040870135966060810135965060800135945092505050565b600080604083850312156158be57600080fd5b823567ffffffffffffffff808211156158d657600080fd5b818501915085601f8301126158ea57600080fd5b813560206158fa6157ae83615769565b82815260059290921b8401810191818101908984111561591957600080fd5b948201945b8386101561593e5761592f866154d3565b8252948201949082019061591e565b9650508601359250508082111561595457600080fd5b506158358582860161578d565b6000806040838503121561597457600080fd5b82359150615719602084016154d3565b60008060008060008060c0878903121561599d57600080fd5b86359550602087013594506040870135935060608701356159bd816154ef565b925060808701356159cd816154ef565b915060a08701356159dd816154ef565b809150509295509295509295565b600080600060608486031215615a0057600080fd5b615a09846154d3565b925060208401359150615a1e604085016154d3565b90509250925092565b60008060008060008060006080888a031215615a4257600080fd5b873567ffffffffffffffff80821115615a5a57600080fd5b615a668b838c01615648565b909950975060208a0135915080821115615a7f57600080fd5b615a8b8b838c01615648565b909750955060408a0135915080821115615aa457600080fd5b50615ab18a828b01615648565b989b979a50959894979596606090950135949350505050565b60208082526018908201527f4f6e6c79207468652043454f2063616e20646f20746861740000000000000000604082015260600190565b60208082526014908201527313db9b1e48105492c818d85b88191bc81d1a185d60621b604082015260600190565b6001600160a01b0397909716875260208701959095526040860193909352606085019190915215156080840152151560a0830152151560c082015260e00190565b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615615ba057615ba0615b70565b500290565b600060208284031215615bb757600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b600060018201615be657615be6615b70565b5060010190565b81810381811115611eba57611eba615b70565b634e487b7160e01b600052601260045260246000fd5b600082615c2557615c25615c00565b500490565b8082018281126000831280158216821582161715615c4a57615c4a615b70565b505092915050565b8181036000831280158383131683831282161715615c7257615c72615b70565b5092915050565b6001600160a01b03929092168252602082015260400190565b600060208284031215615ca457600080fd5b81516118ce816154ef565b80820180821115611eba57611eba615b70565b604080825283519082018190526000906020906060840190828701845b82811015615d045781516001600160a01b031684529284019290840190600101615cdf565b5050508381038285015284518082528583019183019060005b81811015615d3957835183529284019291840191600101615d1d565b5090979650505050505050565b602080825260139082015272115e18d959591cc81b585e0819195c1bdcda5d606a1b604082015260600190565b6020808252601b908201527f4f6e6c79206f6e65206175746f416374696f6e20616c6c6f7765640000000000604082015260600190565b600082615db957615db9615c00565b50069056fe000000000000000000000000df0048df98a749ed36553788b4b449ea7a7baa88a2646970667358221220bcb90eb5fadc4ce1ac93380319235475b25319aa2ea4d6b01f10a134b931820764736f6c63430008100033';
