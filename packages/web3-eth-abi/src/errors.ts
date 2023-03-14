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
export class AbiCoderError<T extends Record<string, unknown>&{name?: string} = Record<string, never>> extends Error {
    public readonly props: T
  
    public constructor (
      message: string,
      public readonly code: string,
      props?: T
    ) {
      super(message)
  
      this.name = props?.name ?? 'AbiCoderError'
      this.props = props ?? {} as T
    }
  }

export enum AbiCoderErrors {
    INVALID_ARGUMENT = "INVALID_ARGUMENT",
    INVALID_ABI = "INVALID_ABI"
}