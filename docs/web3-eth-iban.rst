.. _eth-iban:

.. include:: include_announcement.rst

=========
web3.eth.Iban
=========

The ``web3.eth.Iban`` function lets convert Ethereum addresses from and to IBAN and BBAN.

.. code-block:: javascript

    import {Iban} from 'web3-eth-iban';

    const iban = new Iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');

    // or using the web3 umbrella package

    import {Web3 } from 'web3';
    const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546', options);

    // -> new web3.eth.Iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS')



------------------------------------------------------------------------------

Iban instance
=====================

This's instance of Iban

.. code-block:: javascript

    > Iban { _iban: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS' }

------------------------------------------------------------------------------

.. _eth-iban-toaddress:

toAddress
=====================

    static function

.. code-block:: javascript

    web3.eth.Iban.toAddress(ibanAddress)

Singleton: Converts a direct IBAN address into an Ethereum address.

.. note:: This method also exists on the IBAN instance.

----------
Parameters
----------

1. ``String``: the IBAN address to convert.

-------
Returns
-------

``String`` - The Ethereum address.

-------
Example
-------

.. code-block:: javascript

    web3.eth.Iban.toAddress("XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS");
    > "0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8"


------------------------------------------------------------------------------

.. _eth-iban-toiban:

toIban
=====================

    static function

.. code-block:: javascript

    web3.eth.Iban.toIban(address)

Singleton: Converts an Ethereum address to a direct IBAN address.

----------
Parameters
----------

1. ``String``: the Ethereum address to convert.

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

.. _eth-iban-fromaddress:

    static function, return IBAN instance

fromAddress
=====================

.. code-block:: javascript

    web3.eth.Iban.fromAddress(address)

Singleton: Converts an Ethereum address to a direct IBAN instance.

----------
Parameters
----------

1. ``String``: the Ethereum address to convert.

-------
Returns
-------

``Object`` - The IBAN instance.

-------
Example
-------

.. code-block:: javascript

    web3.eth.Iban.fromAddress("0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8");
    > Iban {_iban: "XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS"}


------------------------------------------------------------------------------

.. _eth-iban-frombban:

    static function, return IBAN instance

fromBban
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

    static function, return IBAN instance

createIndirect
=====================

.. code-block:: javascript

    web3.eth.Iban.createIndirect(options)

Singleton: Creates an indirect IBAN address from a institution and identifier.

----------
Parameters
----------

1. ``Object``: the options object as follows:
    - ``institution`` - ``String``: the institution to be assigned
    - ``identifier`` - ``String``: the identifier to be assigned

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

    static function, return boolean

isValid
=====================

.. code-block:: javascript

    web3.eth.Iban.isValid(ibanAddress)

Singleton: Checks if an IBAN address is valid.

.. note:: This method also exists on the IBAN instance.

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


------------------------------------------------------------------------------

prototype.isValid
=====================

    method of Iban instance

.. code-block:: javascript

    web3.eth.Iban.prototype.isValid()

Singleton: Checks if an IBAN address is valid.

.. note:: This method also exists on the IBAN instance.

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

    const iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
    iban.isValid();
    > true


------------------------------------------------------------------------------

prototype.isDirect
=====================

    method of Iban instance

.. code-block:: javascript

    web3.eth.Iban.prototype.isDirect()

Checks if the IBAN instance is direct.

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    const iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
    iban.isDirect();
    > false

------------------------------------------------------------------------------

prototype.isIndirect
=====================

    method of Iban instance

.. code-block:: javascript

    web3.eth.Iban.prototype.isIndirect()

Checks if the IBAN instance is indirect.

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    const iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
    iban.isIndirect();
    > true

------------------------------------------------------------------------------

prototype.checksum
=====================

    method of Iban instance

.. code-block:: javascript

    web3.eth.Iban.prototype.checksum()

Returns the checksum of the IBAN instance.

-------
Returns
-------

``String``: The checksum of the IBAN

-------
Example
-------

.. code-block:: javascript

    const iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
    iban.checksum();
    > "81"


------------------------------------------------------------------------------

prototype.institution
=====================

    method of Iban instance


.. code-block:: javascript

    web3.eth.Iban.prototype.institution()

Returns the institution of the IBAN instance.

-------
Returns
-------

``String``: The institution of the IBAN

-------
Example
-------

.. code-block:: javascript

    const iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
    iban.institution();
    > 'XREG'


------------------------------------------------------------------------------

prototype.client
=====================

    method of Iban instance

.. code-block:: javascript

    web3.eth.Iban.prototype.client()

Returns the client of the IBAN instance.

-------
Returns
-------

``String``: The client of the IBAN

-------
Example
-------

.. code-block:: javascript

    const iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
    iban.client();
    > 'GAVOFYORK'

------------------------------------------------------------------------------

prototype.toAddress
=====================

    method of Iban instance

.. code-block:: javascript

    web3.eth.Iban.prototype.toString()

Returns the Ethereum address of the IBAN instance.

-------
Returns
-------

``String``: The Ethereum address of the IBAN

-------
Example
-------

.. code-block:: javascript

    const iban = new web3.eth.Iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
    iban.toAddress();
    > '0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8'


------------------------------------------------------------------------------

prototype.toString
=====================

    method of Iban instance

.. code-block:: javascript

    web3.eth.Iban.prototype.toString()

Returns the IBAN address of the IBAN instance.

-------
Returns
-------

``String``: The IBAN address.

-------
Example
-------

.. code-block:: javascript

    const iban = new web3.eth.Iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
    iban.toString();
    > 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'

