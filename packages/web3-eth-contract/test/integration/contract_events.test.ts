import { Contract } from '../../src';
import { accounts } from '../shared_fixtures/integration_test_accounts';
import { basicContractAbi, basicContractByteCode } from '../shared_fixtures/sources/Basic';
import { processAsync } from '../shared_fixtures/utils';

describe('contract', () => {
	let contract: Contract<typeof basicContractAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;

	beforeEach(async () => {
		contract = new Contract(basicContractAbi, undefined, {
			provider: 'ws://localhost:8545',
		});

		deployOptions = {
			data: basicContractByteCode,
			arguments: [10, 'string init value'],
		};

		sendOptions = { from: accounts[0].address, gas: '1000000' };

		contract = await contract.deploy(deployOptions).send(sendOptions);
	});

	describe('events', () => {
		it('should trigger the "contract.events.<eventName>"', async () => {
			return expect(
				processAsync(async resolve => {
					const event = await contract.events.MultiValueEvent();

					event.on('data', resolve);

					// trigger event
					await contract.methods
						.firesMultiValueEvent('value', 12, true)
						.send(sendOptions);
				}),
			).resolves.toEqual(
				expect.objectContaining({
					event: 'MultiValueEvent',
				}),
			);
		});

		it('should trigger the "contract.events.<eventName>" for indexed parameters', async () => {
			return expect(
				processAsync(async resolve => {
					const event = await contract.events.MultiValueIndexedEvent({
						filter: { val: 100 },
					});

					event.on('data', resolve);

					// trigger event
					await contract.methods
						.firesMultiValueIndexedEvent('value', 12, true)
						.send(sendOptions);
					await contract.methods
						.firesMultiValueIndexedEvent('value', 100, true)
						.send(sendOptions);
				}),
			).resolves.toEqual(
				expect.objectContaining({
					event: 'MultiValueIndexedEvent',
					returnValue: expect.objectContaining({ val: '100' }),
				}),
			);
		});

		it('should trigger when "fromBlock" is passed to contract.events.<eventName>', async () => {
			return expect(
				processAsync(async resolve => {
					const event = await contract.events.MultiValueEvent({ fromBlock: 'latest' });

					event.on('data', resolve);

					// trigger event
					await contract.methods
						.firesMultiValueEvent('Event Value', 11, false)
						.send(sendOptions);
				}),
			).resolves.toEqual(
				expect.objectContaining({
					event: 'MultiValueEvent',
				}),
			);
		});
	});

	describe('getPastEvents', () => {
		// TODO: Debug why this tests is hanging the websocket
		it('should return all past events', async () => {
			await contract.methods
				.firesMultiValueEvent('New Greeting 1', 11, true)
				.send(sendOptions);
			await contract.methods
				.firesMultiValueEvent('New Greeting 2', 12, true)
				.send(sendOptions);

			expect(
				await contract.getPastEvents('MultiValueEvent', {
					fromBlock: 'earliest',
					toBlock: 'latest',
				}),
			).toHaveLength(2);
		});
	});
});
