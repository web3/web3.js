.. _web3-modules:

.. include:: include_announcement.rst

===============
Web3 Module API
===============

The Web3 Module API gives you the possibility to create your own custom Web3 Module with JSON-RPC methods, subscriptions
or contracts. The provided modules from the Web3 library are also written with the Web3 Module API the core does provide.

The idea of the Web3 Module API is to extend and customize the JSON-RPC methods, contracts and subscriptions to project
specific functions with a similar kind of API the DApp developer knows from the Web3.js library. It is possible
to create complex contract APIs and tools for the development of a DApp.

The Web3 Module API provides the following ES6 classes:

- :ref:`AbstractWeb3Module <web3-abtract-module>`
- :ref:`AbstractMethodFactory <web3-module-abstract-method-factory>`
- :ref:`AbstractMethod <web3-module-abstract-method>`
- :ref:`AbstractCallMethod <web3-module-abstract-call-method>`
- :ref:`AbstractSendMethod <web3-module-abstract-send-method>`
- :ref:`AbstractSubscription <web3-module-abstract-subscription>`

=======
Methods
=======

The Web3.js library does have implemented most of the provided JSON-RPC methods a Ethereum node does provide.
If you're interested to know which methods you could extend from then please check out the folders in the code base.

Source: `Web3.js method classes <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/src/methods>`_

------------------------------------------------------------------------------------------------------------------------

=============
Subscriptions
=============

The Web3.js library does have implemented the subscriptions a Ethereum node does provide.
If you're interested to know which subscriptions you could extend from then please check out the folders in the code base.

Source: `Web3.js subscription classes <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-subscriptions/src/subscriptions>`_

------------------------------------------------------------------------------------------------------------------------

=======
Example
=======

Clone the ``web3-examples`` GitHub repository and copy the following `starter folder: <https://github.com/ethereum/web3-examples/tree/development/modules/starter-module>`_

If you moved the files in your folder then run ``npm install`` and ``npm run build``.
This will install all required dependencies and builds the module with the ``development`` flag.
You can find further information to the development environment in the readme file of the example folder.

These ES6 classes are included in the example folder:

- :ref:`StarterModule <>`_
- :ref:`StarterModuleMethodFactory <>`_
- :ref:`StarterMethod <>`_
- :ref:`StarterContract <>`_
- :ref:`StarterSubscription <>`_

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-module:

AbstractWeb3Module
==================

Source: `AbstractWeb3Module <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractWeb3Module.js>`_

The ``AbstractWeb3Module`` does have the following constructor parameters:

- ``provider`` - The provider class or string.
- ``providersModuleFactory`` - The ``ProvidersModuleFactory`` which will be used to resolve the provider in the constructor.
- ``methodModuleFactory`` - The ``MethodModuleFactory`` is optional and will just be used if the ``MethodFactory`` is given.
- ``methodFactory`` - The ``MethodFactory`` is only required if you extend the module with methods.
- ``options`` - These are the default ``options``.


If you would like to support the latest features of Web3.js and to provide the same API for your module then please pass
the ``methodModuleFactory`` and the ``methodFactory`` parameter for extending the module with your methods.

The parameters ``methodModuleFactory`` and ``methodFactory`` aren't required if you providing your own way to interact with a Web3 method.

These are the available methods and properties the AbstractWeb3Module does provide:

.. include:: include_package-core.rst

------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-method-factory:

AbstractMethodFactory
=====================

Source: `AbstractMethodFactory <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractMethodFactory.js>`_

The ``AbstractMethodFactory`` does have the following constructor parameters:

- ``methodModuleFacotry`` - The MethodModuleFactory.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.

The ``AbstractMethodFactory`` class wil be used in the ``MethodProxy`` of the current module for creating the correct method.

This is the right place to pass additional parameters to a custom method class. Just extend the ``createMethod()`` of
the ``AbstractMethodFactory`` and you're able to pass additional parameters to the constructor of your custom method.

------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-method:

AbstractMethod
==============

Source: `AbstractMethod <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractMethod.js>`_

The ``AbstractMethod`` does have the following constructor parameters:

- ``rpcMethod`` - The JSON-RPC method name.
- ``parametersAmount`` - The amount of parameters this JSON-RPC method has.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.

The ``AbstractMethod`` is the base method class and does provide the basic functionalities to create a
Web3.js compatible JSON-RPC method.

**The ``execute`` method of the ``AbstractMethod`` class has to get overwritten.**

You're able to overwrite these methods:

- :ref:`afterExecution <web3-abstract-method-after-execution>`
- :ref:`beforeExecution <web3-abstract-method-before-execution>`

Usage Example
*************

This example will show the usage of the ``arguments`` property.

It's also possible to set the parameters and callback method directly over the ``parameters`` and ``callback`` property
of the method class.

