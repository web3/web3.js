.. _utils:

========
web3.utils
========

This package provides utility functions for Ethereum dapps and other web3.js packages.

------------------------------------------------------------------------------

.. _utils-bn:

BN
=====================

.. code-block:: javascript

    web3.utils.BN(mixed)

The BN.js library for calculating with big numbers in JavaScript.

For safe conversion of many types, incl BigNumber.js use :ref:`utils.toBN <utils-tobn>`

----------
Parameters
----------

1. ``mixed`` - ``String|Number``: A number, number string or HEX string to convert to a BN object.

-------
Returns
-------

``Object``: The BN instance.

-------
Example
-------

.. code-block:: javascript

    var BN = web3.utils.BN;

    new BN(1234).toString();
    > "1234"

    new BN('1234').add(new BN('1')).toString();
    > "1235"

    new BN('0xea').toString();
    > "234"


------------------------------------------------------------------------------

sha3
=====================

.. code-block:: javascript

    web3.utils.sha3(string)

Will calculate the sha3 of the input.

----------
Parameters
----------

1. ``string`` - ``String``: A string to hash.

-------
Returns
-------

``String``: the result hash.

-------
Example
-------

.. code-block:: javascript

    web3.utils.sha3('234');
    > "0xc1912fee45d61c87cc5ea59dae311904cd86b84fee17cc96966216f811ce6a79"


------------------------------------------------------------------------------

isAddress
=====================

.. code-block:: javascript

    web3.utils.isAddress(address)

Checks if a given string is a valid Ethereum address.
It will also check the checksum, if the address has upper and lowercase letters.

----------
Parameters
----------

1. ``address`` - ``String``: An address string.

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    web3.utils.isAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d');
    > true

    web3.utils.isAddress('c1912fee45d61c87cc5ea59dae31190fffff232d');
    > true

    web3.utils.isAddress('0XC1912FEE45D61C87CC5EA59DAE31190FFFFF232D');
    > true // as all is uppercase, no checksum will be checked

    web3.utils.isAddress('0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
    > true

    web3.utils.isAddress('0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
    > false // wrong checksum

------------------------------------------------------------------------------


toChecksumAddress
=====================

.. code-block:: javascript

    web3.utils.toChecksumAddress(address)

Will convert an upper or lowercase Ethereum address to a checksum address.

----------
Parameters
----------

1. ``address`` - ``String``: An address string.

-------
Returns
-------

``String``: The checksum address.

-------
Example
-------

.. code-block:: javascript

    web3.utils.toChecksumAddress('0xc1912fee45d61c87cc5ea59dae31190fffff2323');
    > "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d"

    web3.utils.toChecksumAddress('0XC1912FEE45D61C87CC5EA59DAE31190FFFFF232D');
    > "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d" // same as above


------------------------------------------------------------------------------


checkAddressChecksum
=====================

.. code-block:: javascript

    web3.utils.checkAddressChecksum(address)

Checks the checksum of a given address. Will also return false on non-checksum addresses.

----------
Parameters
----------

1. ``address`` - ``String``: An address string.

-------
Returns
-------

``Boolean``: ``true`` when the checksum of the address is valid, ``false`` if its not a checksum address, or the checksum is invalid.

-------
Example
-------

.. code-block:: javascript

    web3.utils.checkAddressChecksum('0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
    > true


------------------------------------------------------------------------------


toHex
=====================

.. code-block:: javascript

    web3.utils.toHex(mixed)

Will auto convert any given value to HEX.
Number strings will interpreted as numbers.
Text strings will be interepreted as UTF-8 strings.

----------
Parameters
----------

1. ``mixed`` - ``String|Number|BN|BigNumber``: The input to convert to HEX.

-------
Returns
-------

``String``: The resulting HEX string.

-------
Example
-------

.. code-block:: javascript

    web3.utils.toHex('234');
    > "0xea"

    web3.utils.toHex(234);
    > "0xea"

    web3.utils.toHex(new BN('234'));
    > "0xea"

    web3.utils.toHex(new BigNumber('234'));
    > "0xea"

    web3.utils.toHex('I have 100€');
    > "0x49206861766520313030e282ac"


------------------------------------------------------------------------------

.. _utils-tobn:

toBN
=====================

.. code-block:: javascript

    web3.utils.toBN(number)

Will safly convert any given value, including BigNumebr.js into a BN.js instance, for handling big numbers in JavaScript.

For just the BN class use :ref:`utils.BN <utils-bn>`

----------
Parameters
----------

1. ``number`` - ``String|Number``: Number to convert to a big number.

-------
Returns
-------

``Object``: The BN instance.

-------
Example
-------

.. code-block:: javascript

    web3.utils.toBN(1234).toString();
    > "1234"

    web3.utils.toBN('1234').add(web3.utils.toBN('1')).toString();
    > "1235"

    web3.utils.toBN('0xea').toString();
    > "234"


------------------------------------------------------------------------------


sha3
=====================

.. code-block:: javascript

    web3.utils.sha3(string)

Will calculate the sha3 of the input.

----------
Parameters
----------

1. ``string`` - ``String``: A string to hash.

-------
Returns
-------

``String``: the result hash.

-------
Example
-------

.. code-block:: javascript

    web3.utils.sha3('234');
    > "0xc1912fee45d61c87cc5ea59dae311904cd86b84fee17cc96966216f811ce6a79"


------------------------------------------------------------------------------


sha3
=====================

.. code-block:: javascript

    web3.utils.sha3(string)

Will calculate the sha3 of the input.

----------
Parameters
----------

1. ``string`` - ``String``: A string to hash.

-------
Returns
-------

``String``: the result hash.

-------
Example
-------

.. code-block:: javascript

    web3.utils.sha3('234');
    > "0xc1912fee45d61c87cc5ea59dae311904cd86b84fee17cc96966216f811ce6a79"


------------------------------------------------------------------------------


sha3
=====================

.. code-block:: javascript

    web3.utils.sha3(string)

Will calculate the sha3 of the input.

----------
Parameters
----------

1. ``string`` - ``String``: A string to hash.

-------
Returns
-------

``String``: the result hash.

-------
Example
-------

.. code-block:: javascript

    web3.utils.sha3('234');
    > "0xc1912fee45d61c87cc5ea59dae311904cd86b84fee17cc96966216f811ce6a79"


------------------------------------------------------------------------------
