const fs = require('fs');
const path = require('path');

module.exports = {
	meta: {
		fixable: 'code', // Add rule as fixable (--fix at cli)
		files: ['*.ts', '*.tsx'],
	},
	create(context) {
		const licenseRaw = readLicenseFile(path.join(__dirname, '../../../LICENSE')).trim();
		const license = removeWhitespaces(licenseRaw).trim();
		const licenseInComments = `\/*\n${licenseRaw}\n*\/\n\n`; // Wrap license in multiline comments - For fix-

		const hasLicense = comment => comment.indexOf(license) > -1; // Is license present in comment?

		return {
			Program(node) {
				const comments = context.getAllComments().map(cleanComment);
				const sourceCode = context.getSourceCode();
				if (!comments.some(hasLicense)) {
					context.report({
						node,
						message: 'Unable to find license in code file.',
						fix: fixer => fixer.insertTextBefore(sourceCode.ast, licenseInComments),
					});
				}
			},
		};
	},
};

// Helplers
function readLicenseFile(path) {
	if (!path) {
		throw new Error('missing license header path');
	}
	try {
		return fs.readFileSync(path, 'utf-8');
	} catch (e) {
		throw new Error(`could not read license header from <${path}>`);
	}
}

function cleanComment(node) {
	let comment = node.value;
	if (node.type === 'Block') {
		// Remove any leading whitespace or astrisks (*) from multiline comments.
		comment = comment.replace(/^\s*\*\s?/gm, '');
	}
	// Remove any leading/trailing whitespace and collapse consecutive whitespaces.
	// return comment.replace(/\s+/g, ' ').trim();
	return removeWhitespaces(comment);
}

function removeWhitespaces(text) {
	return text.replace(/\s+/g, ' ').trim();
}
