import { DataFormat, FMT_BYTES, FMT_NUMBER } from 'web3-common';

export const getDataFormat: DataFormat[] = [
	{ number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX },
	{ number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER },
	{ number: FMT_NUMBER.BIGINT, bytes: FMT_BYTES.BUFFER },
	{ number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.UINT8ARRAY },
];
