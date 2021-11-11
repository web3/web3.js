// TODO: Implement later
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _flattenTypes(_arg0: boolean, _inputs: unknown): string[] {
	throw new Error('Function not implemented.');
}

/**
 * Should be used to create full function/event name from json abi
 */
export const jsonInterfaceMethodToString = (json: Record<string, unknown>): string => {
	if (!!json && typeof json === 'object' && json.name && (json.name as string).includes('(')) {
		return json.name as string;
	}

	return `${json.name as string}(${_flattenTypes(false, json.inputs).join(',')})`;
};
