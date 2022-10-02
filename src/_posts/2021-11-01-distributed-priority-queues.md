---
id: 8017
title: Distributed Priority Queues
description: >
  In this article, we'll see how to apply throttling to different parts of our system based on external factors using Priority Queues
date: 2021-11-01T00:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8017
permalink: /distributed-priority-queues/
image: /assets/uploads/2021/11/distributed-priority-queues.jpg
tags:
  - Cloud
  - Azure
  - Kafka
  - RabbitMQ
  - Azure Service Bus
  - Messaging
  - Design Patterns
  - Software Architecture
---

Hi All! Today I'd like to talk about a very interesting **design pattern**: Priority Queues. The name is not exactly saying much so let me give you some example scenarios first.

Suppose you are designing an application with a freemium model. You have (hopefully) paying and non-paying customers. Now, being the greedy software engineers we are, we of course love *all* our customers, but a little bit more the paying ones. So we want these to have a far better experience on our system than all the other freeloaders.
How do we manage that?

Or here's another example: your system has a backend API and a front-end. On the client, users can decide to execute operations singularly or in bulk. Maybe it's a data import: they can either insert all the data manually or decide to import an Excel sheet with thousands of records. Now, manual insert would result in an immediate result. Bulk insert would be of course slower, we can process it on the background and send a notification to the user later on.
We don't want to write the import API twice, so we design it so that it accepts multiple rows at the same time, making it suited for bulk import immediately.

One quick solution would be to have our client invoking the import API directly when it's a manual import, and send the Excel file to a queue in the other case.
Yep, that would totally work. 

### But what if we want a unified solution? (Yep I know, probably I stretched this one a little, but bear with me)

So let's see what are our requirements here:
- we have different services with different priorities
- work is likely to be performed on a background worker
- no need to keep track of message order

### A clean and somewhat easy solution is to use a Message Queue that allows setting a **priority** on each entry. Higher priority messages will automatically bubble up to the top and being consumed first. 
Think of it like some kind of <a href='https://en.wikipedia.org/wiki/Heap_(data_structure)' target='_blank'>Min/Max Heap</a>, basically.

This approach will guarantee that no matter when a message is enqueued, it'll always be processed based on its priority, not the insertion time. And this also leads us to its biggest weakness: what if we have a burst of high-priority messages? The low priority ones will always be dragged down to the end of the queue, and will potentially be processed after *a lot* of time. **If** they get processed at all. 

Also, if we want to talk about specific technologies, both Kafka and Azure Service Bus don't have support for Priority Queues, only RabbitMQ <a href='https://www.rabbitmq.com/priority.html' target='_blank'>has it</a>. So how do you implement this if you're on the first two?
Simple: you add more buckets!

### Add one queue per "priority" type. Using our first example, we would have one queue for paying customers and another one for the non-paying ones. High-priority queues get more consumers and/or more powerful machines. 

This would guarantee that each message will always be processed, regardless it's priority. Just...some of them will be processed *faster* :) .
