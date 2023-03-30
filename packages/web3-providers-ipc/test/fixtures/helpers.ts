/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const IPC_DIR_PATH = path.join(__dirname, '..', '..', '..', '..', 'tmp');
const IPC_PATH = path.join(IPC_DIR_PATH, 'some.ipc');
const IPC_ORIGIN_PATH = path.join(IPC_DIR_PATH, 'some.ipc');

const createSymlink = `ln -s ${path.join(IPC_DIR_PATH, 'ipc.ipc')} ${IPC_ORIGIN_PATH}`;

const execPromise = async (command: string): Promise<string> =>
	new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			if (stderr) {
				reject(stderr);
				return;
			}
			resolve(stdout);
		});
	});

const removeIfExists = () => {
	if (fs.existsSync(IPC_PATH)) {
		fs.unlinkSync(IPC_PATH);
	}
};
export const startGethServer = async (): Promise<{ path: string; close: () => void }> => {
	removeIfExists();
	await execPromise(createSymlink);
	return {
		path: IPC_PATH,
		close: (): void => {
			removeIfExists();
		},
	};
};
