import { Web3Subscription } from '../../../src/web3_subscriptions';

export class ExampleSubscription extends Web3Subscription<{ data: string }, { param1: string }> {
	protected _buildSubscriptionParams() {
		return this.args;
	}
}
