.. _eth-abi:

=========
web3.eth.abi
=========

The ``web3.eth.abi`` functions let you encode and decode parameters to ABI (Application Binary Interface) for function calls to the EVM (Ethereum Virtual Machine).


------------------------------------------------------------------------------


encodeFunctionSignature
=====================

.. code-block:: javascript

    web3.eth.abi.encodeFunctionSignature(functionName);

Encodes the function name to its ABI signature, which are the first 4 bytes of the sha3 hash of the function name including types.

----------
Parameters
----------

1. ``functionName`` - ``String|Object``: The function name to encode.
or the :ref:`JSON interface <glossary-json-interface>` object of the function. If string it has to be in the form ``function(type,type,...)``, e.g: ``myFunction(uint256,uint32[],bytes10,bytes)``

-------
Returns
-------

``String`` - The ABI signature of the function.

-------
Example
-------

.. code-block:: javascript

    // From a JSON interface object
    web3.eth.abi.encodeFunctionSignature({
        name: 'myMethod',
        type: 'function',
        inputs: [{
            type: 'uint256',
            name: 'myNumber'
        },{
            type: 'string',
            name: 'myString'
        }]
    })
    > 0x24ee0097

    // Or string
    web3.eth.abi.encodeFunctionSignature('myMethod(uint256,string)')
    > '0x24ee0097'


------------------------------------------------------------------------------

encodeEventSignature
=====================

.. code-block:: javascript

    web3.eth.abi.encodeEventSignature(eventName);

Encodes the event name to its ABI signature, which are the sha3 hash of the event name including input types.

----------
Parameters
----------

1. ``eventName`` - ``String|Object``: The event name to encode.
or the :ref:`JSON interface <glossary-json-interface>` object of the event. If string it has to be in the form ``event(type,type,...)``, e.g: ``myEvent(uint256,uint32[],bytes10,bytes)``

-------
Returns
-------

``String`` - The ABI signature of the event.

-------
Example
-------

.. code-block:: javascript

    web3.eth.abi.encodeEventSignature('myEvent(uint256,bytes32)')
    > 0xf2eeb729e636a8cb783be044acf6b7b1e2c5863735b60d6daae84c366ee87d97

    // or from a json interface object
    web3.eth.abi.encodeEventSignature({
        name: 'myEvent',
        type: 'event',
        inputs: [{
            type: 'uint256',
            name: 'myNumber'
        },{
            type: 'bytes32',
            name: 'myBytes'
        }]
    })
    > 0xf2eeb729e636a8cb783be044acf6b7b1e2c5863735b60d6daae84c366ee87d97


------------------------------------------------------------------------------

encodeParameter
=====================

.. code-block:: javascript

    web3.eth.abi.encodeParameter(type, parameter);

Encodes a parameter based on its type to its ABI representation.

----------
Parameters
----------

1. ``type`` - ``String|Object``: The type of the parameter, see the `solidity documentation <http://solidity.readthedocs.io/en/develop/types.html>`_  for a list of types.
2. ``parameter`` - ``Mixed``: The actual parameter to encode.

-------
Returns
-------

``String`` - The ABI encoded parameter.

-------
Example
-------

.. code-block:: javascript

    web3.eth.abi.encodeParameter('uint256', '2345675643');
    > "0x000000000000000000000000000000000000000000000000000000008bd02b7b"

    web3.eth.abi.encodeParameter('uint256', '2345675643');
    > "0x000000000000000000000000000000000000000000000000000000008bd02b7b"

    web3.eth.abi.encodeParameter('bytes32', '0xdf3234');
    > "0xdf32340000000000000000000000000000000000000000000000000000000000"

    web3.eth.abi.encodeParameter('bytes', '0xdf3234');
    > "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003df32340000000000000000000000000000000000000000000000000000000000"

    web3.eth.abi.encodeParameter('bytes32[]', ['0xdf3234', '0xfdfd']);
    > "00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002df32340000000000000000000000000000000000000000000000000000000000fdfd000000000000000000000000000000000000000000000000000000000000"

    web3.eth.abi.encodeParameter(
        {
            "ParentStruct": {
                "propertyOne": 'uint256',
                "propertyTwo": 'uint256',
                "childStruct": {
                    "propertyOne": 'uint256',
                    "propertyTwo": 'uint256'
                }
            }
        },
        {
            "propertyOne": 42,
            "propertyTwo": 56,
            "childStruct": {
                "propertyOne": 45,
                "propertyTwo": 78
            }
        }
    );
    > "0x000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e"
