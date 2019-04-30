
.. _web3-abstract-method-before-execution:

Type
====

.. code-block:: javascript

    Method.Type


The static ``readonly`` property ``Type`` will be used in the ``AbstractMethodFactory`` class to determine
how the class should get initiated.

=======
Returns
=======

``string`` - Example: ``observed-transaction-method``

------------------------------------------------------------------------------------------------------------------------

beforeExecution
===============

.. code-block:: javascript

    method.beforeExecution(moduleInstance)


This method will be executed before the JSON-RPC request happens. It provides the possibility to customize the given parameters
or other properties of the current method.

==========
Parameters
==========

- ``moduleInstance`` - ``AbstractWeb3Module`` The current ``AbstractWeb3Module``.

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-method-after-execution:

afterExecution
==============

.. code-block:: javascript

    method.afterExecution(response)


This method will get executed when the provider returns with the response.
This provides the possibility to map the response of the current method.

==========
Parameters
==========

- ``response`` - ``any`` The response from the provider.

=======
Returns
=======

``any``

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-method-execute:

execute
=======

.. code-block:: javascript

    method.execute()


This method will execute the current method.

=======
Returns
=======

``Promise<Object|string>|PromiEvent|string``

------------------------------------------------------------------------------------------------------------------------

rpcMethod
=========

.. code-block:: javascript

    method.rpcMethod


This property will return the ``rpcMethod`` string.
It will be used for the creation of the JSON-RPC payload Object.

=======
Returns
=======

``string``

------------------------------------------------------------------------------------------------------------------------

parametersAmount
================

.. code-block:: javascript

    method.parametersAmount


This property will return the ``parametersAmount``.
It will be used for validating the given parameters length and for the detection of the callback method.

=======
Returns
=======

``number``

------------------------------------------------------------------------------------------------------------------------

parameters
==========

.. code-block:: javascript

    method.parameters


This property does contain the given ``parameters``.

If you would like to let Web3.js automaticly detect if a callback is given then please use the ``setArguments()`` method for setting the parameters.
The ``setArguments()`` method will be used for validating the given parameters length and for the detection of the callback method.

=======
Returns
=======

``any[]``

------------------------------------------------------------------------------------------------------------------------

callback
========

.. code-block:: javascript

    method.callback


This property does contain the given ``callback``.

If you would like to let Web3.js automaticly detect if a callback is given then please use the ``setArguments()`` method for setting the parameters.
The ``setArguments()`` method will be used for validating the given parameters length and for the detection of the callback method.

=======
Returns
=======

``undefined``

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-method-set-arguments:

setArguments
============

.. code-block:: javascript

    method.setArguments(arguments)


This method will be used to set the given method arguments.
The ``setArguments`` method will set the ``parameter`` and ``callback`` property.

----------
Parameters
----------

- ``arguments`` - ``Array``: The ``arguments`` of the function call.

-------
Returns
-------

``Object``

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-method-get-arguments:

getArguments
============

.. code-block:: javascript

    method.getArguments()


This method will be used to get the method arguments.
The ``getArguments`` method will contain the ``parameter`` and ``callback`` property.

-------
Returns
-------

``Object``

------------------------------------------------------------------------------------------------------------------------

isHash
======

.. code-block:: javascript

    method.isHash(value)


This method will check if the given value is a string and starts with ``0x``.
It will be used in several methods for deciding which JSON-RPC method should get executed.

----------
Parameters
----------

- ``value`` - ``string``


=======
Returns
=======

``boolean``
