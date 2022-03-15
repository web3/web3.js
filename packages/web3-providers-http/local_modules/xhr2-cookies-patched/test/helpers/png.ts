import * as fs from 'fs';
import * as path from 'path';

const PNGBuffer = fs.readFileSync(path.join(__dirname, '../fixtures/hello.png'));
const PNGUint8Array = new Uint8Array(PNGBuffer);
const PNGArrayBuffer = PNGUint8Array.buffer as ArrayBuffer;

export { PNGBuffer, PNGArrayBuffer, PNGUint8Array };
