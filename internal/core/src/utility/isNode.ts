/**
 * Determines if the current runtime is nodejs
 *
 * @method isNode
 *
 * @returns {boolean}
 */
export default function isNode(): boolean {
    return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
};
