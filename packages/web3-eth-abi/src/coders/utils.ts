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

export const WORD_SIZE = 32;

export function alloc (size = 0): Uint8Array {
    if (globalThis.Buffer?.alloc !== undefined) {
      const buf =  globalThis.Buffer.alloc(size)
      return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
    }
  
    return new Uint8Array(size)
  }
  
  /**
   * Where possible returns a Uint8Array of the requested size that references
   * uninitialized memory. Only use if you are certain you will immediately
   * overwrite every value in the returned `Uint8Array`.
   */
  export function allocUnsafe (size = 0): Uint8Array {
    if (globalThis.Buffer?.allocUnsafe !== undefined) {
      const buf = globalThis.Buffer.allocUnsafe(size)
      return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
    }
  
    return new Uint8Array(size)
  }
