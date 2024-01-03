---
description: >
  Hi! In this article we're going to see how MongoDB handles locks and how we can achieve Document-level locking.
id: 7902
title: 'How to do Document-level locking on MongoDB and .NET Core - part 1'
date: 2020-12-28T20:11:41-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7902
permalink: /how-to-do-document-level-locking-on-mongodb-and-net-core-part-1/
image: /assets/uploads/2020/12/Love-locks-Pont-des-Arts-014.jpg
categories:
  - .NET
  - MongoDB
  - Programming
  - Software Architecture
tags:
  - databases
  - MongoDB
---
Hi All! Today we're going to see how MongoDB handles locks and how we can achieve Document-level locking.

The default MongoDB storage engine, _<a href="https://docs.mongodb.com/manual/core/wiredtiger/" target="_blank" rel="noreferrer noopener">WiredTiger</a>,_ uses optimistic concurrency control, or OCC. In a nutshell, it assumes that 

<blockquote class="wp-block-quote">
  <p>
    multiple transactions can frequently complete without interfering with each other.
  </p>
  
  <cite><a href="https://en.wikipedia.org/wiki/Optimistic_concurrency_control#:~:text=Optimistic%20concurrency%20control%20(OCC)%20is,without%20interfering%20with%20each%20other." target="_blank" rel="noreferrer noopener">wikipedia</a></cite>
</blockquote>

This basically means we're somewhat sure that nobody else is going to update our data while we're working on it. 

#### In case that happens, one operation is going to succeed, while the others will fail, entering some kind of retry loop.

We're relying on the nature of the data and the operations available on the Domain. In short, we're being _optimistic_ that things will end up just fine.

When we want to be absolutely sure that only one consumer will be able to operate a specific set of data, we could use some form of locking.

This falls into the realm of _Pessimistic Locking_: we block access to the data till we're done with it. The drawback is simple: what if we never release a lock? The other consumers will deadlock, so we need a proper strategy (for example timeouts) to handle those cases. 

It can get complicated and ugly pretty quickly so be careful.

There might be some situations, however, where you need more fine control over the locking strategy, for example when you're dealing with <a href="https://www.davidguida.net/opensleigh-a-saga-management-library-for-net-core/" target="_blank" rel="noreferrer noopener">Sagas and Distributed Transactions</a>.

Now, WiredTiger <a href="https://docs.mongodb.com/manual/faq/concurrency/" target="_blank" rel="noreferrer noopener">allows locking</a> only at the global, database or collection levels. This means that we cannot lock a single document.

Luckily for us, operations on MongoDB are atomic, so we can "fake" some sort of pessimistic locking and handle part of the complexity on the application side.

The idea is to decorate every document with two additional properties, something like:

<pre class="EnlighterJSRAW" data-enlighter-language="json" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">{
    "LockId" : UUID("6ca9d76f-01ac-42cc-88ca-b2ecd5b286c3"),
    "LockTime" : ISODate("2020-12-28T04:42:13.528Z")
}</pre>

When we want to lock a document, we fetch it by ID but we also make sure that _LockId_ is null. Additionally, we can also check that _LockTime_ is after a specific window: this way we can discard previous locks if they're expired.

#### Using the <a href="https://api.mongodb.com/csharp/current/html/M_MongoDB_Driver_IMongoCollection_1_FindOneAndUpdateAsync__1.htm" target="_blank" rel="noreferrer noopener"><em>FindOneAndUpdateAsync</em> </a>API, we can fetch the document and in the same operation, we can set both _LockId_ and _LockTime_.

We'll also configure the call to be an _upsert_: this way if the document is not in the DB yet, we can also create it. Moreover, the next time someone is trying to access it, the engine will throw a _MongoCommandException_ instead.

When we're done with the document, we can release it by simply setting to null both _LockId_ and _LockTime_.

Just for you to know, a while ago I started working on <a href="https://github.com/mizrael/OpenSleigh" target="_blank" rel="noreferrer noopener">OpenSleigh</a>, a distributed saga management library for .NET Core. It uses the same technique in its MongoDB <a href="https://github.com/mizrael/OpenSleigh/blob/develop/src/OpenSleigh.Persistence.Mongo/MongoSagaStateRepository.cs" target="_blank" rel="noreferrer noopener">persistence driver</a>.

The <a href="https://www.davidguida.net/how-to-do-document-level-locking-on-mongodb-and-net-core-part-2/" target="_blank" rel="noreferrer noopener">next time</a> we'll see a small demo and dig a bit more into the details. Stay tuned!

<div class="post-details-footer-widgets">
</div>