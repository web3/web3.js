import isNode from "../../../utility/isNode";

/**
 * TODO: Add correct type when nodejs version 11 is EOL.
 * @method parseUrl
 *
 * @param {String} str
 *
 * @returns {URL}
 */
export default function (str: string): any {
    if (isNode()) {
        const url = require('url');

        return new url.URL(str);
    }

    //@ts-ignore
    return new URL(str);
};