// TODO - Add checksum check
export function checkAddress(address: string, checkSum: boolean = false) {
  try {
    if (typeof(address) !== "string") throw Error(`Invalid argument ${address}, must be a string`)
    return (/^0x[0-9a-fA-F]{40}$/.test(address))
  } catch (error) {
    throw Error(error.message)
  }
}

export function toBigInt(value: string | number): BigInt {
  try {
      const bigIntValue = BigInt(value)
      if (bigIntValue === undefined) throw Error(`Unable to convert values: ${value} into a BigInt`)
      return bigIntValue
  } catch (error) {
      throw Error(error.message)
  }
}
