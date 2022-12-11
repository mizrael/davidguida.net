---
description: >
  One of the key challenges in distributed systems is ensuring data consistency across multiple services. How do you ensure integration events are delivered properly?
id: 8030
title: 'Why would you send your messages twice?'
date: 2022-12-08T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8030
permalink: /why-would-you-send-messages-twice
image: /assets/uploads/2022/12/why-would-you-send-messages-twice.jpg
categories:  
  - Software architecture
  - Design patterns
---

Hi All! Today we're going to talk about at quite important topic: consistency, specifically in distributed systems.

As a software engineer, one of the key challenges we face when designing distributed systems is ensuring data consistency across multiple services. In an event-driven architecture, this often involves publishing and subscribing to messages and events.

However, it's important to avoid publishing the same message multiple times, as this can lead to inconsistencies and potentially even cause errors in your system.

Now, let's imagine that we have a service that needs to publish an event whenever a certain action occurs. Or dispatch a command to a specific microservice.
If we're not careful, we might accidentally publish the same event multiple times, which can lead to all sorts of problems. For example, if multiple services are subscribing to this event, they may end up processing the same data multiple times, which can cause errors and inconsistencies in your system.

Just to give you an idea, suppose you're adding a payment system to your e-commerce. Perhaps you're using an event-driven architecture and this Payment service is reacting to a `OrderPlaced` event. What would happen if the event is published twice?

To avoid potentially catastrophic issues, it's important to design your architecture in a way that ensures that each event is only published once. This can be done by using techniques such as idempotency, transaction management and the outbox pattern.
Let's take a look at them, one by one.

### Idempotency means that the same operation can be performed multiple times without changing the result.

In a distributed application, this can be useful when dealing with messages that we know already may be delivered multiple times. Networks are unreliable, it's a fact. So for example, if a message is published but the service that receives it is unable to process it for some reason (e.g. because it is down or experiencing high load), the message broker may retry delivering the message to the service.

Imagine that a customer places an order on the website, and the order is represented by a message that is sent to the order processing service. If the service is able to process the order, it will update the database to reflect the new order and send a confirmation message to the customer.

However, if the service is unable to process the order for some reason (e.g. because the database is down or the customer's payment details are invalid), the message broker may retry delivering the message to the service. If the service is designed to be idempotent, it can safely process the order, even if it has already been processed.

In our code we would do something like this:

```csharp
void Handle(PlaceOrder command) 
{  
  if (CheckOrderExists(command.OrderId)) 
    return;
  
  // Process the order...      
}
```

This is a simple example of course, there well are other mechanisms to ensure idempotency. For example, we could leverage a session id, a correlation id or other metadata attached to the message that would help us identifying whether it has been processed already or not.

### Transaction management can help to ensure that multiple operations are performed atomically.

This basically means that they are either performed in their entirety or not at all. This is useful in cases where the operations are interdependent, and the success or failure of one operation depends on the success or failure of another operation. Using a transaction that surrounds all the interactions with the DB, we can ensure that all operations are either performed completely or not at all.

Going back to our order processing example, we would have something like this:

```csharp
void Handle(PlaceOrder command) 
{  
  using(Transaction transaction = this.TransactionManger.Create())
  {
    try{
      if (CheckOrderExists(command.OrderId)) 
        return;
  
      // Process the order...      
      // send multiple write operations to the DB...
      
      transaction.Commit();
    }catch{
      transaction.Rollback();
      throw;
    }
  }
}
```

The code gets a bit more complicated, but this way we can ensure that there won't be any inconsistencies or errors from partially committed operations.

The last tecnique for today is the Outbox Pattern. We discussed about it <a href='/improving-microservices-reliability-part-2-outbox-pattern/' target='_blank'>already</a>, so I won't spend much time on it. 

### In a nutshell, it involves storing the outgoing messages in a table, using the same transaction we use to update our system.

 A background process will later on pull all the pending messages from that table and send them to the broker.

 Thanks for reading!