import { randombytes } from 'randombytes';
/**
 * Returns a random hex string by the given bytes size
 *
 * @param {Number} size
 * @returns {string}
 */
const randomHex = (size: number): string =>{
`0x${randombytes(size).toString('hex')}`;
}
;
console.log(randombytes(3))