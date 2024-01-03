---
description: >
  Here we are for the second part of our Event Sourcing series. This time we'll see how we can start storing events in our system.
id: 7119
title: 'Event Sourcing in .NET Core - part 2: storing events'
date: 2020-04-06T04:00:00-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7119
permalink: /event-sourcing-in-net-core-part-2-storing-events/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/04/EventStreaming.jpg
categories:
  - .NET
  - ASP.NET
  - Design Patterns
  - Docker
  - Microservices
  - MongoDB
  - Programming
  - Software Architecture
tags:
  - dotnetcore
  - event sourcing
  - Event Store
  - Kafka
  - MongoDB
  - software architecture
---
And here we are for the second part of the **Event Sourcing** series. <a rel="noreferrer noopener" href="https://www.davidguida.net/event-sourcing-in-net-core-part-1-a-gentle-introduction/" target="_blank">Last time</a> we introduced the main idea and some of its benefits. This time we'll see how we can start storing events in our system.

As usual, I have prepared a small demo, modeled around the banking example I depicted in part 1. Sources are <a href="https://github.com/mizrael/SuperSafeBank" target="_blank" rel="noreferrer noopener">available here</a>.

Let's do a quick recap: we're trying to write a system that appends events to a log-like persistent storage using a CQRS approach. Query models are stored in a separate storage and built at regular intervals or every time an event occurs.

#### Events can be used for various reasons, like tracing the activity on the platform or rebuilding the state of the domain models at any specific point in time.

There are several options for storing events: we could use a big, massive table in a <a rel="noreferrer noopener" href="https://martendb.io/" target="_blank">SQL db</a>, a collection <a rel="noreferrer noopener" href="https://www.mongodb.com/blog/post/event-sourcing-with-mongodb" target="_blank">in NoSQL</a> or a specialized ad-hoc system. 

For this demo, I decided to go for the latter and give a chance to <a rel="noreferrer noopener" href="https://eventstore.com/" target="_blank">EventStore</a>. From its home page:

<blockquote class="wp-block-quote">
  <p>
    <strong>Event Store</strong> is an industrial-strength event sourcing database that stores your critical data in streams of immutable events.&nbsp;It was built from the ground up for event sourcing.
  </p>
</blockquote>

It has decent documentation, good community and was created by the legend <a rel="noreferrer noopener" target="_blank" href="https://github.com/gregoryyoung">Greg Young</a>. For those who don't know him, he coined the term "CQRS", I guess that's enough.

Now, in our example we had these requirements:

  1. create customers
  2. create accounts for the customers
  3. withdraw money from an account
  4. deposit money on an account

The first thing to do, as usual, is to start modeling our domain. For the first one, the <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Domain/Customer.cs" target="_blank">Customer class</a> encapsulates more or less all the responsibilities.

As you can see, the class inherits from a BaseAggregateRoot class, which is implementing this interface:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public interface IAggregateRoot&lt;out TKey> : IEntity&lt;TKey>
{
    public long Version { get; }
    IReadOnlyCollection&lt;IDomainEvent&lt;TKey>> Events { get; }
    void ClearEvents()    
}

public interface IEntity&lt;out TKey>
{
    TKey Id { get; }
}</pre>

We saw something similar in a previous post about the <a rel="noreferrer noopener" href="https://www.davidguida.net/improving-microservices-reliability-part-2-outbox-pattern/" target="_blank">Outbox Pattern</a>. The key difference here is that we're storing a Version along with the events. It will be handy on several occasions, especially when resolving conflicts during writes or when building the query models.

Creating a Customer is quite simple (code omitted for brevity):

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class CreateCustomerHandler : INotificationHandler&lt;CreateCustomer>
 {
        private readonly IEventsService&lt;Customer, Guid> _eventsService;

        public async Task Handle(CreateCustomer command, CancellationToken cancellationToken)
        {
            var customer = new Customer(command.Id, command.FirstName, command.LastName);
            await _eventsService.PersistAsync(customer);
        }
}</pre>

As you can see we're directly creating the Customer model and persisting it. The Command handler is not validating the command, this concern <a href="https://www.davidguida.net/cqrs-on-commands-and-validation/" target="_blank" rel="noreferrer noopener">has been extracted</a> and executed by another class.

The next step is to create an Account for this Customer:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class CreateAccountHandler : INotificationHandler&lt;CreateAccount>
{
        private readonly IEventsService&lt;Customer, Guid> _customerEventsService;
        private readonly IEventsService&lt;Account, Guid> _accountEventsService;

        public async Task Handle(CreateAccount command, CancellationToken cancellationToken)
        {
            var customer = await _customerEventsService.RehydrateAsync(command.CustomerId);
            if(null == customer)
                throw new ArgumentOutOfRangeException(nameof(CreateAccount.CustomerId), "invalid customer id");
          
            var account = new Account(command.AccountId, customer, command.Currency);
            await _accountEventsService.PersistAsync(account);
        }
}</pre>

Here we have to load (rehydrate) the Customer first. Of course we cannot (and **should not**) rely on the Queries persistence layer as it might be not in sync.

The <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Core/EventsService.cs" target="_blank">IEventsService implementation</a> of PersistAsync() has a quite important role: it will request our persistence layer ( Event Store ) to append the events for the aggregate **and** will publish its integration events. We'll talk more about this in the next article of the series.

The <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Persistence.EventStore/EventsRepository.cs" target="_blank">Events Repository</a> instead is responsible for **appending** events for an Aggregate root and **rehydrating it**. 

As you can see from the code, the append operation is opening a transaction, looping over the domain events and persisting them. 

Event Store is structured over the concept of "streams". Every aggregate is represented by a single stream, identified by the Aggregate type and key, for example "_Customer_540d1d96-3655-43a4-9078-3da7e7c5a3d2_" .

When rehydrating an entity, all we have to do is build the stream name given the key and the type and then fetch batches of events starting from the first one ever. 

Event Store also <a rel="noreferrer noopener" href="https://eventstore.com/docs/event-sourcing-basics/rolling-snapshots/index.html" target="_blank">supports snapshots</a>, basically&nbsp;"_a projection of the current state of an aggregate at a given point_". They can be used to improve the time taken to build the current state by preventing loading all the events from the beginning. I haven't implemented this technique in the demo yet, probably I'll add it in the next weeks.

Enough food for thought for today. <a href="https://www.davidguida.net/event-sourcing-in-net-core-part-3-broadcasting-events/" target="_blank" rel="noreferrer noopener">Next time: Kafka</a>!

<div class="post-details-footer-widgets">
</div>