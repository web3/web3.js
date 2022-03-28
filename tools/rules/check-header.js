// Found a comment.
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/*
Does this even work?
            Or handle things?
 */
function cleanComment(node) {
	let comment = node.value;
	if (node.type === 'Block') {
		// Remove any leading whitespace or astrisks (*) from multi-line comments.
		comment = comment.replace(/^\s*\*\s?/gm, '');
	}
	// Remove any leading/trailing whitespace and collapse consecutive whitespaces.
	return comment.replace(/\s+/g, ' ').trim();
}
module.exports = function (context) {
	const copyright = context.options[0];
	const hasCopyright = function (comment) {
		return comment.indexOf(copyright) > -1;
	};
	return {
		Program: function (node) {
			const comments = context.getAllComments().map(cleanComment);
			if (!comments.some(hasCopyright)) {
				context.report(node, 'Unable to find copyright.');
			}
		},
	};
};
