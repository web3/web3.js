.. _web3-core-subscriptions:

.. include:: include_announcement.rst

=========================
Core Subscriptions Module
=========================

The ``Core Subscriptions Module`` does provide all the subscriptions classes to extend and execute them.

.. _web3-module-abstract-subscription:


AbstractSubscription
====================


Source: `AbstractSubscription <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-subscriptions/lib/subscriptions/AbstractSubscription.js>`_

The ``AbstractSubscription`` class extends from the ``EventEmitter`` object and does have the following constructor parameters:

- :ref:`type <web3-module-abstract-subscription-subscribe>` - ``String`` The subscriptions type ``eth_subscribe`` or ``shh_subscribe``.
- :ref:`method <web3-module-abstract-subscription-subscribe>` - ``String`` The subscription method which is the first parameter in the JSON-RPC payload object.
- :ref:`options <web3-module-abstract-subscription-subscribe>` - ``Object`` The options object of the subscription.
- :ref:`formatters <web3-module-abstract-subscription-subscribe>` - ``Object`` The formatters object.
- :ref:`moduleInstance <web3-module-abstract-subscription-subscribe>` - ``AbstractWeb3Module`` An ``AbstractWeb3Module`` instance.

The ``AbstractSubscription`` class is the base subscription class of all subscriptions.

You're able to overwrite these methods:

- :ref:`subscribe <web3-module-abstract-subscription-subscribe>`
- :ref:`unsubscribe <web3-module-abstract-subscription-unsubscribe>`
- :ref:`beforeSubscription <web3-module-abstract-subscription-beforeSubscription>`
- :ref:`onNewSubscriptionItem <web3-module-abstract-subscription-onNewSubscriptionItem>`

.. _web3-module-abstract-subscription-subscribe:

subscribe
=========

.. code-block:: javascript

    subscription.subscribe(callback)


This method will start the subscription.

----------
Parameters
----------

- ``callback`` - ``Function``

-------
Returns
-------

``AbstractSubscription``


------------------------------------------------------------------------------------------------------------------------


.. _web3-module-abstract-subscription-unsubscribe:

unsubscribe
===========

.. code-block:: javascript

    subscription.unsubscribe(callback)


This method will end the subscription.

----------
Parameters
----------

- ``callback`` - ``Function``

-------
Returns
-------

``Promise<boolean|Error>``


------------------------------------------------------------------------------------------------------------------------


.. _web3-module-abstract-subscription-before-subscription:

beforeSubscription
==================

.. code-block:: javascript

    subscription.beforeSubscription(moduleInstance)


This method will be executed before the subscription happens.
The ``beforeSubscription`` method gives you the possibility to customize the subscription class before the request will be sent.

----------
Parameters
----------

- ``moduleInstance`` - ``AbstractWeb3Module`` The current ``AbstractWeb3Module``.


------------------------------------------------------------------------------------------------------------------------


.. _web3-module-abstract-subscription-on-new-subscription-item:

onNewSubscriptionItem
=====================

.. code-block:: javascript

    subscription.onNewSubscriptionItem(moduleInstance)


This method will be executed on each subscription item.
The ``onNewSubscriptionItem`` method gives you the possibility to map the response.

----------
Parameters
----------

- ``item`` - ``any``

-------
Returns
-------

``any``


------------------------------------------------------------------------------------------------------------------------


.. _web3-module-abstract-subscription-type:

type
====

.. code-block:: javascript

    subscription.type


The property ``type`` does contain the subscription type.

-------
Returns
-------

``String`` - ``eth_subscribe`` or ``shh_subscribe``


------------------------------------------------------------------------------------------------------------------------


.. _web3-module-abstract-subscription-method:

method
======

.. code-block:: javascript

    subscription.method


The property ``method`` does contain the subscription method.

-------
Returns
-------

``String``


------------------------------------------------------------------------------------------------------------------------


.. _web3-module-abstract-subscription-options:

options
=======

.. code-block:: javascript

    subscription.options


The property ``options`` does contain the subscription options.

-------
Returns
-------

``Object``


------------------------------------------------------------------------------------------------------------------------


.. _web3-module-abstract-subscription-id:

id
====

.. code-block:: javascript

    subscription.id


The property ``id`` does contain the subscription id when the subscription is running.

-------
Returns
-------

``String``

------------------------------------------------------------------------------------------------------------------------
