---
description: >
  Here's the fourth part of the Event Sourcing on Azure series. We'll see how we can send Integration events every time something changes.
id: 7856
title: 'Event Sourcing on Azure - part 4: Integration events'
date: 2020-11-23T12:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7856
permalink: /event-sourcing-on-azure-part-4-integration-events/
dsq_thread_id:
  - "8288249836"
image: /assets/uploads/2020/11/azure-integration-events.jpg
categories:
  - .NET
  - ASP.NET
  - Azure
  - Design Patterns
  - Microservices
  - Software Architecture
tags:
  - Azure
  - DDD
  - design patterns
  - software architecture
---
Hi All! Welcome back for the fourth part of the **Event Sourcing on Azure** series. Today we'll see how we can send Integration events every time something changes.

<a href="https://www.davidguida.net/event-sourcing-on-azure-part-3-command-validation/" target="_blank" rel="noreferrer noopener">Last time</a> we saw how to validate the Commands and make sure our Aggregates receive the right data. Of course, this validation doesn't save us from _all_ the inconveniences, but it's the necessary frontline. 

#### <a href="https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-model-layer-validations?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Invariants</a> should always be true to avoid leaving Aggregates in an invalid state.

Now, once we've updated or created an Aggregate, how do we make its data available to the outside world?

We won't be exposing its the internal representation, that data is meant to be private. What we want instead, is to build specific Query models that will be exposed by the various GET endpoints of our microservice (or whatever will be our transport protocol at the boundaries).

We want to decouple as much as possible the Writes from the Reads, and at the same time avoid any possible complication when persisting the Domain Events for each Aggregate. 

So, here's our shopping list when we process a new command:

  1. validation
  2. store the Domain events
  3. for each Domain Event send an Integration event 

Let's now take a look at the <a href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Domain/Commands/CreateCustomer.cs" target="_blank" rel="noreferrer noopener">CreateCustomer </a>Command handler:

```csharp
public class CreateCustomerHandler : INotificationHandler<CreateCustomer>
{
	private readonly IEventsService<Customer, Guid> _eventsService;
	private readonly ICustomerEmailsService _customerEmailsRepository;

	public async Task Handle(CreateCustomer command, CancellationToken cancellationToken)
	{
		if (await _customerEmailsRepository.ExistsAsync(command.Email)){
			var error = new ValidationError(nameof(CreateCustomer.Email), $"email '{command.Email}' already exists");
			throw new ValidationException("Unable to create Customer", error);
		}

		var customer = new Customer(command.Id, command.FirstName, command.LastName, command.Email);
		await _eventsService.PersistAsync(customer);
		await _customerEmailsRepository.CreateAsync(command.Email, command.Id);
	}
}
```

The key here lies in that call to the Events Service: it will take care of appending the Domain Event to Aggregate's Event' stream **_and_** publish an Integration Event. The code is actually pretty simple:

```csharp
public class EventsService<TA, TKey> : IEventsService<TA, TKey> where TA : class, IAggregateRoot<TKey>
{
  public async Task PersistAsync(TA aggregateRoot)
  {
    if (!aggregateRoot.Events.Any())
      return;

    await _eventsRepository.AppendAsync(aggregateRoot);
    await _eventProducer.DispatchAsync(aggregateRoot);
    
    aggregateRoot.ClearEvents();
  }
}
```

As you can see, at the end we also take care of clearing the events from the Aggregate. We don't want stuff being processed more than necessary, don't we? That of course is not enough, as we might incur into nasty issues like messages being dispatched/received multiple times and so on. But at least is a start. 

Now let's talk about dispatching the Domain Events. 
### When we _transform_ them to Integration Events, we need to make sure each one contains the bare minimum information for the subscribers to do whatever they have to.

This means putting **at least** the Aggregate Id and the Event type. Since we're nice people, we'll be also using the Aggregate Id as Correlation id. Our future self will thank us later when scrubbing countless log entries.

When we're done with the mapping, we'll send in bulk these messages to a Service Bus Topic. This way anyone interested can subscribe only to the Topics she needs.

```csharp
public class EventProducer<TA, TKey> : IEventProducer<TA, TKey> where TA : IAggregateRoot<TKey>
{
  public async Task DispatchAsync(TA aggregateRoot)
  {
    var messages = aggregateRoot.Events.Select(@event => {
      var eventType = @event.GetType();
      var serialized = _eventSerializer.Serialize(@event);

      var message = new Message(serialized){
        CorrelationId = aggregateRoot.Id.ToString(),
        UserProperties =
        {
          {"aggregate", aggregateRoot.Id.ToString()},
          {"type", eventType.AssemblyQualifiedName}
        }
      };
      return message;
    }).ToList();

    await _topicClient.SendAsync(messages);
  }
}
```

That's all for today. The <a href="/event-sourcing-on-azure-part-5-consuming-events/" target='_blank'>next time</a> we'll see how to subscribe to those events and react to them.

Ciao!