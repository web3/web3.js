setProvider234223
=====================

.. code-block:: javascript

    web3.eth.setProvider(myProvider)

When called changes the current provider for all modules.

----------
Parameters
----------

1. ``Object`` - **myProvider**: :ref:`a valid provider <web3-providers>`.

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    eth.setProvider(new eth.providers.HttpProvider('http://localhost:8545'));


------------------------------------------------------------------------------