.. code-block:: javascript

    class Example extends AbstractWeb3Module {
        constructor(...) {
            ...
        }

        myMethod() {
            const method new MyCustomMethod(...);
            method.arguments = arguments

            return method.execute(this);
        }
    }

    const example = new Example(...);

    const response = await example.myMethod('parameter').
    > "result"


    example.myMethod('parameters', (error, response) => {
        console.log(response);
    };
    > "result"


The AbstractMethod class does have the following methods and properties:

.. include:: web3-module-abstract-method-class-reference.rst

------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-call-method:

AbstractCallMethod
==================

Source: `AbstractCallMethod <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractCallMethod.js>`_

The ``AbstractCallMethod`` extends from the :ref:`AbstractMethod <web3-module-abstract-method` and
does have the following constructor parameters:

- ``rpcMethod`` - The JSON-RPC method name.
- ``parametersAmount`` - The amount of parameters this JSON-RPC method has.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.

The ``AbstractCallMethod`` is the base method class for all methods expect the "send transaction" methods.

**Don't overwrite the ``execute`` method of the ``AbstractCallMethod`` class.**

You're able to overwrite these methods:

- :ref:`afterExecution <web3-abstract-method-after-execution>`
- :ref:`beforeExecution <web3-abstract-method-before-execution>`

.. include:: web3-module-abstract-method-class-reference.rst


------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-send-method:

AbstractSendMethod
==================

Source: `AbstractSendMethod <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractSendMethod.js>`_

The ``AbstractSendMethod`` extends from the :ref:`AbstractMethod <web3-module-abstract-method` and
does have the following constructor parameters:

- ``rpcMethod`` - The JSON-RPC method name.
- ``parametersAmount`` - The amount of parameters this JSON-RPC method has.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.
- ``tranactionConfirmationWorkflow`` - The ``TransactionConfirmationWorkflow`` class which defines the confirmation process of the transaction.

The ``AbstractSendMethod`` is the base method class for all "send transaction" methods.

**Don't overwrite the ``execute`` method of the ``AbstractSendMethod`` class.**

You're able to overwrite these methods:

- :ref:`afterExecution <web3-abstract-method-after-execution>`
- :ref:`beforeExecution <web3-abstract-method-before-execution>`

.. include:: web3-module-abstract-method-class-reference.rst


------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-subscription:

AbstractSubscription
====================

Source: `AbstractSubscription <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-subscriptions/lib/subscriptions/AbstractSubscription.js>`_

The ``AbstractSubscription`` extends from the ``EventEmitter`` object and does have the following constructor parameters:

- :ref:`type <web3-abstract-subscription-subscribe>` - The subscriptions type ``eth_subscribe`` or ``shh_subscribe``.
- :ref:`method <web3-abstract-subscription-subscribe>` - The subscription method which is the first parameter in the JSON-RPC payload object.
- :ref:`options <web3-abstract-subscription-subscribe>` - The options object of the subscription.
- :ref:`formatters <web3-abstract-subscription-subscribe>` - The formatters object.
- :ref:`moduleInstance <web3-abstract-subscription-subscribe>` - An ``AbstractWeb3Module`` instance.

The ``AbstractSubscription`` is the base subscription class of all subscriptions.

**Don't overwrite the ``subscribe`` method of the ``AbstractSubscription`` class.**

You're able to overwrite these methods:

- :ref:`subscribe <web3-abstract-subscription-subscribe>`
- :ref:`unsubscribe <web3-abstract-subscription-unsubscribe>`
- :ref:`beforeSubscription <web3-abstract-subscription-before-execution>`
- :ref:`onNewSubscriptionItem <web3-abstract-subscription-after-execution>`

.. _web3-abstract-subscription-subscribe:

subscribe
*********

This method will start the subscription.

==========
Parameters
==========

- ``callback: Function`` - The callback function which will be called with the arguments ``error: Error`` and ``response: any``.

=======
Returns
=======

``AbstractSubscription``

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-subscription-unsubscribe:

unsubscribe
***********

This method will end the subscription.

==========
Parameters
==========

- ``callback: Function`` - The callback function which will be called with the arguments ``error: Error`` and ``response: any``.

=======
Returns
=======

``Promise<boolean|Error>``

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-subscription-before-subscription:

beforeSubscription
******************

This method will be executed before the subscription happens.
The ``beforeSubscription`` method gives you the possibility to customize the subscription class before the request will be sent.

==========
Parameters
==========

- ``moduleInstance: AbstractWeb3Module`` - The current ``AbstractWeb3Module``.

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-subscription-on-new-subscription-item:

onNewSubscriptionItem
*********************

This method will be executed on each subscription item.
The ``onNewSubscriptionItem`` method gives you the possibility to map the response.

==========
Parameters
==========

- ``moduleInstance: AbstractWeb3Module`` - The current ``AbstractWeb3Module``.

=======
Returns
=======

``any``

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-subscription-type:

type
****

The property ``type`` does contain the subscription type.

=======
Returns
=======

``string`` - Returns ``eth_subscribe`` or ``shh_subscribe``

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-subscription-method:

method
******

The property ``method`` does contain the subscription method.

=======
Returns
=======

``string``

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-subscription-options:

options
*******

The property ``options`` does contain the subscription options.

=======
Returns
=======

``object``

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-subscription-id:

id
****

The property ``id`` does contain the subscription id when the subscription is running.

=======
Returns
=======

``string``

------------------------------------------------------------------------------------------------------------------------
