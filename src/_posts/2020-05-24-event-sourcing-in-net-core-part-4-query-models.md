---
description: >
  Hi All! Welcome to the fourth part of the series about Event Sourcing. This time we'll see how we can leverage the events to refresh our Query Models.
id: 7252
title: 'Event Sourcing in .NET Core - part 4: query models'
date: 2020-05-24T14:43:17-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7252
permalink: /event-sourcing-in-net-core-part-4-query-models/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/05/event-sourcing-query-models.jpg
categories:
  - .NET
  - ASP.NET
  - Design Patterns
  - Kafka
  - Microservices
  - MongoDB
  - Software Architecture
tags:
  - .NET Core
  - event sourcing
  - Event Store
  - Kafka
  - MediatR
  - message queues
  - microservices
  - MongoDB
  - Polly
---
Hi All! Welcome to the fourth part of the series about **Event Sourcing**. This time we'll see how we can leverage the events to refresh our **Query Models.**

The <a rel="noreferrer noopener" href="https://www.davidguida.net/event-sourcing-in-net-core-part-3-broadcasting-events/" target="_blank">last time</a> we saw how we can make use of a **message queue** to publish domain events to other interested parties.

As I mentioned last time, one of the prerequisites of Event Sourcing is CQRS. The **Query** part needs a way to be up to date with the **Command** side. We can (somewhat) easily accomplish this by subscribing to the events generated and reconstruct our models.

#### One nice thing is that our **Query Models** can be in whatever form our services need them. We can also have multiple representations of the same entity, based on the context. 

For example, we could have a Query Model representing the archive of Customers, exposing only name and email, and another collection holding instead the full details ( number of orders, quotes, comments, whatever).

In the sample code I wrote for this series, I'm using MongoDB as persistence storage to hold the Query Models. A NoSQL DB is often a good choice for this kind of operation: data is denormalized and stored in the exact form we need and there's no need for expensive joins of any sort. All the necessary logic to handle the relationship is executed once during the (re-)generation of the document.

As I mentioned last time, a Background Worker is listening for events on a Kafka topic. Once an event is received, will be deserialized and passed to an instance of <a rel="noreferrer noopener" href="https://github.com/jbogard/MediatR" target="_blank">MediatR</a>, which will take care of finding the right handler.

The <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Persistence.Kafka/EventConsumer.cs" target="_blank">EventConsumer</a> class exposes an _EventReceived_ event handler we can register to perform this logic. Something like this:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">async Task onEventReceived(object s, IDomainEvent&lt;TK> e) {
  var @event = EventReceivedFactory.Create((dynamic)e);
   using var scope = scopeFactory.CreateScope();
   var mediator = scope.ServiceProvider.GetRequiredService&lt;IMediator>();
  await mediator.Publish(@event, CancellationToken.None);
}
consumer.EventReceived += onEventReceived;</pre>

In our case we have a bunch of registered handlers, to refresh the state of the <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Web.API/EventHandlers/CustomersArchiveHandler.cs" target="_blank">Customers archive</a>, <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Web.API/EventHandlers/CustomersArchiveHandler.cs" target="_blank">their details,</a> and <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Web.API/EventHandlers/AccountEventsHandler.cs" target="_blank">their Accounts</a>.

For example, this is the code for rebuilding the Customer Details:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public async Task Handle(EventReceived&lt;CustomerCreated> @event, CancellationToken cancellationToken)
        {
            var filter = Builders&lt;CustomerDetails>.Filter
                .Eq(a => a.Id, @event.Event.AggregateId);

            var update = Builders&lt;CustomerDetails>.Update
                .Set(a => a.Id, @event.Event.AggregateId)
                .Set(a => a.Version, @event.Event.AggregateVersion)
                .Set(a => a.Firstname, @event.Event.Firstname)
                .Set(a => a.Lastname, @event.Event.Lastname)
                .Set(a => a.TotalBalance, new Money(Currency.CanadianDollar, 0));

            await _db.CustomersDetails.UpdateOneAsync(filter,
                cancellationToken: cancellationToken,
                update: update,
                options: new UpdateOptions() { IsUpsert = true });
        }</pre>

