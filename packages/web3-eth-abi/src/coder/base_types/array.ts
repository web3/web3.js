import { Reader, ReaderOptions, Writer, WriterOptions } from '../..';
import { writeUint } from './uint';

export const writeArray: Writer<ReadonlyArray<unknown>> = (
	value: ReadonlyArray<unknown>,
	options: WriterOptions,
) => {
	const size = writeUint(value.length.toString(), options).head;
	const writer = options.param.components[0].write;
	const result: Buffer[] = [];

	result.push(size);
	for (const v of value) {
		const { head, tail } = writer(v as any, options);
		result.push(head);
		result.push(tail);
	}

	return {
		head: Buffer.alloc(options.wordSize),
		tail: Buffer.concat(result),
		refreshHead: true,
	};
};

// TODO: Fix it
export const readArray: Reader<ReadonlyArray<unknown>> = (
	_buffer: Buffer,
	offset: number,
	options: ReaderOptions,
) => ({
	value: [],
	offset: offset + options.wordSize,
});
