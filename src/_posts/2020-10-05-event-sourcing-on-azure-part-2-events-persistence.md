---
description: >
  Welcome to the second part of the Event Sourcing on Azure series.We will see some code and talk about how we can deal with events persistence.
id: 7758
title: 'Event Sourcing on Azure &#8211; part 2: events persistence'
date: 2020-10-05T15:37:10-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7758
permalink: /event-sourcing-on-azure-part-2-events-persistence/
zakra_layout:
  - tg-site-layout--customizer
zakra_remove_content_margin:
  - "0"
zakra_transparent_header:
  - customizer
zakra_page_header:
  - "1"
zakra_logo:
  - "0"
dsq_thread_id:
  - "8227929739"
image: /assets/uploads/2020/10/Cosmos_Tyson.png
categories:
  - .NET
  - ASP.NET
  - Azure
  - Design Patterns
  - Microservices
  - Software Architecture
tags:
  - Azure
  - CosmosDB
  - CQRS
  - design patterns
  - event sourcing
---
Hi All! Welcome back for the second part of the **Event Sourcing on Azure** series. Today we&#8217;re going to digress a bit about the implementation details and some of the choices and tradeoff I&#8217;ve made. We will focus on how I&#8217;ve managed the events persistence and which tool I&#8217;ve chosen for it.

<a href="https://www.davidguida.net/event-sourcing-on-azure-part-1-architecture-plan/" target="_blank" rel="noreferrer noopener">Last time</a> we saw how a _generic_ Event Sourcing architecture might look like. As I wrote already, there&#8217;s no silver bullet. There might be times where you can&#8217;t simply apply a design pattern as it is but you&#8217;ll have to bend it to your needs. But it&#8217;s good to know the basics, understand the ground rules and diverge if needed.

Now, take some time and browse through the countless lines of code of <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank" target="_blank">SuperSafeBank</a>, I&#8217;ll wait. I started this repository <a rel="noreferrer noopener" href="https://www.davidguida.net/event-sourcing-in-net-core-part-1-a-gentle-introduction/" target="_blank">to demonstrate</a> how it&#8217;s possible to leverage **<a rel="noreferrer noopener" href="https://eventstore.com/" target="_blank">Eventstore </a>**and **<a rel="noreferrer noopener" href="https://kafka.apache.org/" target="_blank">Kafka </a>**to build an Event Sourcing system with DDD. A nice project to be fair, I learned quite a lot.

#### But still, with everybody and their dog using _The Cloud&#x2122;_, it felt natural to evolve the codebase and move to Azure. I still have to migrate the entire solution, but the bulk of it is complete. 

Let&#8217;s pause for a second and review what are the requirements. Our system needs to be capable of

  1. create customers
  2. get customer details by id
  3. create accounts for a customer
  4. get customer account details by account id
  5. withdraw money from an account
  6. deposit money on an account

Each one of those points will correspond to a REST endpoint. The previous, on-premise implementation was using a .NET Web API to expose all the endpoints. A <a href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-1-message-queues/" target="_blank" rel="noreferrer noopener">Background Worker</a> was responsible for handling the actual execution of the command and creating the <a href="https://docs.microsoft.com/en-us/azure/architecture/patterns/materialized-view?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Materialized Views</a>. This is done by listening to a few Kafka topics and reacting to the received events.

The new Azure version instead gets rid of Eventstore and Kafka in favour of <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/azure/cosmos-db/introduction?WT.mc_id=DOP-MVP-5003878" target="_blank"><strong>CosmosDB </strong></a>and <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview?WT.mc_id=DOP-MVP-5003878" target="_blank"><strong>ServiceBus</strong></a>, respectively.

**CosmosDB** is responsible of storing the events, handling versioning and consistency. A very simple implementation is <a href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Persistence.Azure/EventsRepository.cs" target="_blank" rel="noreferrer noopener">available here</a>, but basically this is the bulk of it:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">var partitionKey = new PartitionKey(aggregateRoot.Id.ToString());
var firstEvent = aggregateRoot.Events.First();
var expectedVersion = firstEvent.AggregateVersion;

var dbVersionResp = await _container.GetItemLinqQueryable&lt;EventData&lt;TKey>>(
		requestOptions: new QueryRequestOptions()
		{
			PartitionKey = partitionKey
		}).Select(e => e.AggregateVersion)
	.MaxAsync();
if (dbVersionResp.Resource != expectedVersion)
	throw new AggregateException($"aggregate version mismatch, expected {expectedVersion} , got {dbVersionResp.Resource}");

var transaction = _container.CreateTransactionalBatch(partitionKey);

foreach (var @event in aggregateRoot.Events)
{
	var data = _eventSerializer.Serialize(@event);
	var eventType = @event.GetType();
	var eventData = EventData&lt;TKey>.Create(aggregateRoot.Id, aggregateRoot.Version,	eventType.AssemblyQualifiedName, data);
	transaction.CreateItem(eventData);
}

await transaction.ExecuteAsync();</pre>

It will first query the latest version for a given Aggregate. As you can see, the Aggregate id is used as Partition Key. If the expected version doesn&#8217;t match, then somebody has already updated the data so we can&#8217;t proceed.

If everything is fine, it will open a transaction and write all the events available on the Aggregate.

Re-hydrating an Aggregate is quite easy :

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public async Task&lt;TA> RehydrateAsync(TKey key)
{
	var partitionKey = new PartitionKey(key.ToString());

	var events = new List&lt;IDomainEvent&lt;TKey>>();

	using var setIterator = _container.GetItemQueryIterator&lt;EventData&lt;TKey>>(requestOptions: new QueryRequestOptions { MaxItemCount = 100, PartitionKey = partitionKey });
	while (setIterator.HasMoreResults)
	{
		foreach (var item in await setIterator.ReadNextAsync())
		{
			var @event = _eventSerializer.Deserialize&lt;TKey>(item.Type, item.Data);
			events.Add(@event);
		}
	}

	if (!events.Any())
		return null;

	var result = BaseAggregateRoot&lt;TA, TKey>.Create(events.OrderBy(e => e.AggregateVersion));
	return result;
}</pre>

We basically query all the events for a given Aggregate, sort them by Version and replay then one after another. Piece of cake.

The <a href="https://www.davidguida.net/event-sourcing-on-azure-part-3-command-validation/" target="_blank" rel="noreferrer noopener">next time </a>we&#8217;ll see how to validate a Command before executing it. Ciao!

<div class="post-details-footer-widgets">
</div>