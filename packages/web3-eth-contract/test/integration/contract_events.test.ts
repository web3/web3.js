import { Web3BaseProvider } from 'web3-common';
import { Contract } from '../../src';
import { accounts } from '../shared_fixtures/integration_test_accounts';
import { greeterByteCode, greeterContractAbi } from '../shared_fixtures/sources/Greeter';

// eslint-disable-next-line no-promise-executor-return
// const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const processAsync = async (
	processFunc: (resolver: (value: unknown) => void) => Promise<unknown>,
) =>
	new Promise(resolve => {
		(async () => {
			await processFunc(resolve);
		})() as unknown;
	});

describe('contract', () => {
	describe('events', () => {
		let contract: Contract<typeof greeterContractAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;

		beforeEach(async () => {
			contract = new Contract(greeterContractAbi, undefined, {
				provider: 'ws://localhost:8545',
			});

			deployOptions = {
				data: greeterByteCode,
				arguments: ['My Greeting'],
			};

			sendOptions = { from: accounts[0].address, gas: '1000000' };

			contract = await contract.deploy(deployOptions).send(sendOptions);
		});

		afterAll(async () => {
			(contract.provider as Web3BaseProvider).disconnect(1, 'message');
		});

		it('should trigger the "contract.events.<eventName>"', async () => {
			return expect(
				processAsync(async resolve => {
					const event = await contract.events.GREETING_CHANGED();

					event.on('data', data => {
						resolve(data);
						// event.removeAllListeners();
					});

					// trigger event
					await contract.methods.setGreeting('Hello World From Event').send(sendOptions);
				}),
			).resolves.toEqual(
				expect.objectContaining({
					event: 'GREETING_CHANGED',
				}),
			);
		});

		it.todo('contract.getPastEvents');
	});
});
