---
sidebar_position: 7
sidebar_label: web3.eth.iban
---

# web3.eth.iban Migration Guide

## Breaking Changes

### Iban class

#### The Iban contractor

##### In version 1.x

It used to just accept the passed string without any check.

##### In version 4.x

If the provided string was not of either the length of a direct IBAN (34 or 35), or the length of an indirect IBAN (20), an Error will be thrown. The error will contain the message `'Invalid IBAN was provided'`

#### Calling `toAddress` on an Iban that is not Direct

##### In version 1.x

It used to behave differently, if it was called on an instance of IBAN, from if it was called as a static method. However, this used to happen only if the provided address was not a Direct IBAN. More specifically, if the instance method `new Iban(address).toAddress()` was called, it will return an empty string (`''`) for that non Direct IBAN. And if the static method `Iban.toAddress(address)` was called, it used to throw an Error with the message `'IBAN is indirect and can\'t be converted'`, for that non Direct IBAN.

##### In version 4.x

If the provided IBAN was not a Direct one, an error will be thrown which contains the message: `'Iban is indirect and cannot be converted. Must be length of 34 or 35'`. And this behavior is now the same for the instance method `new Iban(address).toAddress()` and the static method `Iban.toAddress(address)`.

#### Calling `fromAddress` on an invalid address

##### In version 1.x

If the provided IBAN was not a valid Ethereum Address, an error used be thrown which contains the message `'Provided address is not a valid address: '+ address`.

##### In version 4.x

If the provided IBAN was not a valid Ethereum Address, an error object will be thrown which contains the message: `'Invalid value given "${address}". Error: 'invalid ethereum address'` and the code `1005`.
