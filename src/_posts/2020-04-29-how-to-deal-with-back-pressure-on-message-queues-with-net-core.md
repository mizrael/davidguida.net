---
description: >
  In this post, we're going to see what back-pressure on message queues is and a very simple way to deal with it in .NET Core and Google Cloud Platform PubSub.
id: 7162
title: How to deal with back-pressure on message queues with .NET Core
date: 2020-04-29T04:00:00-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7162
permalink: /how-to-deal-with-back-pressure-on-message-queues-with-net-core/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/04/bus-queue.jpg
categories:
  - .NET
  - Google Cloud Platform
  - Programming
tags:
  - .NET Core
  - Google Cloud Platform
  - message queues
  - programming
---
Hi All! In this post, we're going to see a very simple way to deal with **back-pressure** on message queues.

But first: what does actually mean "**back-pressure**" ? Well, imagine you're at a bus stop, waiting in line to hop on the bus. And right in front of you, there's a nice old lady with a walking stick.

The bus arrives and by the time the lady manages to get on it, behind you there are at least 15 other people waiting, pushing and probably silently cursing the lady for being so slow (and probably you're doing the same).

Now, you, the driver, and everybody else just experienced **back-pressure**. In a nutshell:

<blockquote class="wp-block-quote">
  <p>
    Slow consumers not being able to process messages quickly enough will cause messages to accumulate in the queue, waiting to be picked up.
  </p>
</blockquote>

Why a consumer might be slow, you could ask. Maybe the person who wrote the code was just lazy and the code sucks, who knows. But this can be solved by a good engineer, that's why we're here 🙂

Maybe the operation is CPU bound. Or maybe every message causes several operations on a DB (open a connection, run the query, and so on and so forth&#8230;.). Or even worse, every message causes API calls to other services. There's plenty of reasons, just pick one. 

#### How can we solve this? Well, of course, you can't force publishers to run slower and produce fewer messages.

One option could be scaling horizontally and add more instances of the consumer to the pool. This is an excellent strategy, but of course, you always have to keep an eye on the costs associated with multiple instances of the same service.

Moreover, your system might not be stateless or simply not able to handle more than one instance.

Another option is simply to bite the bullet and _pull fewer messages**.**_ Yes, you read that right. Pull fewer messages. Beware, that doesn't mean discard some messages. Just don't pull all the messages all at once, but take a smaller window, process them, and move on.

The reason for this is that in an ideal world resources are infinite. But in an ideal world, we wouldn't be dealing with back-pressure at all.

But let's say that your consumer has to write the messages to a DB. No elaborations, just throw them to the DB. Even in a simple case like this, if you're receiving way too many messages, you'll soon end up saturating the DB connection pool. Nasty exceptions will be thrown and data will be lost.

Let's take a look at this sample code:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public Task PullSync(string projectId, string subscriptionName, CancellationToken stoppingToken)
{
    var subscriptionName = new SubscriptionName(projectId, subscriptionName);
    var subscriberClient = SubscriberServiceApiClient.Create();
    var batchSize = 40;

    return Task.Run(async () =>
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var response = subscriberClient.Pull(subscriptionName, returnImmediately: false, maxMessages: batchSize);
                if (!response.ReceivedMessages.Any())
                {
                    await Task.Delay(1000);
                    continue;
                }
                
                var toAck = await ProcessMessages(response.ReceivedMessages);
                if (toAck.Any())
                    await subscriberClient.AcknowledgeAsync(subscriptionName, toAck);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, $"an exception has occurred while pulling messages: {ex.Message}");
            }
        }
    });
}</pre>

This code is making use of a <a rel="noreferrer noopener" href="https://cloud.google.com/pubsub/docs/pull" target="_blank">GCP PubSub Topic Pull Subscription </a>(phew!) to fetch a limited amount of messages, in this case, 40. 

How many messages should you process? Well, depends. **Benchmark, profile, and monitor.** 

I've been using GCP a lot these days and I guess it's time to start writing some articles about it instead of always sticking with <a href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-1-message-queues/" target="_blank" rel="noreferrer noopener">RabbitMQ </a>or <a href="https://www.davidguida.net/event-sourcing-in-net-core-part-1-a-gentle-introduction/" target="_blank" rel="noreferrer noopener">Kafka</a>.

The batch is then forwarded to the `ProcessMessages()` method which will eventually return the ids of the messages that can be ack-ed. Something like this:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">private async Task&lt;string[]> ProcessMessages(IEnumerable&lt;ReceivedMessage> messages)
{
    var toAck = new List&lt;string>();

    var tasks = messages.Select(async msg =>
    {
        await WriteToDbAsync(msg.Message);        
        toAck.Add(msg.AckId);
    }).ToArray();

    await Task.WhenAll(tasks);

    return toAck.ToArray();
}</pre>

Once fetched, each message is processed in parallel. Of course, you can change this to be sequential, it's up to you. Plain and easy.

As you may have noticed, the `Pull` method in the first snippet is synchronous. This gives a bit more flexibility over its asynchronous counterpart, probably giving also less headaches. But again, it's up to you.



<div class="post-details-footer-widgets">
</div>