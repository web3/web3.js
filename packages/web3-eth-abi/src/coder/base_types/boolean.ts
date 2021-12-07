import { Reader, ReaderOptions, Writer, WriterOptions } from '../../types';

export const writeBoolean: Writer<boolean> = (value: boolean, options: WriterOptions) => {
	const buf = Buffer.alloc(options.wordSize);
	if (value) {
		buf.writeInt8(1, options.wordSize - 1);
	} else {
		buf.writeInt8(0, options.wordSize - 1);
	}

	return {
		head: buf,
		tail: Buffer.alloc(0),
		refreshHead: false,
	};
};

export const readBoolean: Reader<boolean> = (
	buffer: Buffer,
	offset: number,
	options: ReaderOptions,
) => ({
	value: buffer[offset] !== 0x00,
	offset: offset + options.wordSize,
});
