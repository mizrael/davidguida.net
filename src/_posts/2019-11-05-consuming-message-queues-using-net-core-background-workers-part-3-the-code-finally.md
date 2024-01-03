---
description: >
  This time we're going to take a look at the code and see how a microservice can consume messages from a queue using a background worker.
id: 6899
title: 'Consuming message queues using .net core background workers &#8211; part 3: the code, finally'
date: 2019-11-05T14:57:24-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6899
permalink: /consuming-message-queues-using-net-core-background-workers-part-3-the-code-finally/
dsq_thread_id:
  - "7706057168"
image: /assets/uploads/2019/07/construction-worker-silhouette-work-background_43605-1096.jpg
categories:
  - .NET
  - ASP.NET
  - Microservices
  - Programming
  - RabbitMQ
  - Software Architecture
tags:
  - design patterns
  - dotnetcore
  - microservices
  - programming
---
And here we go with the another part of this Series! This time we&#8217;re going to take a look at the code and see how a microservice can consume messages from a queue using a background worker.

<a rel="noreferrer noopener" aria-label="Last time (opens in a new tab)" href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-2-background-workers/" target="_blank">Last time</a> I introduced **Background Workers** and some possible use cases. The possibilities are limitless and today we&#8217;re going to see how we can integrate this idea in a microservice.

As usual, all the code is <a rel="noreferrer noopener" aria-label=" available on GitHub (opens in a new tab)" href="https://github.com/mizrael/WebApiWithBackgroundWorker" target="_blank">available on GitHub</a>, so feel free to take a look.

We can find 3 projects in the solution:

  1. **WebApiWithBackgroundWorker.Common** contains the common code to open a persistent connection (more on this later) and the <a rel="noreferrer noopener" aria-label="Message  (opens in a new tab)" href="https://github.com/mizrael/WebApiWithBackgroundWorker/blob/master/WebApiWithBackgroundWorker.Common/Messaging/Message.cs" target="_blank">Message </a>class. This one is just a simple DTO shared between the publisher and the subscriber and represents the &#8220;contract&#8221; of what will be sent over the network.
  2. **WebApiWithBackgroundWorker.Publisher** is the message producer. It opens a connection to RabbitMQ and sends messages.
  3. **WebApiWithBackgroundWorker.Subscriber** is our subscribing microservice. It hosts the background worker and exposes a single endpoint to display all the received messages.

Let&#8217;s get into the details now.

The [RabbitPersistentConnection](https://github.com/mizrael/WebApiWithBackgroundWorker/blob/master/WebApiWithBackgroundWorker.Common/Messaging/RabbitPersistentConnection.cs) class is responsible of holding our TCP connection to RabbitMQ and generating channels. It <a rel="noreferrer noopener" aria-label="is recommended (opens in a new tab)" href="https://www.cloudamqp.com/blog/2017-12-29-part1-rabbitmq-best-practice.html#connections-and-channels" target="_blank">is recommended</a> to have a single connection per application and multiple channels, one per thread. Channels are not thread-safe, so sharing them is not a great idea.

Once a connection is acquired, we register to the **ConnectionShutdown**, **CallbackException** and **ConnectionBlocked** events and try to connect again if something bad occurs.

#### Beware that this is just example code: I have left out some security checks and exception handling so don&#8217;t use this on production.

The [RabbitPublisher](https://github.com/mizrael/WebApiWithBackgroundWorker/blob/master/WebApiWithBackgroundWorker.Publisher/RabbitPublisher.cs) class is the core of the Publisher project. Nothing particular fancy here: it gets a channel from the connection and uses it to send messages to an exchange. We&#8217;re using a <a rel="noreferrer noopener" aria-label=" (opens in a new tab)" href="https://www.rabbitmq.com/tutorials/amqp-concepts.html#exchange-fanout" target="_blank">Fanout Exchange</a> in this example so all the subscribers will receive the messages, discarding the routing key.

Let&#8217;s dig into the subscriber now.

The microservice exposes a single GET endpoint, /**messages** , that returns a list of all the received messages. The <a rel="noreferrer noopener" aria-label="API Controller (opens in a new tab)" href="https://github.com/mizrael/WebApiWithBackgroundWorker/blob/master/WebApiWithBackgroundWorker.Subscriber/Controllers/MessagesController.cs" target="_blank">API Controller</a> has a single dependency on the Message Repository. Easy-peasy.

For the sake of the example, the persistence is handled in-memory.

The same repository is also used by our [BackgroundSubscriberWorker](https://github.com/mizrael/WebApiWithBackgroundWorker/blob/master/WebApiWithBackgroundWorker.Subscriber/Messaging/BackgroundSubscriberWorker.cs). This one is registered in the ConfigureServices() method of the Startup class with this call:

<pre class="wp-block-preformatted">services.AddHostedService&lt;BackgroundSubscriberWorker&gt;();</pre>

That&#8217;s all we need to host a background worker. Well actually that&#8217;s not entirely true: as you may have noticed, the worker class inherits from BackgroundService which helps us encapsulating the logic and handling the lifetime. There&#8217;s a good article on <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-3.0&tabs=visual-studio" target="_blank" rel="noreferrer noopener" aria-label=" (opens in a new tab)">the Microsoft website</a>, make sure to check it out.

Our worker class is responsible of starting the <a rel="noreferrer noopener" aria-label="RabbitSubscriber (opens in a new tab)" href="https://github.com/mizrael/WebApiWithBackgroundWorker/blob/master/WebApiWithBackgroundWorker.Subscriber/Messaging/RabbitSubscriber.cs" target="_blank">RabbitSubscriber</a> and listening to incoming messages. When one arrives, it calls the Add() method on the repository and that&#8217;s it.

As you may have noticed, the connection string is missing from the projects. I am using <a href="https://www.cloudamqp.com/" target="_blank" rel="noreferrer noopener" aria-label="CloudAMQP  (opens in a new tab)">CloudAMQP </a>to host RabbitMQ, they have a nice free tier, extremely useful for experiments like this one.

It took me a little bit more than expected to write this last article, I got distracted by other topics and also by everything else is happening to me these weeks. I&#8217;m about to move to Canada, packing an entire house is never easy.

In <a href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-4-adding-system-threading-channels/" target="_blank" rel="noreferrer noopener" aria-label="the next article (opens in a new tab)">the next article</a> we&#8217;ll see how it&#8217;s possible to process multiple messages concurrently using the System.Threading.Channels library.  
  
Don&#8217;t miss <a rel="noreferrer noopener" aria-label="Part 1 (opens in a new tab)" href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-1-message-queues/" target="_blank">Part 1</a> and <a rel="noreferrer noopener" aria-label="Part 2 (opens in a new tab)" href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-2-background-workers/" target="_blank">Part 2</a>!

  


<div class="post-details-footer-widgets">
</div>