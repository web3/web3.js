import { sha3Raw } from 'web3-utils';
import { toAscii } from 'idna-uts46-hx';


export const normalize = (name: string) => {
    return name ? toAscii(name, {useStd3ASCII: true, transitional: false, verifyDnsLength: false}) : name
} 

export const namehash = (inputName: string) => {
      // Reject empty names:
  var node = ''
  for (var i = 0; i < 32; i++) {
    node += '00'
  }

  const name = normalize(inputName)

  if (name) {
    var labels = name.split('.')

    for(var i = labels.length - 1; i >= 0; i--) {
      var labelSha = sha3Raw(labels[i])
      node = sha3Raw(`${node}${labelSha}`)
    }
  }

  return `0x${node}`
}