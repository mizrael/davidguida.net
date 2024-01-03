---
description: >  
  Hi All! In this first article of the series, we'll start talking about how OpenSleigh deals with Saga state persistence and message handling.
id: 7946
title: 'OpenSleigh: tackling state persistence, part 1'
date: 2021-01-16T21:02:17-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7946
permalink: /opensleigh-tackling-state-persistence-part-1/
image: /assets/uploads/2021/01/persistence.jpg
categories:
  - Design Patterns
  - Microservices
  - OpenSleigh
  - Software Architecture
tags:
  - .NET Core
  - message queues
  - microservices
  - OpenSleigh
---
Hi All! Here we go with another article about **<a href="https://github.com/mizrael/OpenSleigh" target="_blank" rel="noreferrer noopener">OpenSleigh</a>**. Today we&#8217;re going a bit deeper into the rabbit hole and see how it is dealing with state persistency.

<a href="https://www.davidguida.net/opensleigh-a-saga-management-library-for-net-core/" target="_blank" rel="noreferrer noopener">The last time</a> we introduced the library, discussed a bit about what the Saga pattern is and what&#8217;s the general idea behind Orchestration and Choreography.

Now. Sagas are all about messages. Commands get issued and events get published. At the same time though, we have to make sure that changes to the internal state of the Saga are being persisted safely. Also, we want outgoing messages to be dispatched only when the local state is saved. 

#### In an ideal world, we wouldn&#8217;t have to worry about this, but unfortunately, we have to deal with a bunch of nasty stuff like concurrency and horizontal scalability.

For example, let&#8217;s suppose that our application is composed of 2 services: a Web API and a background worker service. Let&#8217;s call them &#8220;_Orders API_&#8221; and &#8220;_Orders processor_&#8220;, that should help you get the picture.

The Web API is responsible for receiving client requests, packing them into nice messages, and pushing them to a service bus. The worker subscribes to those messages and uses **OpenSleigh** to handle Saga execution.

This is a pretty nice and standard way of handling long-running operations asynchronously. Works pretty well and, most importantly, **scales pretty well.**

But what happens if we have more instances of the worker help handling the load? Suppose for a moment that the _Orders API_ pushes a _ProcessOrder ****_command for the same order &#8220;123&#8221; twice. It had a hiccup, a network glitch. Sh*t happens.

Now, this _quite unfortunate_ event means that the same order will probably be processed twice. Moreover, if we have more worker instances, it might happen that both the messages will be dispatched and processed _concurrently_.

How does **OpenSleigh** handle these situations?

First of all, we can assume that the _ProcessOrder_ command starts the _ProcessOrderSaga_. Each **OpenSleigh** Saga has a configurable unique ID, which is used also as _<a href="https://www.enterpriseintegrationpatterns.com/patterns/messaging/CorrelationIdentifier.html" target="_blank" rel="noreferrer noopener">correlation ID</a>_. In this case, I think it&#8217;s safe to use the Order ID to populate this value.

When the _Orders processor_ service receives a message, **OpenSleigh** will extract the correlation id and use it to fetch the right Saga state from the persistence storage. 

If no existing Saga State is available, we check if that message is capable of starting a new Saga. If so, we&#8217;ll get a shiny new instance and we can finally get down to business.

That&#8217;s all for today. [The next time](https://www.davidguida.net/opensleigh-tackling-state-persistence-part-2/) we&#8217;ll continue analyzing the flow and we&#8217;ll see some code. Ciao!

<div class="post-details-footer-widgets">
</div>