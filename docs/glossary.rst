
========
Glossary
========



.. _glossary-json-interface:

------------------------------------------------------------------------------

json interface
=====================

The json interface is a json object describing the `Application Binary Interface (ABI) <https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI>`_ for an Ethereum smart contract.

Using this json interface web3.js is able to create JavaScript object representing the smart contract and its methods and events using the :ref:`web3.eth.Contract object <eth-contract>`.

-------
Specification
-------

Functions:

- ``type``: ``"function"``, ``"constructor"`` (can be omitted, defaulting to ``"function"``; ``"fallback"`` also possible but not relevant in web3.js);
- ``name``: the name of the function (only present for function types);
- ``constant``: ``true`` if function is specified to not modify the blockchain state;
- ``payable``: ``true`` if function accepts ether, defaults to ``false``;
- ``stateMutability``: a string with one of the following values: ``pure`` (specified to not read blockchain state), ``view`` (same as ``constant`` above), ``nonpayable`` and ``payable`` (same as ``payable`` above);
- ``inputs``: an array of objects, each of which contains:

  - ``name``: the name of the parameter;
  - ``type``: the canonical type of the parameter.
- ``outputs``: an array of objects same as ``inputs``, can be omitted if no outputs exist.

Events:

- ``type``: always ``"event"``
- ``name``: the name of the event;
- ``inputs``: an array of objects, each of which contains:

  - ``name``: the name of the parameter;
  - ``type``: the canonical type of the parameter.
  - ``indexed``: ``true`` if the field is part of the log's topics, ``false`` if it one of the log's data segment.
- ``anonymous``: ``true`` if the event was declared as ``anonymous``.


-------
Example
-------

.. code-block:: javascript

    contract Test {
        uint a;
        address d = 0x12345678901234567890123456789012;

        function Test(uint testInt)  { a = testInt;}

        event Event(uint indexed b, bytes32 c);

        event Event2(uint indexed b, bytes32 c);

        function foo(uint b, bytes32 c) returns(address) {
            Event(b, c);
            return d;
        }
    }

    // would result in the JSON:
    [{
        "type":"constructor",
        "payable":false,
        "stateMutability":"nonpayable"
        "inputs":[{"name":"testInt","type":"uint256"}],
      },{
        "type":"function",
        "name":"foo",
        "constant":false,
        "payable":false,
        "stateMutability":"nonpayable",
        "inputs":[{"name":"b","type":"uint256"}, {"name":"c","type":"bytes32"}],
        "outputs":[{"name":"","type":"address"}]
      },{
        "type":"event",
        "name":"Event",
        "inputs":[{"indexed":true,"name":"b","type":"uint256"}, {"indexed":false,"name":"c","type":"bytes32"}],
        "anonymous":false
      },{
        "type":"event",
        "name":"Event2",
        "inputs":[{"indexed":true,"name":"b","type":"uint256"},{"indexed":false,"name":"c","type":"bytes32"}],
        "anonymous":false
    }]


------------------------------------------------------------------------------
