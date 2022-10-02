---
description: >
  OpenSleigh uses the Outbox pattern to ensure that outbound messages don't get lost along with any Saga State modification.
id: 8000
title: 'OpenSleigh &#8211; state persistence part 3: the outbox pattern'
date: 2021-02-14T18:27:39-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8000
permalink: /opensleigh-state-persistence-outbox-pattern/
image: /assets/uploads/2021/02/OpenSleigh-state-persistence-part-3-the-outbox-pattern.jpg
categories:
  - .NET
  - ASP.NET
  - Design Patterns
  - OpenSleigh
  - Software Architecture
tags:
  - .NET Core
  - design patterns
  - OpenSleigh
  - software architecture
---
Hi All! Welcome back to the third part of this Series on **<a href="https://github.com/mizrael/OpenSleigh" target="_blank" rel="noreferrer noopener">OpenSleigh</a>**. Today we&#8217;ll see how we can use the Outbox pattern to ensure that outbound messages don&#8217;t get lost along with any Saga State modification. 

The <a href="https://www.davidguida.net/opensleigh-tackling-state-persistence-part-2/" target="_blank" rel="noreferrer noopener">last time</a> we saw how we can leverage locking and transactions to wrap message handlers execution.

Now, one thing that we definitely want to avoid is outgoing messages being dispatched before the current Saga State gets persisted.

#### Why? Because this would put the whole system in an inconsistent state. 

Let&#8217;s suppose our State holds a counter of some operations. We might rely on that counter for some computations, or even to decide if our Saga is completed. 

In a message handler, we increase this counter and send a message, but for some reason, the State does not get persisted. I think you got the idea now of the ripple effect this would cause.

Luckily for us, **OpenSleigh** is capable of handling all of this by leveraging the <a href="https://www.davidguida.net/improving-microservices-reliability-part-2-outbox-pattern/" target="_blank" rel="noreferrer noopener">Outbox pattern</a>. We talked already about it but let me refresh your memory real quick.

The gist of the pattern is that we don&#8217;t send messages immediately. We instead use a transaction to store atomically both the Saga State and the outgoing messages in our Persistence storage. 

Then, a background worker takes care of pulling unprocessed messages, locking and publishing them. 

```csharp
public class OutboxBackgroundService : BackgroundService
{
    private readonly IOutboxProcessor _processor;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (true)
        {
            await _processor.ProcessPendingMessagesAsync(stoppingToken);
            await Task.Delay(_options.Interval, stoppingToken);
        }
    }
}
```

We need to lock each message to prevent concurrent instances to send the same message:

```csharp
public class OutboxProcessor
{
    public async Task ProcessPendingMessagesAsync(CancellationToken cancellationToken)
    {
        var messages = await _outboxRepository.ReadMessagesToProcess(cancellationToken);
        foreach(var message in messages)
        {
            var lockId = await _outboxRepository.LockAsync(message, cancellationToken);
            await _publisher.PublishAsync(message, cancellationToken);
            await _outboxRepository.ReleaseAsync(message, lockId, cancellationToken);
        }
    }
}
```

For those interested, you can find more details on the locking strategy used by **OpenSleigh** <a href="https://www.davidguida.net/how-to-do-document-level-locking-on-mongodb-and-net-core-part-1/" target="_blank" rel="noreferrer noopener">here</a>.

That&#8217;s all for today! Don&#8217;t forget to check out the shiny new <a href="https://www.opensleigh.net" target="_blank" rel="noreferrer noopener"><strong>OpenSleigh</strong> website</a> for more samples and documentation!