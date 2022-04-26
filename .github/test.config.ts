type Account = {
	address: string;
	privateKey: string;
	balance: string;
};

export const accounts: Account[] = [
	{
		address: '0xdc6bad79dab7ea733098f66f6c6f9dd008da3258',
		privateKey: '0x4c3758228f536f7a210f8936182fb5b728046970b8e3215d0b5cb4c4faae8a4e',
		balance: '100',
	},
	{
		address: '0x962f9a9c2a6c092474d24def35eccb3d9363265e',
		privateKey: '0x34aeb1f338c17e6b440c189655c89fcef148893a24a7f15c0cb666d9cf5eacb3',
		balance: '100',
	},
];
export const clientUrl = 'http://localhost:8545';
export const clientWsUrl = 'ws://localhost:8545';
