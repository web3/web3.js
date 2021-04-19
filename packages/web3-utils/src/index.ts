// TODO - Add checksum check
export function checkAddress(address: string, checkSum: boolean = false) {
  try {
    if (typeof(address) !== "string") throw Error(`Invalid argument ${address}, must be a string`)
    return (/^0x[0-9a-fA-F]{40}$/.test(address))
  } catch (error) {
    throw Error(error.message)
  }
}