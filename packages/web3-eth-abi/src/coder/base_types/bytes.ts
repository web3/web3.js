import { writeUint } from './uint';
import { padZeros, Reader, ReaderOptions, Writer, WriterOptions } from '../..';

export const writeBytes: Writer<Buffer> = (value: Buffer, options: WriterOptions) => {
	const {
		param: { size, dynamic },
		wordSize,
	} = options;

	if (size && value.length > size) {
		throw new Error(`Byte value ${value.toString()} exceeded the size: ${size}`);
	}

	const bufSize = (value.length / wordSize) * wordSize;
	const bufValue = padZeros(Buffer.alloc(bufSize, value), Math.max(bufSize, wordSize), 'right');

	if (!dynamic) {
		return {
			head: bufValue,
			tail: Buffer.alloc(0),
			refreshHead: false,
		};
	}

	return {
		head: Buffer.alloc(options.wordSize),
		tail: Buffer.concat([writeUint(value.length.toString(), options).head, bufValue]),
		refreshHead: true,
	};
};

// TODO: Fix this
export const readBytes: Reader<Buffer> = (
	buffer: Buffer,
	offset: number,
	options: ReaderOptions,
) => ({
	value: buffer,
	offset: offset + options.wordSize,
});
