
.. _web3-abstract-method-before-execution:

Type
****

The static ``readonly`` property Type will be used in the ``AbstractMethodFactory`` class to determine
how the class should get initiated.

=======
Returns
=======

``string`` - Returns ``SEND`` or ``CALL``

------------------------------------------------------------------------------------------------------------------------

beforeExecution
***************

This method will be executed before the JSON-RPC happens. It provides the possibility to customize the given parameters
or other properties of the current method.

==========
Parameters
==========

- ``moduleInstance: AbstractWeb3Module`` - The current ``AbstractWeb3Module``.

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-method-after-execution:

afterExecution
**************

This method will get executed when the provider returns with the response.
This provides the possiblity to map the response of the current method.

==========
Parameters
==========

- ``response: any`` - The response from the provider.

=======
Returns
=======

``any``

------------------------------------------------------------------------------------------------------------------------

execute
*******

This method will execute the current method and return the desired correct value.

==========
Parameters
==========

- ``moduleInstance: AbstractWeb3Module`` - The current ``AbstractWeb3Module``.

=======
Returns
=======

``Promise<object|string>|PromiEvent|string``

------------------------------------------------------------------------------------------------------------------------

rpcMethod
*********

This property will return the ``rpcMethod`` ``string``.
It will be used for the creation of the JSON-RPC payload object.

=======
Returns
=======

``string``

------------------------------------------------------------------------------------------------------------------------

parametersAmount
****************

This property will return the ``parametersAmount``.
It will be used for validating the given parameters length and for the detection of the callback method.

=======
Returns
=======

``number``

------------------------------------------------------------------------------------------------------------------------

parameters
**********

This property does contain the given ``parameters``. If you would like to use the automaticly detection if a callback exists
then please use the ``arguments`` property for setting the parameters. This property will be used for validating the given parameters
length and for the detection of the callback method.

=======
Returns
=======

``any[]``

------------------------------------------------------------------------------------------------------------------------

callback
********

This property does contain the given ``callback``. If you would like to use the automaticly detection if a callback exists
then please use the ``arguments`` property for setting the parameters. If the callback property is set with a function then
it will call the ``callback`` function with an ``error: Error`` and ``response: any`` function parameter.

=======
Returns
=======

``undefined``

------------------------------------------------------------------------------------------------------------------------

arguments
*********

This property will be used for detecting the callback function and validation the paramters length.
The ``arguments`` property will set the ``parameter`` and ``callback`` property.

=======
Returns
=======

``object``

------------------------------------------------------------------------------------------------------------------------

isHash
******

This method will check if the given value is a string and starts with ``0x``.
It will be used in several methods for deciding which JSON-RPC method schould get executed.

=======
Returns
=======

``boolean``

------------------------------------------------------------------------------------------------------------------------

hasWallets
**********

This method will check if there are local unlocked accounts.

=======
Returns
=======

``boolean``

------------------------------------------------------------------------------------------------------------------------
