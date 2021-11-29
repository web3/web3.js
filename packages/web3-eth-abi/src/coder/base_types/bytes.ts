import { Reader, ReaderOptions, Writer, WriterOptions } from '../..';

export const writeBytes: Writer<Buffer> = (value: Buffer, options: WriterOptions) => {
	const bufValue = Buffer.alloc((value.length / options.wordSize) * options.wordSize, value);
	const bufLength = Buffer.alloc(options.wordSize);
	bufLength.writeInt32BE(value.length);

	return {
		head: Buffer.alloc(options.wordSize),
		tail: Buffer.concat([bufLength, bufValue]),
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
