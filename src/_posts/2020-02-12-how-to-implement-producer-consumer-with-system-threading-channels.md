---
description: >
  In this article we'll discover what Producer/Consumer means and how we can leverage the .NET Core library System.Threading.Channels to implement it.
id: 7034
title: How to implement Producer/Consumer with System.Threading.Channels
date: 2020-02-12T03:15:00-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7034
permalink: /how-to-implement-producer-consumer-with-system-threading-channels/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/02/streams-merging.jpg
categories:
  - .NET
  - Design Patterns
  - Programming
tags:
  - design patterns
  - dotnetcore
  - programming
---
What's this "**Producer/Consumer**" thing? It's around us, everywhere. Every time you see some kind of workflow with multiple serial steps, that's an example. A production line in a car factory, a fast-food kitchen, even the postal service.

So why do we care about it? Well that's easy: in almost every piece of software we write there's a pipeline to fulfill. And as every pipeline, once a step is completed the output is redirected to the next one in line, freeing up space for another execution.

#### This basically means that every step in the chain has to be executed in total isolation, receiving data, processing it and handing it over to the next block.

As a consequence, every block should execute in its own Thread, to ensure the proper encapsulation. Of course there's a whole world to consider, including all the concurrency problems that might arise with sharing data across Threads.

This is exactly where the **<a rel="noreferrer noopener" aria-label="System.Threading.Channels (opens in a new tab)" href="https://www.nuget.org/packages/System.Threading.Channels/" target="_blank">System.Threading.Channels</a>** library comes to the rescue. But what's a "Channel" exactly? It's a means to an end. 

#### A **Channel** is a way to safely exchange data between two parties (the Producer and the Consumer), allowing at the same time notifications and ensuring thread-safety.

It's basically a thread-safe queue. 

Now, a Channel can be bounded or unbounded:

**Bounded Channels** have a finite capacity for incoming messages, meaning that a Producer can publish only a specific amount of times before fulfilling the space. Then it will have to wait for the Consumers to execute their work and free up some space for new messages.

**Unbounded Channels** instead don't have this limitation, meaning that Publishers can publish as many times as they want, hoping that the Consumers are able to keep up. 

Choosing the right Channel type is of course extremely important and highly depends on the context. Keep also in mind that while it's true that Unbounded Channels are indeed "unbounded", the memory on the machine _normally_ isn't. 

#### So if your application is flooding the Channel with data and Consumers can't do their job quickly enough, you might end up in trouble.

On the other end, when a Bounded Channel is full, incoming messages won't be added to the queue, slowing down the system. A simple solution might be just adding more Consumers, but again, don't make the mistake of thinking that resources are infinite.

As usual I have come up with a <a rel="noreferrer noopener" aria-label="small repository on GitHub (opens in a new tab)" href="https://github.com/mizrael/ChannelsExample/tree/master/ChannelsExample" target="_blank">small repository on GitHub</a> showing some use-cases. The code is basically simulating the exchange of a bunch of messages between

  * one Producer and one Consumer
  * one Producer and multiple Consumers
  * multiple Producers and multiple Consumers

I've structured it in order to be very simple adding more cases. 

Now, few things to note here.

The <a rel="noreferrer noopener" aria-label="Producer (opens in a new tab)" href="https://github.com/mizrael/ChannelsExample/tree/master/ChannelsExample" target="_blank">Producer</a> class is simply calling WriteAsync() to publish a message. This method <a href="https://github.com/dotnet/runtime/blob/master/src/libraries/System.Threading.Channels/src/System/Threading/Channels/ChannelWriter.cs" target="_blank" rel="noreferrer noopener" aria-label="is internally using (opens in a new tab)">is internally using</a> an interesting pattern, something like this:

<pre class="wp-block-code"><code>while (await _writer.WaitToWriteAsync(cancellationToken))
    if (_writer.TryWrite(message))
        return;</code></pre>

There are few good reasons why it's using WaitToWriteAsync() in a loop. One is because different Producers might be sharing the Channel, so WaitToWriteAsync() could signal that we can proceed with writing but then TryWrite() fails. This will put us back in the loop, awaiting for the next chance.

On the <a href="https://github.com/mizrael/ChannelsExample/blob/master/ChannelsExample/Consumer.cs" target="_blank" rel="noreferrer noopener" aria-label="reading side (opens in a new tab)">reading side</a>, things are not so different:

<pre class="wp-block-code"><code>await foreach (var message in _reader.ReadAllAsync(cancellationToken))
    DoSomething(message);</code></pre>

Here we're leveraging ReadAllAsync(), which returns an IAsyncEnumerable<>, allowing us to read all the available data in one go.

This method <a rel="noreferrer noopener" aria-label="is internally (opens in a new tab)" href="https://github.com/dotnet/runtime/blob/master/src/libraries/System.Threading.Channels/src/System/Threading/Channels/ChannelReader.netcoreapp.cs" target="_blank">is internally</a> waiting for data to be available and using yield return to getting it back to the caller. 

It's always a good idea to take a look at the sources of the libraries we're using. It helps us getting a better understanding of the tools in our belt, giving us the power to pick the most appropriate one for the job at hand. 

#### Also (and probably this is even more important), reading other people's code is one of the best ways to improve as software engineers.

All in all this Channel library is very useful when designing data-intensive applications in multi-threaded environments, especially when there's the need to exchange messages between workers. 

In a web context it might be handy for example when subscribing to a queuing system like RabbitMQ, with the Producer fetching the messages and pushing them down to one or more Consumers.

<a rel="noreferrer noopener" aria-label="Here you can (opens in a new tab)" href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-4-adding-system-threading-channels/" target="_blank">Here you can</a> get a more detailed explanation with a sample implementation.

<div class="post-details-footer-widgets">
</div>