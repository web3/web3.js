import { Uint } from 'web3-utils';
import { Reader, ReaderOptions, Writer, WriterOptions } from '../../types';
import { padZeros } from '../../utils';

export const writeUint: Writer<Uint> = (value: Uint, options: WriterOptions) => {
	let buf: Buffer;

	if (typeof value === 'bigint') {
		buf = Buffer.alloc(8);
		buf.writeBigUInt64BE(value);
	} else if (typeof value === 'number') {
		buf = Buffer.alloc(4);
		buf.writeUInt32BE(value);
	} else {
		buf = Buffer.alloc(4);
		buf.writeUInt32BE(parseInt(value, 10));
	}

	return {
		head: padZeros(buf, options.wordSize, 'left'),
		tail: Buffer.alloc(0),
		refreshHead: false,
	};
};

// TODO: Fix it
export const readUint: Reader<Uint> = (
	_buffer: Buffer,
	offset: number,
	options: ReaderOptions,
) => ({
	value: '0',
	offset: offset + options.wordSize,
});
