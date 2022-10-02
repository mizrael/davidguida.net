---
description: >
  In this article we'll see how we can tell other parts of our system that something has happened by broacasting events using a distributed queue.
id: 7147
title: 'Event Sourcing in .NET Core &#8211; part 3: broadcasting events'
date: 2020-04-14T03:00:00-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7147
permalink: /event-sourcing-in-net-core-part-3-broadcasting-events/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
dsq_thread_id:
  - "7969433400"
image: /assets/uploads/2020/04/paperboy.jpg
categories:
  - .NET
  - Design Patterns
  - Kafka
  - Microservices
  - Programming
  - RabbitMQ
  - Software Architecture
tags:
  - design patterns
  - dotnetcore
  - event sourcing
  - Event Store
  - Kafka
  - message queues
  - programming
  - rabbitmq
  - software architecture
---
Hi all! Welcome to the third part of the series about **Event Sourcing**. This time we&#8217;ll see how we can tell other parts of our system that something has happened by **broadcasting the events**. And we will be doing this by pushing them to a distributed queue.

<a rel="noreferrer noopener" href="https://www.davidguida.net/event-sourcing-in-net-core-part-2-storing-events/" target="_blank">Last time</a> we discussed how we can leverage <a rel="noreferrer noopener" href="https://www.eventstore.com" target="_blank">EventStore</a> to keep track of the events for every <a rel="noreferrer noopener" href="https://www.davidguida.net/lets-do-some-ddd-with-entity-framework-core-3/" target="_blank">Aggregate Root</a> in a separate stream.

#### But that is only half of the story: once the events are persisted how can we query our data back?

Well, in order to query our data we first need to store it in a &#8220;query-friendly&#8221; way. We&#8217;ll get more into the details in the next article of this series.

Now, as we discussed before, one of the prerequisites of **Event Sourcing** is CQRS. And sooner or later, we&#8217;ll need to build the Query Models somehow. So we can leverage the <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation" target="_blank">Domain Events</a> for that, by pushing each one to a distributed queue.

Then all we have to do is write a Background Worker that subscribes to those events and reacts to them by refreshing our Queries DB.

If you haven&#8217;t <a href="https://github.com/mizrael/SuperSafeBank" target="_blank" rel="noreferrer noopener">pulled the code</a> of the small demo, this is the right time for it 🙂

The <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Persistence.Kafka/EventProducer.cs" target="_blank">EventProducer</a> class is responsible for pushing the events to a **Kafka** topic. We&#8217;ll be using a specific topic for each Aggregate Root type. In our example, we&#8217;ll have an `events_Customer` and an `events_Account` stream.

For the sake of completeness, we could have used two other strategies: either use a single topic for all the events or a topic for every single entity ever created by our system.

To be fair, the latter seems a bit unpractical: we will basically end up with an unbounded number of topics, which would make things like indexing and aggregating a lot more complicated. 

The former option is actually quite fine, as it also gives a nice way to keep track of **all** the events generated. It&#8217;s a matter of choice, I guess it could depend on the specific use-cases.

A note on Kafka now: as many of you know already, it is a high-performance, low-latency, scalable and durable log that is used by&nbsp;[thousands of companies](https://cwiki.apache.org/confluence/display/KAFKA/Powered+By)&nbsp;worldwide and is battle-tested at scale. It&#8217;s an excellent tool for implementing Event Sourcing.

We could have used **RabbitMQ**, but for Event Sourcing I think it&#8217;s better to keep most of the logic in Producers and Consumers, and not in the communication channels themselves. This is something that Martin Fowler describes as &#8220;<a rel="noreferrer noopener" href="https://martinfowler.com/articles/microservices.html#SmartEndpointsAndDumbPipes" target="_blank">smart endpoints and dumb pipes</a>&#8220;. Check it out.

Don&#8217;t get me wrong, RabbitMQ is an excellent tool, and its routing strategies are awesome. We <a href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-1-message-queues/" target="_blank" rel="noreferrer noopener">talked already </a>in the past about how to make good use of them. But performance-wise Kafka is able to provide a bigger throughput, which is always nice. This, of course, comes at the expense of increased complexity at the endpoints, but nothing we cannot handle. 

Now, the <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Persistence.Kafka/EventConsumer.cs" target="_blank">EventConsumer</a> class is responsible for consuming the events. We will have one consumer per Aggregate Root type, and all of them will belong to the same **Consumers Group**. 

Consumer Groups are a nice way to differentiate Consumers and broadcast the same message to different subscribers. By default, Kafka guarantees &#8220;at least&#8221; one safe delivery to a single consumer per group. 

This basically means that for example, we could have a Group for re-building our Query DB, another one for logging, another one for turning on the coffee machine and so on.

This covers the events broadcasting part. <a href="https://www.davidguida.net/event-sourcing-in-net-core-part-4-query-models/" target="_blank" rel="noreferrer noopener">Next time</a> we&#8217;ll see how we make proper use of those events to generate the Query Models.

<div class="post-details-footer-widgets">
</div>