------------------------------------------------------------------------------

encodeParameters
=====================

.. code-block:: javascript

    web3.eth.abi.encodeParameters(typesArray, parameters);

Encodes a function parameters based on its :ref:`JSON interface <glossary-json-interface>` object.

----------
Parameters
----------

1. ``typesArray`` - ``Array<String|Object>|Object``: An array with types or a :ref:`JSON interface <glossary-json-interface>` of a function. See the `solidity documentation <http://solidity.readthedocs.io/en/develop/types.html>`_  for a list of types.
2. ``parameters`` - ``Array``: The parameters to encode.

-------
Returns
-------

``String`` - The ABI encoded parameters.

-------
Example
-------

.. code-block:: javascript

    web3.eth.abi.encodeParameters(['uint256','string'], ['2345675643', 'Hello!%']);
    > "0x000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000"

    web3.eth.abi.encodeParameters(['uint8[]','bytes32'], [['34','434'], '0x324567fff']);
    > "0x0

    web3.eth.abi.encodeParameters(
        [
            'uint8[]',
            {
                "ParentStruct": {
                    "propertyOne": 'uint256',
                    "propertyTwo": 'uint256',
                    "ChildStruct": {
                        "propertyOne": 'uint256',
                        "propertyTwo": 'uint256'
                    }
                }
            }
        ],
        [
            ['34','434'],
            {
                "propertyOne": '42',
                "propertyTwo": '56',
                "ChildStruct": {
                    "propertyOne": '45',
                    "propertyTwo": '78'
                }
            }
        ]
    );
    > "0x00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000018"

------------------------------------------------------------------------------

encodeFunctionCall
=====================

.. code-block:: javascript

    web3.eth.abi.encodeFunctionCall(jsonInterface, parameters);

Encodes a function call using its :ref:`JSON interface <glossary-json-interface>` object and given parameters.

----------
Parameters
----------

1. ``jsonInterface`` - ``Object``: The :ref:`JSON interface <glossary-json-interface>` object of a function.
2. ``parameters`` - ``Array``: The parameters to encode.

-------
Returns
-------

``String`` - The ABI encoded function call. Means function signature + parameters.

-------
Example
-------

.. code-block:: javascript

    web3.eth.abi.encodeFunctionCall({
        name: 'myMethod',
        type: 'function',
        inputs: [{
            type: 'uint256',
            name: 'myNumber'
        },{
            type: 'string',
            name: 'myString'
        }]
    }, ['2345675643', 'Hello!%']);
    > "0x24ee0097000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000"

------------------------------------------------------------------------------

decodeParameter
=====================

.. code-block:: javascript

    web3.eth.abi.decodeParameter(type, hexString);

Decodes an ABI encoded parameter to its JavaScript type.

----------
Parameters
----------

1. ``type`` - ``String|Object``: The type of the parameter, see the `solidity documentation <http://solidity.readthedocs.io/en/develop/types.html>`_  for a list of types.
2. ``hexString`` - ``String``: The ABI byte code to decode.

-------
Returns
-------

``Mixed`` - The decoded parameter.

-------
Example
-------

