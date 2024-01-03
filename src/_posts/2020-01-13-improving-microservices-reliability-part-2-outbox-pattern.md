---
description: >  
  The Outbox Pattern helps us dealing with distributed transactions and event dispatching. Sample code in C# .NET Core
id: 6958
title: 'Improving microservices reliability - part 2: Outbox Pattern'
date: 2020-01-13T09:00:00-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6958
permalink: /improving-microservices-reliability-part-2-outbox-pattern/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/01/postman.jpg
categories:
  - Design Patterns
  - Microservices
  - Programming
  - RabbitMQ
  - Software Architecture
tags:
  - design patterns
  - nservicebus
  - programming
  - rabbitmq
  - software architecture
---
Welcome back to the second part of the Series. Today we'll talk about the **Outbox Pattern**. 

Just to recap, <a href="https://www.davidguida.net/improving-microservices-reliability-part-1-two-phase-commit/" target="_blank" rel="noreferrer noopener" aria-label="last time (opens in a new tab)">last time</a> we discussed how the **2-Phase-Commit** technique can help us with distributed transactions. However, it may lead to unwanted side effects and performance issues.

So is there any other approach we could take? Personally I'm a great fan of persisting the state as much as possible, may it be the full Domain Entity or a stream of Events.

And here it comes the **Outbox Pattern**! 

Let's go back to our eCommerce example. We want to save an order and roughly at the same time send an email to the customer. I said "roughly" because we don't really need these operations to occur at the same time. Moreover, there might even be other actions but let's stick with one for now. 

#### The problem is that since <a rel="noreferrer noopener" aria-label="by definition (opens in a new tab)" href="https://martinfowler.com/articles/microservices.html" target="_blank">by definition</a> every microservice has its own persistence mechanism, it's quite impossible to have a distributed transaction spanning all the services.

The Order might be saved but messages might not be dispatched due to a network issue. Or we might get messages but no order stored in the db because we ran out of space. Whatever.

So what do we do?

With 2PC we use a Coordinator and a bunch of messages to ensure the flow is correctly executed.

With the **Outbox** instead the flow is much simpler:

  1. the Order service receives the command to store the new Order
  2. a **local** transaction is opened
      * the Order is persisted
      * an "order saved" event is serialized and stored into a generic Outbox table (or collection or whatever you're using, doesn't matter)
  3. the local transaction gets committed

At this point we've ensured that our **local** state is persisted so any potential subsequent query should be able to return fresh data (assuming caching is not an issue).

Now all we have to do is inform our subscribers and we can do this by using an offline worker: at regular intervals it will fetch a batch of records from the Outbox and publish them as messages on a queue, like RabbitMQ or Kafka.

This pattern ensures that each message is processed **at least once**. What does this mean? That we get guaranteed delivery, but it may occur more than once. This also mean that we have to be extremely careful ensuring that our messages are <a href="https://www.enterpriseintegrationpatterns.com/patterns/messaging/IdempotentReceiver.html" target="_blank" rel="noreferrer noopener" aria-label="idempotent (opens in a new tab)">idempotent</a>. 

Since we don't want of course to reinvent the wheel, an option could be using a third-party tool like <a rel="noreferrer noopener" aria-label="NServiceBus (opens in a new tab)" href="https://docs.particular.net/nservicebus/outbox/" target="_blank">NServiceBus</a>, which can help us handling Sagas and complex scenarios hiding all the noise of the boilerplate code.

That's all for today. <a href="/improving-microservices-reliability-part-3-outbox-pattern-in-action/" target="_blank">Next time</a> we'll see the pattern in action in a small C# .NET Core application.

<div class="post-details-footer-widgets">
</div>