const fs = require('fs');
const path = require('path');

const directoryPath = './packages';
function processFile(filePath) {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			console.log('Error reading file: ' + filePath);
		} else {
			const newData = data.replace(/from\s+['"](\.\.\/[^'"]*)['"]/g, (match, p1) => {
				if (!p1.includes('.js') && p1.includes('./')) {
					console.log(`modifying file '${filePath}' adding: from '${p1}.js'`);

					return `from '${p1}.js'`;
				} else {
					return match;
				}
			});

			fs.writeFile(filePath, newData, 'utf8', err => {
				if (err) {
					console.log('Error writing file: ' + filePath);
				}
			});
		}
	});
}

function processDirectory(directoryPath) {
	fs.readdir(directoryPath, (err, files) => {
		if (err) {
			console.log('Error getting directory information.');
		} else {
			files.forEach(file => {
				const filePath = path.join(directoryPath, file);
				if (
					fs.statSync(filePath).isDirectory() &&
					!filePath.includes('test') &&
					!filePath.includes('node_modules')
				) {
					processDirectory(filePath);
				} else if (
					path.extname(file) === '.ts' &&
					!file.startsWith('.') &&
					!fs.lstatSync(filePath).isSymbolicLink()
				) {
					processFile(filePath);
				}
			});
		}
	});
}

processDirectory(directoryPath);