.. code-block:: javascript

    web3.eth.abi.decodeParameter('uint256', '0x0000000000000000000000000000000000000000000000000000000000000010');
    > "16"

    web3.eth.abi.decodeParameter('string', '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000');
    > "Hello!%!"

    web3.eth.abi.decodeParameter('string', '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000');
    > "Hello!%!"

    web3.eth.abi.decodeParameter(
        {
            "ParentStruct": {
              "propertyOne": 'uint256',
              "propertyTwo": 'uint256',
              "childStruct": {
                "propertyOne": 'uint256',
                "propertyTwo": 'uint256'
              }
            }
        },

    , '0x000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e');
    > {
        '0': {
            '0': '42',
            '1': '56',
            '2': {
                '0': '45',
                '1': '78',
                'propertyOne': '45',
                'propertyTwo': '78'
            },
            'childStruct': {
                '0': '45',
                '1': '78',
                'propertyOne': '45',
                'propertyTwo': '78'
            },
            'propertyOne': '42',
            'propertyTwo': '56'
        },
        'ParentStruct': {
            '0': '42',
            '1': '56',
            '2': {
                '0': '45',
                '1': '78',
                'propertyOne': '45',
                'propertyTwo': '78'
            },
            'childStruct': {
                '0': '45',
                '1': '78',
                'propertyOne': '45',
                'propertyTwo': '78'
            },
            'propertyOne': '42',
            'propertyTwo': '56'
        }
    }

------------------------------------------------------------------------------

decodeParameters
=====================

.. code-block:: javascript

    web3.eth.abi.decodeParameters(typesArray, hexString);

Decodes ABI encoded parameters to its JavaScript types.

----------
Parameters
----------

1. ``typesArray`` - ``Array<String|Object>|Object``: An array with types or a :ref:`JSON interface <glossary-json-interface>` outputs array. See the `solidity documentation <http://solidity.readthedocs.io/en/develop/types.html>`_  for a list of types.
2. ``hexString`` - ``String``: The ABI byte code to decode.

-------
Returns
-------

``Object`` - The result object containing the decoded parameters.

-------
Example
-------

.. code-block:: javascript

    web3.eth.abi.decodeParameters(['string', 'uint256'], '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000');
    > Result { '0': 'Hello!%!', '1': '234' }

    web3.eth.abi.decodeParameters([{
        type: 'string',
        name: 'myString'
    },{
        type: 'uint256',
        name: 'myNumber'
    }], '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000');
    > Result {
        '0': 'Hello!%!',
        '1': '234',
        myString: 'Hello!%!',
        myNumber: '234'
    }

    web3.eth.abi.decodeParameters([
      'uint8[]',
      {
        "ParentStruct": {
          "propertyOne": 'uint256',
          "propertyTwo": 'uint256',
          "childStruct": {
            "propertyOne": 'uint256',
            "propertyTwo": 'uint256'
          }
        }
      }
    ], '0x00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000018');
    > Result {
        '0': ['42', '24'],
        '1': {
            '0': '42',
            '1': '56',
            '2':
                {
                    '0': '45',
                    '1': '78',
                    'propertyOne': '45',
                    'propertyTwo': '78'
                },
            'childStruct':
                {
                    '0': '45',
                    '1': '78',
                    'propertyOne': '45',
                    'propertyTwo': '78'
                },
            'propertyOne': '42',
            'propertyTwo': '56'
        }
    }

------------------------------------------------------------------------------


decodeLog
=====================

.. code-block:: javascript

    web3.eth.abi.decodeLog(inputs, hexString, topics);

Decodes ABI-encoded log data and indexed topic data.

----------
Parameters
----------

1. ``inputs`` - ``Object``: A :ref:`JSON interface <glossary-json-interface>` inputs array. See the `solidity documentation <http://solidity.readthedocs.io/en/develop/types.html>`_  for a list of types.
2. ``hexString`` - ``String``: The ABI byte code in the ``data`` field of a log.
3. ``topics`` - ``Array``: An array with the index parameter topics of the log, without the topic[0] if its a non-anonymous event, otherwise with topic[0].

-------
Returns
-------

``Object`` - The result object containing the decoded parameters.

-------
Example
-------

.. code-block:: javascript


    web3.eth.abi.decodeLog([{
        type: 'string',
        name: 'myString'
    },{
        type: 'uint256',
        name: 'myNumber',
        indexed: true
    },{
        type: 'uint8',
        name: 'mySmallNumber',
        indexed: true
    }],
    '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000',
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);
    > Result {
        '0': 'Hello%!',
        '1': '62224',
        '2': '16',
        myString: 'Hello%!',
        myNumber: '62224',
        mySmallNumber: '16'
    }
