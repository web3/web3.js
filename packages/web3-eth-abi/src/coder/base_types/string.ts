import { Reader, ReaderOptions, Writer, WriterOptions } from '../..';

export const writeString: Writer<string> = (value: string, options: WriterOptions) => {
	const bufValue = Buffer.alloc(
		(value.length / options.wordSize) * options.wordSize,
		Buffer.from(value, 'utf8'),
	);
	const bufLength = Buffer.alloc(options.wordSize);
	bufLength.writeInt32BE(value.length);

	return {
		head: Buffer.alloc(options.wordSize),
		tail: Buffer.concat([bufLength, bufValue]),
		refreshHead: true,
	};
};

// TODO: Fix this
export const readString: Reader<string> = (
	buffer: Buffer,
	offset: number,
	options: ReaderOptions,
) => ({
	value: buffer.toString('utf8'),
	offset: offset + options.wordSize,
});
