import { Contract } from '../../src';
import { accounts } from '../shared_fixtures/integration_test_accounts';
import { greeterByteCode, greeterContractAbi } from '../shared_fixtures/sources/Greeter';

describe('contract', () => {
	describe('clone', () => {
		let contract: Contract<typeof greeterContractAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;

		beforeEach(() => {
			contract = new Contract(greeterContractAbi, undefined, {
				provider: 'http://localhost:8545',
			});

			deployOptions = {
				data: greeterByteCode,
				arguments: ['My Greeting'],
			};

			sendOptions = { from: accounts[0].address, gas: '1000000' };
		});

		it('should clone the contract but with same address', async () => {
			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

			const newContract = deployedContract.clone();

			expect(newContract).toBeInstanceOf(Contract);
			expect(newContract).not.toBe(deployedContract);
			expect(newContract.options.address).toBe(deployedContract.options.address);
		});
	});
});
