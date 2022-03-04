import { PromiEvent } from '../../src/promi_event';

describe('PromiEvent', () => {
	it('should initialize and resolve promise', async () => {
		const p = new PromiEvent(resolve => {
			resolve('Resolved Value');
		});

		await expect(p).resolves.toBe('Resolved Value');
	});

	it('should initialize and reject promise', async () => {
		const p = new PromiEvent((_, reject) => {
			reject(new Error('My Error'));
		});

		await expect(p).rejects.toThrow('My Error');
	});

	it('should initialize and emit event', async () => {
		return new Promise(done => {
			const p = new PromiEvent<string, { data: string }>(resolve => {
				resolve('resolved value');
			});

			p.on('data', data => {
				expect(data).toBe('resolved value');
				done(null);
			});

			p.then(data => {
				p.emit('data', data);
			}).catch(e => {
				throw e;
			});
		});
	});

	it('should initialize and emit later', async () => {
		return new Promise(done => {
			const func = () => {
				const p = new PromiEvent<string, { data: string }>(resolve => {
					resolve('resolved value');
				});

				setImmediate(() => {
					p.emit('data', 'emitted data');
				});

				return p;
			};

			const p = func();

			p.on('data', data => {
				expect(data).toBe('emitted data');
				done(null);
			});
		});
	});
});
