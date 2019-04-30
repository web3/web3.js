.. _web3-core-subscriptions:

.. include:: include_announcement.rst

=========================
Core Subscriptions Module
=========================

The Core Subscriptions Module does provide all the subscriptions classes for extending from them and the ``SubscriptionsFactory`` class for simply executing them.

.. _web3-module-abstract-subscription:

AbstractSubscription
====================

Source: `AbstractSubscription <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-subscriptions/lib/subscriptions/AbstractSubscription.js>`_

The ``AbstractSubscription`` extends from the ``EventEmitter`` object and does have the following constructor parameters:

- :ref:`type <web3-module-abstract-subscription-subscribe>` - The subscriptions type ``eth_subscribe`` or ``shh_subscribe``.
- :ref:`method <web3-module-abstract-subscription-subscribe>` - The subscription method which is the first parameter in the JSON-RPC payload object.
- :ref:`options <web3-module-abstract-subscription-subscribe>` - The options object of the subscription.
- :ref:`formatters <web3-module-abstract-subscription-subscribe>` - The formatters object.
- :ref:`moduleInstance <web3-module-abstract-subscription-subscribe>` - An ``AbstractWeb3Module`` instance.

The ``AbstractSubscription`` is the base subscription class of all subscriptions.

**Be careful with overwriting of the ``subscribe`` method of the ``AbstractSubscription`` class. It can lead to instability of your module**

You're able to overwrite these methods:

- :ref:`subscribe <web3-module-abstract-subscription-subscribe>`
- :ref:`unsubscribe <web3-module-abstract-subscription-unsubscribe>`
- :ref:`beforeSubscription <web3-module-abstract-subscription-before-execution>`
- :ref:`onNewSubscriptionItem <web3-module-abstract-subscription-after-execution>`

.. _web3-module-abstract-subscription-subscribe:

subscribe
=========

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

.. _web3-module-abstract-subscription-unsubscribe:

unsubscribe
===========

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

.. _web3-module-abstract-subscription-before-subscription:

beforeSubscription
==================

This method will be executed before the subscription happens.
The ``beforeSubscription`` method gives you the possibility to customize the subscription class before the request will be sent.

==========
Parameters
==========

- ``moduleInstance: AbstractWeb3Module`` - The current ``AbstractWeb3Module``.

------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-subscription-on-new-subscription-item:

onNewSubscriptionItem
=====================

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

.. _web3-module-abstract-subscription-type:

type
====

The property ``type`` does contain the subscription type.

=======
Returns
=======

``string`` - Returns ``eth_subscribe`` or ``shh_subscribe``

------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-subscription-method:

method
======

The property ``method`` does contain the subscription method.

=======
Returns
=======

``string``

------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-subscription-options:

options
=======

The property ``options`` does contain the subscription options.

=======
Returns
=======

``object``

------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-subscription-id:

id
====

The property ``id`` does contain the subscription id when the subscription is running.

=======
Returns
=======

``string``

------------------------------------------------------------------------------------------------------------------------
