import isNode from "../../../utility/isNode";

/**
 * @method _btoa
 *
 * @param {String} str
 *
 * @returns {string}
 */
export default function (str: string): string {
    if (isNode()) {
        return Buffer.from(str).toString('base64');
    }

    //@ts-ignore
    return btoa(str);
}