As you can see I'm using _<a rel="noreferrer noopener" href="https://docs.mongodb.com/manual/reference/method/db.collection.update/#update-upsert" target="_blank">UpdateOneAsync</a>_() on the _CustomersDetails ****_collection. It's an <a href="https://en.wiktionary.org/wiki/upsert" target="_blank" rel="noreferrer noopener">upsert operation</a>: this way the DB will atomically create the document or replace its values.

Event Sourcing is an extremely interesting architectural pattern, and can lead to excellent results when implemented properly. 

#### It comes with a huge cost in terms of code complexity and it also requires a lot of discipline from the dev team.

Just to give an example, since the system becomes "<a rel="noreferrer noopener" href="https://en.wikipedia.org/wiki/Eventual_consistency" target="_blank">eventually consistent</a>", we might incur in situations where the event for creating an Account is picked up **before** the Customer's creation.

Let's take a look at the AccountCreated event handler:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public async Task Handle(EventReceived&lt;AccountCreated> @event, CancellationToken cancellationToken)
        {
            var customerFilter = Builders&lt;CustomerArchiveItem>.Filter
                .Eq(a => a.Id, @event.Event.OwnerId);

            var customer = await (await _db.Customers.FindAsync(customerFilter, null, cancellationToken))
                .FirstOrDefaultAsync(cancellationToken);
            if (null == customer) 
            {
                var msg = $"unable to find customer by id {@event.Event.OwnerId}";
                _logger.LogWarning(msg);
                throw new ArgumentOutOfRangeException(nameof(@event.Event.OwnerId), msg);
            }

            var filter = Builders&lt;AccountDetails>.Filter
                .Eq(a => a.Id, @event.Event.AggregateId);

            var update = Builders&lt;AccountDetails>.Update
                .Set(a => a.Id, @event.Event.AggregateId)
                .Set(a => a.Version, @event.Event.AggregateVersion)
                .Set(a => a.OwnerFirstName, customer.Firstname)
                .Set(a => a.OwnerLastName, customer.Lastname)
                .Set(a => a.OwnerId, @event.Event.OwnerId)
                .Set(a => a.Balance, new Money(@event.Event.Currency, 0));

            await _db.AccountsDetails.UpdateOneAsync(filter,
                cancellationToken: cancellationToken,
                update: update, 
                options: new UpdateOptions() { IsUpsert = true});
        }</pre>

As you can see, the first thing it does is looking up for the account owner details. If that document is not (yet) in the system then we get an exception.

We might also decide to silently log and just exit the handler. It highly depends on the general context.

An approach to handle this kind of situation is instead to use a retry mechanism, something we can implement quite easily with a <a href="https://github.com/App-vNext/Polly" target="_blank" rel="noreferrer noopener">Polly Policy</a> inside a <a href="https://www.davidguida.net/using-decorators-to-handle-cross-cutting-concerns/" target="_blank" rel="noreferrer noopener">Decorator</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class RetryDecorator&lt;TNotification> : MediatR.INotificationHandler&lt;TNotification>
        where TNotification : MediatR.INotification
    {
        private readonly INotificationHandler&lt;TNotification> _inner;
        private readonly Polly.IAsyncPolicy _retryPolicy;

        public RetryDecorator(MediatR.INotificationHandler&lt;TNotification> inner)
        {
            _inner = inner;
            _retryPolicy = Polly.Policy.Handle&lt;ArgumentOutOfRangeException>()
                .WaitAndRetryAsync(3,
                    i => TimeSpan.FromSeconds(i));
        }

        public Task Handle(TNotification notification, CancellationToken cancellationToken)
        {
            return _retryPolicy.ExecuteAsync(() => _inner.Handle(notification, cancellationToken));
        }
    }</pre>

<del>This was the last article of the series</del>. <a href="https://www.davidguida.net/event-sourcing-in-net-core-part-5-offline-consumers/" target="_blank" rel="noreferrer noopener">Next time</a> we'll see what is an offline consumer and why we all need one. Make sure you're not missing <a rel="noreferrer noopener" href="https://www.davidguida.net/event-sourcing-in-net-core-part-1-a-gentle-introduction/" target="_blank">part 1</a>, <a rel="noreferrer noopener" href="https://www.davidguida.net/event-sourcing-in-net-core-part-2-storing-events/" target="_blank">part 2</a>, and <a rel="noreferrer noopener" href="https://www.davidguida.net/event-sourcing-in-net-core-part-3-broadcasting-events/" target="_blank">part 3</a> !. 

<div class="post-details-footer-widgets">
</div>