import { Reader, ReaderOptions, Writer, WriterOptions } from '../..';

export const writeInt: Writer<bigint | number> = (
	value: bigint | number,
	options: WriterOptions,
) => {
	const buf = Buffer.alloc(options.wordSize);

	if (typeof value === 'bigint') {
		buf.writeBigInt64LE(value);
	} else {
		buf.writeInt32LE(value);
	}

	return {
		head: buf,
		tail: Buffer.alloc(0),
		refreshHead: false,
	};
};

// TODO: Fix it
export const readInt: Reader<bigint | number> = (
	_buffer: Buffer,
	offset: number,
	options: ReaderOptions,
) => ({
	value: 0,
	offset: offset + options.wordSize,
});
