---
description: >
  Let's see how we can have our Background Worker process more messages by leveraging the Producer/Consumer pattern with System.Threading.Channels.
id: 7055
title: 'Consuming message queues using .net core background workers – part 4: adding System.Threading.Channels'
date: 2020-02-14T03:00:00-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7055
permalink: /consuming-message-queues-using-net-core-background-workers-part-4-adding-system-threading-channels/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
dsq_thread_id:
  - "7870111048"
image: /assets/uploads/2020/02/streams-merging.jpg
categories:
  - .NET
  - ASP.NET
  - Design Patterns
  - Microservices
  - Programming
  - RabbitMQ
  - Software Architecture
tags:
  - design patterns
  - dotnetcore
  - microservices
  - programming
  - rabbitmq
---
Apparently I was not done yet with this Series! Few days ago I got a <a rel="noreferrer noopener" aria-label="comment on Part 3 (opens in a new tab)" href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-3-the-code-finally/#comment-4787052400" target="_blank">comment on Part 3</a>, asking how would I mix background workers with <a rel="noreferrer noopener" aria-label="System.Threading.Channels (opens in a new tab)" href="https://www.nuget.org/packages/System.Threading.Channels/" target="_blank">System.Threading.Channels</a> . 

That comment first led me to write <a rel="noreferrer noopener" aria-label="an introduction  (opens in a new tab)" href="https://www.davidguida.net/how-to-implement-producer-consumer-with-system-threading-channels/" target="_blank">an introduction </a>on the Channels library, which has been sitting on my ToDo list for too long. Then I finally took the time to update <a rel="noreferrer noopener" aria-label="the example repository (opens in a new tab)" href="https://github.com/mizrael/WebApiWithBackgroundWorker" target="_blank">the example repository</a> on GitHub with the new implementation.

From the Publisher perspective nothing has changed: it's still a simple .NET Core Console application. Once it's running, the user will be prompted to write a text message which will be sent to a RabbitMQ fanout exchange. 

On the Subscriber side instead I had to make some <a rel="noreferrer noopener" aria-label="interesting changes (opens in a new tab)" href="https://github.com/mizrael/WebApiWithBackgroundWorker/commit/552ac8e1a2adc811a7eaf2e6f6b78c65b94bb80a" target="_blank">interesting changes</a>.  
First of all, I added the Producer and Consumer classes. They're basically the same as my introductory article.

Now, since they're using async/await to handle the communication, I had to update the RabbitSubscriber class to use an <a rel="noreferrer noopener" aria-label="asynchronous consumer (opens in a new tab)" href="https://github.com/mizrael/WebApiWithBackgroundWorker/blame/552ac8e1a2adc811a7eaf2e6f6b78c65b94bb80a/WebApiWithBackgroundWorker.Subscriber/Messaging/RabbitSubscriber.cs#L55" target="_blank">asynchronous consumer</a> instead. 

Last but not least, the Background Worker is not adding the incoming messages directly to the repository anymore, but instead <a rel="noreferrer noopener" aria-label="publishes them (opens in a new tab)" href="https://github.com/mizrael/WebApiWithBackgroundWorker/blame/552ac8e1a2adc811a7eaf2e6f6b78c65b94bb80a/WebApiWithBackgroundWorker.Subscriber/Messaging/BackgroundSubscriberWorker.cs#L34" target="_blank">publishes them</a> on a Channel using the Producer.

A certain number of Consumers has been registered at bootstrap, the first available will pick up the message and store it in the repository. 

#### So why in the world would I do that?

Processing an incoming message can be a time consuming operation. If we can just pull it from the queue and handle it to a separate thread, wouldn't that free us to fetch more data? And that's exactly what we're doing.

Every Consumer will asynchronously process the messages, lifting the Background Worker from the responsibility of executing a potentially costly operation. In the demo we are simply adding messages to the repository but I think you got the point. 

It is not so different from adding multiple instances of the Web API, only that in this case we're now **also** able to process multiple messages concurrently in the same subscriber instance. 

#### Of course this is not a magic trick that solves all the performance problems of our applications. We might get even worse results or even increase the infrastructure costs because now we're consuming more memory and CPU.

As with almost everything else in our field, measuring and profiling are the keys to success.

<div class="post-details-footer-widgets">
</div>