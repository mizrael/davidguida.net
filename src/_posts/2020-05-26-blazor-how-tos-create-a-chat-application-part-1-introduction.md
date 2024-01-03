---
description: >
  Here we are for another episode of Blazor how-to's! This time we'll see how we can easily create a chat application with Blazor and .NET Core.
id: 7265
title: 'Blazor how-to's: create a chat application - part 1: introduction'
date: 2020-05-26T15:56:50-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7265
permalink: /blazor-how-tos-create-a-chat-application-part-1-introduction/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/05/blazorchat.jpg
categories:
  - .NET
  - ASP.NET
  - Blazor
  - RabbitMQ
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
  - message queues
  - rabbitmq
---
Here we are for another episode of **Blazor** how-to's! This time we'll see how we can easily create a chat application with Blazor and .NET Core.

As usual, all the code is <a rel="noreferrer noopener" href="https://github.com/mizrael/BlazorChat" target="_blank">available on GitHub</a>.

**Disclaimer**: don't expect anything fancy like Whatsapp or Slack 🙂 Our application will showcase just a bunch of features:

  * single chat room
  * (extremely) simple authentication
  * online status

This is more or less as it will look like:<figure class="wp-block-image size-large">

<img src="https://i0.wp.com/raw.githubusercontent.com/mizrael/BlazorChat/master/screenshot.JPG?w=788&#038;ssl=1" alt="" data-recalc-dims="1" /> <figcaption>behold! BlazorChat!</figcaption></figure> 

Nothing fancy, I told you 🙂

As you can see, the users can log in using a custom username (no password needed) and talk to each other in a single chat room. A red/green icon is displaying the online status.

**Disclaimer 2**: the code of the repo is far away from being production ready. We'll talk more about this later on, but again, don't expect to plug the cord and have a 100% working messaging system. There's no DDD, models are quite anemic and everything is in memory.

My main focus was to see how easy it could be to have a simple chat up and running with **Blazor** only. With that said, it won't be very complex to refactor the code and make it more robust. But as I wrote before, we'll talk more about this, eventually.

So, let's go through the features now!

#### Single chat room

As already said, the messages are not persisted, meaning that the system will lose everything when rebooting. I have implemented the communication with a <a rel="noreferrer noopener" href="https://www.davidguida.net/how-to-implement-producer-consumer-with-system-threading-channels/" target="_blank">bounded Channel</a> wrapped into a <a rel="noreferrer noopener" href="https://github.com/mizrael/BlazorChat/blob/master/BlazorChat/Services/MessagesPublisher.cs" target="_blank">simple interface</a>, so it can be swapped with **RabbitMQ**, for example.

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">private readonly ChannelWriter&lt;Message> _writer;

public async Task PublishAsync(Message message)
{
    await _writer.WriteAsync(message);
}</pre>

Messages are then pulled from the queue (aka **channel** ) with a <a rel="noreferrer noopener" href="https://github.com/mizrael/BlazorChat/blob/master/BlazorChat/Services/MessagesConsumerWorker.cs" target="_blank">Background Worker</a>. The <a rel="noreferrer noopener" href="https://github.com/mizrael/BlazorChat/blob/master/BlazorChat/Services/MessagesConsumer.cs" target="_blank">Consumer</a> will then dispatch an event that will eventually be <a rel="noreferrer noopener" href="https://github.com/mizrael/BlazorChat/blob/master/BlazorChat/Pages/Components/Chat.razor#L46" target="_blank">picked up </a>by the UI:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">private readonly ChannelReader&lt;Message> _reader;

public async Task BeginConsumeAsync()
{
    await foreach (var message in _reader.ReadAllAsync()) {
        this.MessageReceived?.Invoke(this, message);
     }
}

public event EventHandler&lt;Message> MessageReceived;</pre>

That's all for now! <a href="https://www.davidguida.net/blazor-how-tos-create-a-chat-application-part-2-authentication/" target="_blank" rel="noreferrer noopener">Next time </a>we'll see how we can "authenticate" our users. Cheers!

<div class="post-details-footer-widgets">
</div>