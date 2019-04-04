
.. include:: include_announcement.rst

=====================
Web3
=====================

    The Web3 class is a wrapper to house all Ethereum related modules.

----------
Parameters
----------

1. ``provider`` - ``string|object``: A URL or one of the Web3 provider classes.
2. ``net`` - ``net.Socket`` (optional): The net NodeJS package.
3. ``options`` - ``object`` (optional) The Web3 :ref:`options <web3-module-options>`


-------
Example
-------

.. code-block:: javascript

    import Web3 from 'web3';

    // "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
    const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546', net, options);

    > web3.eth
    > web3.shh
    > web3.bzz
    > web3.utils
    > web3.version


------------------------------------------------------------------------------


Web3.modules
=====================

    This Static property will return an object with the classes of all major sub modules, to be able to instantiate them manually.

-------
Returns
-------

``Object``: A list of modules:
    - ``Eth`` - ``Function``: the Eth module for interacting with the Ethereum network see :ref:`web3.eth <eth>` for more.
    - ``Net`` - ``Function``: the Net module for interacting with network properties see :ref:`web3.eth.net <eth-net>` for more.
    - ``Personal`` - ``Function``: the Personal module for interacting with the Ethereum accounts see :ref:`web3.eth.personal <eth-personal>` for more.
    - ``Shh`` - ``Function``: the Shh module for interacting with the whisper protocol see :ref:`web3.shh <shh>` for more.
    - ``Bzz`` - ``Function``: the Bzz module for interacting with the swarm network see :ref:`web3.bzz <bzz>` for more.

-------
Example
-------

.. code-block:: javascript

    Web3.modules
    > {
        Eth(provider, net?, options?),
        Net(provider, net?, options?),
        Personal(provider, net?, options?),
        Shh(provider, net?, options?),
        Bzz(provider, net?, options?),
    }


.. include:: include_package-core.rst

------------------------------------------------------------------------------

version
=====================

    Property of the Web3 class.

.. code-block:: javascript

    web3.version

Contains the version of the ``web3`` wrapper class.

-------
Returns
-------

``String``: The current version.

-------
Example
-------

.. code-block:: javascript

    web3.version;
    > "1.0.0"
