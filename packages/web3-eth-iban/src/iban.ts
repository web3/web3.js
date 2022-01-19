import { toChecksumAddress, isAddress, leftPad } from 'web3-utils';


/**
     * Prepare an IBAN for mod 97 computation by moving the first 4 chars to the end and transforming the letters to
     * numbers (A = 10, B = 11, ..., Z = 35), as specified in ISO13616.
     */
 const _iso13616Prepare = function (iban: string) {
    const A = 'A'.charCodeAt(0);
    const Z = 'Z'.charCodeAt(0);

    iban = iban.toUpperCase();
    iban = iban.substr(4) + iban.substr(0,4);

    return iban.split('').map(function(n) {
        const code = n.charCodeAt(0);
        if (code >= A && code <= Z) {
            // A = 10, B = 11, ... Z = 35
            return code - A + 10;
        } else {
            return n;
        }
    }).join('');
};

    /**
     * Calculates the MOD 97 10 of the passed IBAN as specified in ISO7064.
     */
      const _mod9710 = function (iban: string) {
        let remainder = iban;
        let block;
    
        while (remainder.length > 2){
            block = remainder.slice(0, 9);
            remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
        }
    
        return parseInt(remainder, 10) % 97;
    };

export class Iban {
    private _iban: string;

    public constructor(iban: string){
        this._iban = iban;
    }


    _parseInt(str:string, base: number): BigInt {
        return [...str].reduce((acc,curr)=>
        BigInt(parseInt(curr, base)) + BigInt(base) * acc, 0n);
    }

    /**
     * check if iban number is direct
     */
     isDirect () {
        return this._iban.length === 34 || this._iban.length === 35;
    };

    /**
     * Get the clients direct address from iban
     */
     toAddress = (): string => {
        if (this.isDirect()) {
            const base36 = this._iban.substr(4);
            const bigInt = this._parseInt(base36, 36); // convert the base36 string to a bigint
            return toChecksumAddress(bigInt.toString(16));
        }

        return ''; // error
    };

    /**
     * This method should be used to create an ethereum address from a direct iban address
     */
    static toAddress = (iban : string)=> {
        const ibanObject = new Iban(iban);
        if(!ibanObject.isDirect()) {
            throw new Error('IBAN is indirect and can\'t be converted');
        }

        return ibanObject.toAddress();


    }



/**
     * Convert the passed BBAN to an IBAN for this country specification.
     * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
     * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
     */
 static fromBban (bban: string) {
    const countryCode = 'XE';

    const remainder = _mod9710(_iso13616Prepare(countryCode + '00' + bban));
    const checkDigit = ('0' + (98 - remainder)).slice(-2);

    return new Iban(countryCode + checkDigit + bban);
}

    /**
     * This method should be used to create iban object from an ethereum address
     */
     static fromAddress (address: string) {
        if(!isAddress(address)){
            throw new Error('Provided address is not a valid address: '+ address);
        }

        address = address.replace('0x','').replace('0X','');

        const num = BigInt(address);
        const base36 = num.toString(36);
        const padded = leftPad(base36, 15);
        return Iban.fromBban(padded.toUpperCase());
    }

     /**
     * This method should be used to create iban address from an ethereum address
     */
      static toIban (address: string): string {
        return Iban.fromAddress(address).toString();
    }

    /**
     * Should be used to create IBAN object for given institution and identifier
     */
     static createIndirect (options: any) {
        return Iban.fromBban('ETH' + options.institution + options.identifier);
    }

        /**
     * Should be called to check if iban is correct

     */
         isValid () {
            return /^XE[0-9]{2}(ETH[0-9A-Z]{13}|[0-9A-Z]{30,31})$/.test(this._iban) &&
                _mod9710(_iso13616Prepare(this._iban)) === 1;
        };

    /**
     * This method should be used to check if given string is valid iban object
     */
     static isValid (iban: string) {
        const i = new Iban(iban);
        return i.isValid();
    };


};