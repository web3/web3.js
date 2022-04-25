import { isAddress, leftPad } from 'web3-utils';
import {
	hexToNumber,
	isDirectIBAN,
	isValidIBAN,
	mod9710,
	iso13616Prepare,
	HexString,
	InvalidAddressError,
	IBANtoAddress,
} from 'web3-common';
import { IbanOptions } from './types';

export class Iban {
	private readonly _iban: string;

	public static isDirect(iban: string): boolean {
		return isDirectIBAN(iban);
	}

	public static isIndirect(iban: string): boolean {
		return iban.length === 20;
	}

	/**
	 * Construct a direct or indirect IBAN
	 */
	public constructor(iban: string) {
		if (Iban.isIndirect(iban) || Iban.isDirect(iban)) {
			this._iban = iban;
		} else {
			throw new Error('Invalid IBAN was provided');
		}
	}

	/**
	 * Prepare an IBAN for mod 97 computation by moving the first 4 chars to the end and transforming the letters to
	 * numbers (A = 10, B = 11, ..., Z = 35), as specified in ISO13616.
	 */
	private static readonly _iso13616Prepare = (iban: string): string => iso13616Prepare(iban);

	/**
	 * Calculates the MOD 97 10 of the passed IBAN as specified in ISO7064.
	 */
	private static readonly _mod9710 = (iban: string): number => mod9710(iban);

	private static readonly _isValid = (iban: string): boolean => isValidIBAN(iban);

	/**
	 * check if iban number is direct
	 */
	public isDirect(): boolean {
		return Iban.isDirect(this._iban);
	}

	/**
	 * Get the clients direct address from iban
	 */
	public toAddress = (): HexString => IBANtoAddress(this._iban);

	/**
	 * This method should be used to create an ethereum address from a direct iban address
	 */
	public static toAddress = (iban: string): HexString => {
		const ibanObject = new Iban(iban);
		return ibanObject.toAddress();
	};

	/**
	 * Convert the passed BBAN to an IBAN for this country specification.
	 * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
	 * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
	 */
	public static fromBban(bban: string): Iban {
		const countryCode = 'XE';

		const remainder = this._mod9710(this._iso13616Prepare(`${countryCode}00${bban}`));
		const checkDigit = `0${(98 - remainder).toString()}`.slice(-2);

		return new Iban(`${countryCode}${checkDigit}${bban}`);
	}

	/**
	 * This method should be used to create iban object from an ethereum address
	 */
	public static fromAddress(address: HexString): Iban {
		if (!isAddress(address)) {
			throw new InvalidAddressError(address);
		}

		const num = BigInt(hexToNumber(address));
		const base36 = num.toString(36);
		const padded = leftPad(base36, 15);
		return Iban.fromBban(padded.toUpperCase());
	}

	/**
	 * This method should be used to create iban address from an ethereum address
	 */
	public static toIban(address: HexString): string {
		return Iban.fromAddress(address).toString();
	}

	/**
	 * Should be used to create IBAN object for given institution and identifier
	 */
	public static createIndirect(options: IbanOptions): Iban {
		return Iban.fromBban(`ETH${options.institution}${options.identifier}`);
	}

	/**
	 * Should be called to get client identifier within institution
	 */
	public client(): string {
		return this.isIndirect() ? this._iban.slice(11) : '';
	}

	/**
	 * Returns the ibans checksum
	 */
	public checksum(): string {
		return this._iban.slice(2, 4);
	}

	/**
	 * Returns institution identifier from iban
	 */
	public institution(): string {
		return this.isIndirect() ? this._iban.slice(7, 11) : '';
	}

	/**
	 * Should be called to check if iban is correct
	 */
	public isValid(): boolean {
		return Iban._isValid(this._iban);
	}

	/**
	 * This method should be used to check if given string is valid iban object
	 */
	public static isValid(iban: string) {
		return Iban._isValid(iban);
	}

	public toString(): string {
		return this._iban;
	}

	/**
	 * check if iban number if indirect
	 */
	public isIndirect(): boolean {
		return Iban.isIndirect(this._iban);
	}
}
