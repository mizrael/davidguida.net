---
description: >
  Welcome back to the second article of the Series. Today we're going to discuss a simple implementation of a locking technique on MongoDB.
id: 7915
title: 'How to do Document-level locking on MongoDB and .NET Core - part 2'
date: 2021-01-03T21:34:58-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7915
permalink: /how-to-do-document-level-locking-on-mongodb-and-net-core-part-2/
image: /assets/uploads/2021/01/lock-the-doors-1-1196574.jpg
categories:
  - .NET
  - MongoDB
  - Programming
tags:
  - .NET Core
  - databases
  - MongoDB
---
Hi All! Welcome back to the second article of the Series. Today we're going to discuss a simple implementation of a locking technique on MongoDB.

<a href="https://www.davidguida.net/how-to-do-document-level-locking-on-mongodb-and-net-core-part-1/" target="_blank" rel="noreferrer noopener">Last time</a> we saw what _optimistic_ and _pessimistic_ locking mean and we talked about a possible implementation using two extra fields.

Today instead we'll dig into the code! As usual, I've published <a href="https://github.com/mizrael/MongoLocks" target="_blank" rel="noreferrer noopener">all the code</a> on GitHub, feel free to look and come back.

Let's start by defining a simple Entity:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public record Dummy(Guid Id, string Value, Guid? LockId = null, DateTime? LockTime = null);</pre>

Note the two nullable properties, _LockId_ and _LockTime_, they're going to be very useful in a moment.

I like to keep my classes immutable and <a href="https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-9?WT.mc_id=DOP-MVP-5003878#record-types" target="_blank" rel="noreferrer noopener">C# 9 records</a> are definitely a nice way to do that.

Let's take a look at the <a href="https://github.com/mizrael/MongoLocks/blob/main/MongoLocks/DummyRepository.cs" target="_blank" rel="noreferrer noopener">Repository</a> now. This class exposes just two methods: _LockAsync_ and _ReleaseLockAsync._ Pretty self-explanatory, aren't they 😀

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public async Task&lt;Dummy> LockAsync(Guid id, Dummy newEntity, CancellationToken cancellationToken = default)
{
	var filter = Builders&lt;Dummy>.Filter.And(
		Builders&lt;Dummy>.Filter.Eq(e => e.Id, id),
		Builders&lt;Dummy>.Filter.Or(
			Builders&lt;Dummy>.Filter.Eq(e => e.LockId, null),
			Builders&lt;Dummy>.Filter.Lt(e => e.LockTime, DateTime.UtcNow - _lockMaxDuration)
		)
	);
	var update = Builders&lt;Dummy>.Update
		.Set(e => e.LockId, Guid.NewGuid())
		.Set(e => e.LockTime, DateTime.UtcNow);
	
	if (newEntity is not null) {
		update = update.SetOnInsert(e => e.Id, newEntity.Id)
			       .SetOnInsert(e => e.Value, newEntity.Value);
	}
		
	var options = new FindOneAndUpdateOptions&lt;Dummy>() {
	    IsUpsert = true,
	    ReturnDocument = ReturnDocument.After
	};

	try
	{
		return await _collection.FindOneAndUpdateAsync(filter, update, options, cancellationToken);
	}
	catch (MongoCommandException e) when(e.Code == 11000 && e.CodeName == "DuplicateKey")
	{
		throw new LockException($"item '{id}' is already locked");
	}
}</pre>

In order to lock a document, the first thing to do is fetching it by ID. But with a twist: we also make sure that _LockId_ is null. Additionally, we're also checking if the lock has expired by querying on _LockTime_.

We can have 3 situations:

  1. the document is available. We fetch it, set _LockId_ and _LockTime_ and return to the caller. 
  2. the document is locked. The MongoDB driver will throw a specific _MongoCommandException_. We're catching that and converting it into a custom _<a href="https://github.com/mizrael/MongoLocks/blob/main/MongoLocks/LockException.cs" target="_blank" rel="noreferrer noopener">LockException</a>_.
  3. the document does not exist at all. We'll create it by setting _IsUpsert_ to _true_ and using the _Dummy_ instance we passed as input to initialize the data.

#### The trick here is that we're leveraging the <a href="https://api.mongodb.com/csharp/current/html/M_MongoDB_Driver_IMongoCollection_1_FindOneAndUpdateAsync__1.htm" target="_blank" rel="noreferrer noopener">FindOneAndUpdateAsync </a>MongoDB method, which executes both the operations atomically, in one go.

This will cover locking. Let's see how we can release the document now. The main idea is that we're locking, doing some operations and then release and update the data in the DB with the new state.

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public async Task ReleaseLockAsync(Dummy item, CancellationToken cancellationToken = default)
{
	var filter = Builders&lt;Dummy>.Filter.And(
		Builders&lt;Dummy>.Filter.Eq(e => e.Id, item.Id),
		Builders&lt;Dummy>.Filter.Eq(e => e.LockId, item.LockId)
	);

	var update = Builders&lt;Dummy>.Update
		.Set(e => e.Value, item.Value)
		.Set(e => e.LockId, null)
		.Set(e => e.LockTime, null);
	
	var options = new UpdateOptions(){
		IsUpsert = false
	};

	var result = await _collection.UpdateOneAsync(filter, update, options, cancellationToken);
	
	if (result is null || result.ModifiedCount != 1)
		throw new LockException($"unable to release lock on item '{item.Id}'");
}</pre>

Here we're filtering by _Id_ and _LockId_. In this case, we'll be using _<a href="https://api.mongodb.com/csharp/current/html/M_MongoDB_Driver_IMongoCollection_1_UpdateOneAsync.htm" target="_blank" rel="noreferrer noopener">UpdateOneAsync</a>_ since we don't need to return anything to the caller. 

We make sure to reset to null both _LockId_ and _LockTime_, de-facto freeing up the document.

We'll also set _IsUpsert_ to false: we are already sure the document exists after the call to _LockAsync._

This is the same technique I'm using in the MongoDB driver for <a href="https://github.com/mizrael/OpenSleigh" target="_blank" rel="noreferrer noopener">OpenSleigh</a>, the Saga management library for .NET Core I'm working on these days.

That's all folks!

<div class="post-details-footer-widgets">
</div>