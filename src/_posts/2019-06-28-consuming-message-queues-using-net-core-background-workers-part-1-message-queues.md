---
description: >
  In this series we'll talk a bit about message queues with RabbitMQ and how to integrate it in a C# WebAPI application using Background Workers.
id: 6711
title: 'Consuming message queues using .net core background workers - part 1: message queues'
date: 2019-06-28T13:19:27-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6711
permalink: /consuming-message-queues-using-net-core-background-workers-part-1-message-queues/
image: /assets/uploads/2019/06/ducks_queue.jpg
categories:
  - .NET
  - Design Patterns
  - Microservices
  - Programming
  - RabbitMQ
  - Software Architecture
tags:
  - design patterns
  - software architecture
---
In this series we'll talk a bit about message queues with <a rel="noreferrer noopener" aria-label="RabbitMQ  (opens in a new tab)" href="https://www.rabbitmq.com/" target="_blank">RabbitMQ </a>and how to integrate it in a C# WebAPI application using Background Workers. 

It's hard sometimes to come up with a decent title. In this case I had to sit back and take some time to decide. I had a semi-clear idea of what this article was about, but picking the title is a different beast. 

So today we're going to talk about message queues and background workers. Why should I use a message queue? What's a background worker? Why should I mix them? Give me some time and I'll walk you through.

#### Let's start with message queues first. 

Suppose you have an operation that doesn't require manual intervention, maybe needs some orchestration between multiple services and might also take some time. The classic example you'll find online is confirming an order on a e-commerce.

The usual steps involved would be:

  1. create an Order and set it to pending
  2. check the inventory and lock the line items
  3. check the Customer credit 
  4. transfer the money
  5. update the Order status to shipping
  6. handle shipping
  7. update the Order status to fulfilled

Of course this list might vary according to the business case. And I haven't included any kind of notification to customers or admins. But I think you got the point: **this stuff is complex** and needs to be planned very carefully.

Moreover: why should we keep the customer waiting on the UI for the entire operation? This workflow can be completed offline, asynchronously. No need to keep the user hanging in front of the monitor, waiting for a confirmation (and potentially an email).

Enter message queues: complex logic can be handled in a separate process, including orchestration between multiple services, each owning a different <a href="https://www.davidguida.net/the-importance-of-setting-the-boundaries-of-your-domain-models/" target="_blank" rel="noreferrer noopener" aria-label="bounded context (opens in a new tab)">bounded context</a>.

Message queues allow different parts of a system to communicate and process operations asynchronously. This way we can split the operation, decouple the services and get independent scaling.

Messages are stored on the queue until they are processed and deleted. Each message is processed only once, by a single consumer. Or we can configure the system to broadcast the message to multiple consumers. Think of a Chat service: someone sends a cat picture to a group and all its users will receive it.

Using message queues we can handle traffic spikes by adding more consumers and process the messages in <a href="https://www.davidguida.net/serial-vs-parallel-task-execution/" target="_blank" rel="noreferrer noopener" aria-label="parallel (opens in a new tab)">parallel</a>, scaling horizontally. Things might be a little different if you care about the **order** of the messages, but that's a story for another article.

See you <a href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-2-background-workers/" target="_blank" rel="noreferrer noopener" aria-label="next time (opens in a new tab)">next time</a>!

<div class="post-details-footer-widgets">
</div>