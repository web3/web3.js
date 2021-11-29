import { Reader, ReaderOptions, Writer, WriterOptions } from '../..';
import { padZeros } from '../../utils';

export const writeUint: Writer<bigint | number> = (
	value: bigint | number,
	options: WriterOptions,
) => {
	let buf: Buffer;

	if (typeof value === 'bigint') {
		buf = Buffer.alloc(8);
		buf.writeBigUInt64BE(value);
	} else {
		buf = Buffer.alloc(4);
		buf.writeUInt32BE(value);
	}

	return {
		head: padZeros(buf, options.wordSize, 'left'),
		tail: Buffer.alloc(0),
		refreshHead: false,
	};
};

// TODO: Fix it
export const readUint: Reader<bigint | number> = (
	_buffer: Buffer,
	offset: number,
	options: ReaderOptions,
) => ({
	value: 0,
	offset: offset + options.wordSize,
});
