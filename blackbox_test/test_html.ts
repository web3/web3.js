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

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
// import http from 'http';
// import fs from 'fs';
import path from 'path';
import express from 'express';

// JSDOM.fromFile('./index.html')
// JSDOM.fromFile('./index.html')
// 	.then((dom: JSDOM) => {
// 		console.log(dom);
// 	})
// 	.catch((err: any) => {
// 		console.log(err);
// 	});

// const server = http.createServer((_, res) => {
// 	res.writeHead(200, { 'content-type': 'text/html' });
// 	fs.createReadStream('index.html').pipe(res);
// });

// server.listen(3000);

const app = express();
app.use('/static', express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));
app.listen('3000');

fetch('http://localhost:3000/static')
	.then(async response => response.text())
	.then(text => {
		console.log(text);
		eval(text);
	})
	.catch(err => {
		console.log(err);
	})
	.finally(() => {
		// server.close();
	});
