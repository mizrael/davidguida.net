---
description: >
  Welcome to the second part of this Series on OpenSleigh. Today we'll continue our discussion about Saga State persistence.
id: 7956
title: 'OpenSleigh: tackling state persistence, part 2'
date: 2021-01-27T22:09:05-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7956
permalink: /opensleigh-tackling-state-persistence-part-2/
image: /assets/uploads/2021/01/OpenSleigh_-tackling-state-persistence-part-2.jpg
categories:
  - .NET
  - Design Patterns
  - OpenSleigh
  - Software Architecture
tags:
  - design patterns
  - OpenSleigh
  - software architecture
---
Hi All! Welcome back to the second part of this Series on **<a href="https://github.com/mizrael/OpenSleigh" target="_blank" rel="noreferrer noopener">OpenSleigh</a>**. Today we'll continue our discussion about Saga State persistence and we'll also see some code.

Last time we started talking about the general flow and what **OpenSleigh** does when it receives a new message.

The _important thing_ to understand here is that a Saga message handler can mutate the Saga State **and** publish other messages.

#### We have to make sure that all this happens in a single transaction. 

We absolutely don't want to lose any modification to the State **and** we also need to publish those new messages safely.

The core happens in the _**<a href="https://github.com/mizrael/OpenSleigh/blob/develop/src/OpenSleigh.Core/SagaRunner.cs" target="_blank" rel="noreferrer noopener">SagaRunner</a>**_ class in its _RunAsync()_ method. Let's go over a super simplified version, step by step:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public async Task RunAsync&lt;TM>(TM message) where TM : IMessage 
{
    var (state, lockId) = await _sagaStateService.GetAsync(message);
    if (state.IsCompleted() || state.CheckWasProcessed(message))
        return;
</pre>

This first part takes care of fetching the Saga state from the Persistence layer using the _Correlation ID_ of the message. 

Internally, the _[SagaStateService](https://github.com/mizrael/OpenSleigh/blob/develop/src/OpenSleigh.Core/SagaStateService.cs)_ will fetch an existing State. If missing, it'll create a new one for us, but only if the message can start the current Saga. It will also take care of [locking](https://www.davidguida.net/how-to-do-document-level-locking-on-mongodb-and-net-core-part-2/) the State and preventing unwanted modifications. This is very important as we don't want other Saga instances to process the same message concurrently.

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">var transaction = await _transactionManager.StartTransactionAsync();
try
{
    var saga = _sagaFactory.Create(state);
    if (null == saga)
        throw new SagaNotFoundException($"unable to create Saga");

    await saga.HandleAsync(message);

    state.SetAsProcessed(message);

    await _sagaStateService.SaveAsync(state, lockId);

    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
    throw;
}</pre>

The next thing we do is starting a Transaction. Inside its scope, we do few interesting things:

  1. run the current message handler
  2. set the message as _processed_ for the current Saga instance
  3. persist the Saga State

Point #2 is quite important, as we'll see in another article, for two good reasons. First of all, we don't want the same message to be processed by the same Saga (maybe running on another worker instance). 

At the same time, however, some messages might be _events_ instead of _commands_. This means that the very same message **can** be handled by multiple different Sagas.

If everything goes smoothly, we can finally commit the Transaction and call it a day. Otherwise, we roll it back and rethrow the exception.

That's all for today, <a href="https://www.davidguida.net/opensleigh-state-persistence-outbox-pattern/" target="_blank" rel="noreferrer noopener">the next time</a> we'll keep discussing State persistence. We'll see how **OpenSleigh** makes sure that outbound messages don't get lost along with any Saga State modification.

Ciao!

<div class="post-details-footer-widgets">
</div>