========
Glossary
========



.. _json-interface:

------------------------------------------------------------------------------

json interface
=====================

The json interface is a json object describing the `Application Binary Interface (ABI) <https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI>`_ for an Ethereum smart contract.

Using this json interface web3.js is able to create JavaScript object representing the smart contract and its methods and events using the :ref:`web3.eth.contract object <eth-contract>`.

-------
Specification
-------

Functions:

- ``type``: ``"function"`` or ``"constructor"`` (can be omitted, defaulting to ``"function"``);
- ``name``: the name of the function (only present for function types);
- ``inputs``: an array of objects, each of which contains:
  * ``name``: the name of the parameter;
  * ``type``: the canonical type of the parameter.
- ``outputs``: an array of objects same as ``inputs``, can be omitted if no outputs exist.

Events:

- ``type``: always ``"event"``
- ``name``: the name of the event;
- ``inputs``: an array of objects, each of which contains:
  * ``name``: the name of the parameter;
  * ``type``: the canonical type of the parameter.
  * ``indexed``: ``true`` if the field is part of the log's topics, ``false`` if it one of the log's data segment.
- ``anonymous``: ``true`` if the event was declared as ``anonymous``.


-------
Example
-------

.. code-block:: javascript

    contract Test {
        bytes32 b;

        function Test() returns(address b){ b = 0x12345678901234567890123456789012; }

        event Event(uint indexed a, bytes32 b)

        event Event2(uint indexed a, bytes32 b)

        function foo(uint a) { Event(a, b); }
    }

    // would result in the JSON:

    [{
        "type":"function",
        "name":"foo",
        "inputs": [{"name":"a","type":"uint256"}],
        "outputs": [{"name":"b","type":"address"}]
    },{
        "type":"event",
        "name":"Event"
        "inputs": [{"name":"a","type":"uint256","indexed":true},{"name":"b","type":"bytes32","indexed":false}],
    }, {
        "type":"event",
        "name":"Event2"
        "inputs": [{"name":"a","type":"uint256","indexed":true},{"name":"b","type":"bytes32","indexed":false}],
    }, {
        "type":"event",
        "name":"Event2"
        "inputs": [{"name":"a","type":"uint256","indexed":true},{"name":"b","type":"bytes32","indexed":false}],
    }]


------------------------------------------------------------------------------
