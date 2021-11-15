import { Web3Subscription } from '../../../src/web3_subscriptions';

export class ExampleSubscription extends Web3Subscription<{ data: string }, { param1: string }> {
	// eslint-disable-next-line class-methods-use-this
	protected _buildSubscriptionParams() {
		return ['newHeads'] as ['newHeads'];
	}
}
