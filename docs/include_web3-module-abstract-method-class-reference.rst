
.. _web3-abstract-method-before-execution:

Type
****

The static ``readonly`` property ``Type`` will be used in the ``AbstractMethodFactory`` class to determine
how the class should get initiated.

=======
Returns
=======

``string`` - Returns ``SEND`` or ``CALL``

------------------------------------------------------------------------------------------------------------------------

beforeExecution
***************

This method will be executed before the JSON-RPC request happens. It provides the possibility to customize the given parameters
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

.. _web3-abstract-method-execute:

execute
*******

This method will execute the current method.

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

This property will return the ``rpcMethod`` string.
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

This property does contain the given ``parameters``.

If you would like to let Web3.js automaticly detect if a callback is given then please use the ``arguments`` property for setting the parameters.
The ``arguments`` property will be used for validating the given parameters length and for the detection of the callback method.

=======
Returns
=======

``any[]``

------------------------------------------------------------------------------------------------------------------------

callback
********

This property does contain the given ``callback``.

If you would like to let Web3.js automaticly detect if a callback is given then please use the ``arguments`` property for setting the parameters.
The ``arguments`` property will be used for validating the given parameters length and for the detection of the callback method.

=======
Returns
=======

``undefined``

------------------------------------------------------------------------------------------------------------------------

setArguments
************

This method will be used to set the given method arguments.
The ``arguments`` property will set the ``parameter`` and ``callback`` property.

----------
Parameters
----------

- ``arguments`` - ``Array``: The ``arguments`` of the function call.

-------
Returns
-------

``object``

------------------------------------------------------------------------------------------------------------------------

getArguments
************

This method will be used to get the method arguments.
The ``arguments`` property will contain the ``parameter`` and ``callback`` property.

-------
Returns
-------

``object``

------------------------------------------------------------------------------------------------------------------------

isHash
******

This method will check if the given value is a string and starts with ``0x``.
It will be used in several methods for deciding which JSON-RPC method should get executed.

=======
Returns
=======

``boolean``
