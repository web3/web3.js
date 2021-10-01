export class BigDecimal {
	private readonly bigint: bigint;
	private readonly decimals: number;

	public constructor(value: bigint | string, decimals?: number) {
		if (typeof value === 'string' && decimals) {
			throw new Error('Can not specify decimal with string value');
		}

		if (typeof value === 'string') {
			try {
				const [integer, fraction] = String(value).split('.').concat('');
				this.decimals = decimals ?? fraction.length;
				this.bigint = BigInt(`${integer}${fraction.padEnd(this.decimals, '0')}`);
			} catch {
				throw new Error(`Invalid value given "${value}". Error: not a valid integer.`);
			}
		} else {
			this.bigint = BigInt(value);
			this.decimals = decimals ?? 0;
		}
	}

	public divide(divisor: BigDecimal): BigDecimal {
		const d = divisor.decimals !== 0 ? divisor.decimals : divisor.bigint.toString().length - 1;

		return new BigDecimal((this.bigint * BigInt(`1${'0'.repeat(d)}`)) / divisor.bigint, d);
	}

	public mul(divisor: BigDecimal): BigDecimal {
		const d = this.decimals > divisor.decimals ? this.decimals : divisor.decimals;

		return new BigDecimal(this.bigint * divisor.bigint, d);
	}

	public toString() {
		if (this.decimals === 0) {
			return this.bigint.toString();
		}
		const s = this.bigint.toString().padStart(this.decimals + 1, '0');

		const integer = s.slice(0, -this.decimals);
		const fraction = s.slice(-this.decimals).replace(/\.?0+$/, '');

		if (fraction === '') {
			return integer;
		}

		return `${integer}.${fraction}`;
	}
}
