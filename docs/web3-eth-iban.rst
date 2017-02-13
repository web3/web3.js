.. _eth-iban:

=========
web3.eth.iban
=========

The ``web3.eth.iban`` function lets convert etheruem addresses from and to IBAN and BBAN.


------------------------------------------------------------------------------

Iban
=========

.. code-block:: javascript

    new web3.eth.Iban(ibanAddress)

Generates a iban object with conversion methods and vailidity checks. Also has singleton functions for conversion like
:ref:`Iban.toAddress() <_eth-iban-toaddress>`,
:ref:`Iban.toIban() <_eth-iban-toiban>`,
:ref:`Iban.fromEthereumAddress() <_eth-iban-fromethereumaddress>`,
:ref:`Iban.fromBban() <_eth-iban-frombban>`,
:ref:`Iban.createIndirect() <_eth-iban-createindirect>`,
:ref:`Iban.isValid() <_eth-iban-isvalid>`.

----------
Parameters
----------

1. ``String``: the iban address to instantiate an Iban instance from.

-------
Returns
-------

``Object`` - The Iban instance.

-------
Example
-------

.. code-block:: javascript

    var iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");


------------------------------------------------------------------------------

.. _eth-iban-toaddress:

Iban.toAddress
=====================

.. code-block:: javascript

    web3.eth.Iban.toAddress(ibanAddress)

Singleton: Converts a direct IBAN address into an ethereum address.

**Note**: This method also exists on the IBAN instance.

----------
Parameters
----------

1. ``String``: the IBAN address to convert.

-------
Returns
-------

``String`` - The ethereum address.

-------
Example
-------

.. code-block:: javascript

    web3.eth.Iban.toAddress("XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS");
    > "0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8"


------------------------------------------------------------------------------

.. _eth-iban-toiban:

Iban.toIban
=====================

.. code-block:: javascript

    web3.eth.Iban.toIban(address)

Singleton: Converts an ethereum address to a direct IBAN address.

----------
Parameters
----------

1. ``String``: the ethereum address to convert.

-------
Returns
-------

``String`` - The IBAN address.

-------
Example
-------

.. code-block:: javascript

    web3.eth.Iban.toIban("0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8");
    > "XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS"


------------------------------------------------------------------------------

.. _eth-iban-fromethereumaddress:

Iban.fromEthereumAddress
=====================

.. code-block:: javascript

    web3.eth.Iban.fromEthereumAddress(address)

Singleton: Converts an ethereum address to a direct IBAN instance.

----------
Parameters
----------

1. ``String``: the ethereum address to convert.

-------
Returns
-------

``Object`` - The IBAN instance.

-------
Example
-------

.. code-block:: javascript

    web3.eth.Iban.fromEthereumAddress("0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8");
    > Iban {_iban: "XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS"}


------------------------------------------------------------------------------

.. _eth-iban-frombban:

Iban.fromBban
=====================

.. code-block:: javascript

    web3.eth.Iban.fromBban(bbanAddress)

Singleton: Converts an BBAN address to a direct IBAN instance.

----------
Parameters
----------

1. ``String``: the BBAN address to convert.

-------
Returns
-------

``Object`` - The IBAN instance.

-------
Example
-------

.. code-block:: javascript

    web3.eth.Iban.fromBban('ETHXREGGAVOFYORK');
    > Iban {_iban: "XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS"}


------------------------------------------------------------------------------

.. _eth-iban-createindirect:

Iban.createIndirect
=====================

.. code-block:: javascript

    web3.eth.Iban.createIndirect(options)

Singleton: Creates an indirect IBAN address from a institution and identifier.

----------
Parameters
----------

1. ``Object``: the options object as follows:
    - ``String`` - **institution**: the institution to be assigned
    - ``String`` - **identifier**: the identifier to be assigned

-------
Returns
-------

``Object`` - The IBAN instance.

-------
Example
-------

.. code-block:: javascript

    web3.eth.Iban.createIndirect({
      institution: "XREG",
      identifier: "GAVOFYORK"
    });
    > Iban {_iban: "XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS"}


------------------------------------------------------------------------------

.. _eth-iban-isvalid:

Iban.isValid
=====================

.. code-block:: javascript

    web3.eth.Iban.isValid(address)

Singleton: Checks if an IBAN address is valid.

**Note**: This method also exists on the IBAN instance.

----------
Parameters
----------

1. ``String``: the IBAN address to check.

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    web3.eth.Iban.isValid("XE81ETHXREGGAVOFYORK");
    > true

    web3.eth.Iban.isValid("XE82ETHXREGGAVOFYORK");
    > false // because the checksum is incorrect

    var iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
    iban.isValid();
    > true


------------------------------------------------------------------------------

Iban.isDirect
=====================

.. code-block:: javascript

    web3.eth.Iban.isDirect()

Checks if the IBAN instance is direct.

----------
Parameters
----------

none

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    var iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
    iban.isDirect();
    > false


------------------------------------------------------------------------------

Iban.isIndirect
=====================

.. code-block:: javascript

    web3.eth.Iban.isIndirect()

Checks if the IBAN instance is indirect.

----------
Parameters
----------

none

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    var iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
    iban.isIndirect();
    > true


------------------------------------------------------------------------------

Iban.checksum
=====================

.. code-block:: javascript

    web3.eth.Iban.checksum()

Returns the checksum of the IBAN instance.

----------
Parameters
----------

none

-------
Returns
-------

``String``: The checksum of the IBAN

-------
Example
-------

.. code-block:: javascript

    var iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
    iban.checksum();
    > "81"


------------------------------------------------------------------------------

Iban.institution
=====================


.. code-block:: javascript

    web3.eth.Iban.institution()

Returns the institution of the IBAN instance.

----------
Parameters
----------

none

-------
Returns
-------

``String``: The institution of the IBAN

-------
Example
-------

.. code-block:: javascript

    var iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
    iban.institution();
    > 'XREG'


------------------------------------------------------------------------------

Iban.client
=====================

.. code-block:: javascript

    web3.eth.Iban.client()

Returns the client of the IBAN instance.

----------
Parameters
----------

none

-------
Returns
-------

``String``: The client of the IBAN

-------
Example
-------

.. code-block:: javascript

    var iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
    iban.client();
    > 'GAVOFYORK'


------------------------------------------------------------------------------

Iban.toAddress
=====================

.. code-block:: javascript

    web3.eth.Iban.toAddress()

Returns the ethereum address of the IBAN instance.

----------
Parameters
----------

none

-------
Returns
-------

``String``: The ethereum address of the IBAN

-------
Example
-------

.. code-block:: javascript

    var iban = new web3.eth.Iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
    iban.toAddress();
    > '0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8'


------------------------------------------------------------------------------

Iban.toString
=====================

.. code-block:: javascript

    web3.eth.Iban.toString()

Returns the IBAN address of the IBAN instance.

----------
Parameters
----------

none

-------
Returns
-------

``String``: The IBAN address.

-------
Example
-------

.. code-block:: javascript

    var iban = new web3.eth.Iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
    iban.toString();
    > 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'

