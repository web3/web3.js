
// TODO: Implement later
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isAddress = (_value: string): boolean => true;

export const isHexStrict = (hex: string) => ((typeof hex === 'string') && /^(-)?0x[0-9a-f]*$/i.test(hex));