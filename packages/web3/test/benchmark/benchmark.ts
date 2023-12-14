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
import Benchmark from 'benchmark';
import fs from 'fs';
import path from 'path';

import { processingTx } from './processingTx';
import {
	processingContractDeploy,
	processingContractMethodSend,
	processingContractMethodCall,
} from './processingContract';
import { abiEncode, abiDecode } from './abi';
import { sign, verify } from './wallet';

const suite = new Benchmark.Suite();
const results: any[] = [];
suite
	.add('processingTx', processingTx)
	.add('processingContractDeploy', processingContractDeploy)
	.add('processingContractMethodSend', processingContractMethodSend)
	.add('processingContractMethodCall', processingContractMethodCall)
	.add('abiEncode', abiEncode)
	.add('abiDecode', abiDecode)
	.add('sign', sign)
	.add('verify', verify)
	.on('cycle', (event: any) => {
		results.push(String(event.target));
	})
	.run({ async: true })
	.on('complete', () => {
		fs.writeFileSync(path.join('..', '..', 'benchmark-data.txt'), results.join('\n'));
	});
