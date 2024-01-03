---
description: >
  Last time wasn't the last episode of the Event Sourcing series! This time we're going to see how to implement offline consumers for our integration events
id: 7295
title: 'Event Sourcing in .NET Core &#8211; part 5: offline consumers'
date: 2020-06-05T00:13:12-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7295
permalink: /event-sourcing-in-net-core-part-5-offline-consumers/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/06/event-sourcing-offline-consumers.jpg
categories:
  - .NET
  - ASP.NET
  - Design Patterns
  - Kafka
  - Microservices
  - RabbitMQ
  - Software Architecture
tags:
  - .NET Core
  - ASP.NET Core
  - design patterns
  - Kafka
  - microservices
  - rabbitmq
  - software architecture
---
Ok so apparently <a rel="noreferrer noopener" href="https://www.davidguida.net/event-sourcing-in-net-core-part-4-query-models/" target="_blank">last time</a> I lied. Or at least I lied to me: it wasn&#8217;t the last episode of the Event Sourcing series 🙂 This time we&#8217;re going to see how we can implement **offline consumers** for our integration events.

My **<a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank" target="_blank">SuperSafeBank </a>**repo was still calling me and I knew there were other things to add. It was like an itch, constantly reminding me to add more and more code, features on top of features.

So what is an **offline consumer**? Well, it&#8217;s quite simple: it is something that doesn&#8217;t have any visible access points. No API. No UI. 

#### A naked implementation will just expose the necessary hooks for the Ops team to <a rel="noreferrer noopener" href="https://www.davidguida.net/health-checks-with-asp-net-core-and-kubernetes/" target="_blank">monitor its health</a>, and that&#8217;s it.

And why in the world we would want something like that?

Well, it&#8217;s simple. Background operations. Everything that can be processed &#8220;offline&#8221; and doesn&#8217;t require human intervention. Long-running tasks for example. Stuff like:

  * transcoding media files
  * processing large batches of rows on a DB
  * sending newsletters

Usually, an **offline consumer** is implemented as a Console application, hosting implementations of our friend <a rel="noreferrer noopener" href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-1-message-queues/" target="_blank">BackgroundService</a>. 

It&#8217;s not very different from the usual WebHost we use in ASP.NET. Something like this:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">class Program
{
    static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    private static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((ctx, builder) =>
                {
                    builder.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
                })
                .ConfigureServices((hostContext, services) =>
                {
                   // register your services here
                });
}</pre>

The difference here is that we&#8217;re calling **<a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/host/generic-host?view=aspnetcore-3.1" target="_blank">.ConfigureServices() </a>**instead of **_.ConfigureWebHostDefaults()_** as we would normally do to create an HTTP Server.

Now, what bank would be **SuperSafeBank** if it was not sending notifications to its customers? A very lame one, I&#8217;ll tell you that.

I&#8217;ve added a new service to our ecosystem, in this case I decided to use the naming convention &#8220;worker&#8221; to state its **offline consumer** nature.

Its sole purpose is to listen to specific events and shoot a notification when necessary. For example when an account is created or there&#8217;s a withdrawal or a deposit operation. The kind of things that everybody would keep under their radar when it comes to money.

The bulk of this new system is the <a href="https://github.com/mizrael/SuperSafeBank/blob/notifications-service/SuperSafeBank.Worker.Notifications/AccountEventsWorker.cs" target="_blank" rel="noreferrer noopener"><strong>AccountEventsWorker</strong> </a>class, which will start consuming event and react to them:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">private async Task OnEventReceived(object s, IDomainEvent&lt;Guid> @event)
{
    var notification = @event switch
    {
                AccountCreated newAccount => await _notificationsFactory.CreateNewAccountNotificationAsync(newAccount.OwnerId, newAccount.AggregateId),
                Deposit deposit => await _notificationsFactory.CreateDepositNotificationAsync(deposit.OwnerId, deposit.Amount),
                Withdrawal withdrawal => await _notificationsFactory.CreateWithdrawalNotificationAsync(withdrawal.OwnerId, withdrawal.Amount),
                _ => null
    };

    if (null != notification)
        await _notificationsService.DispatchAsync(notification);
}</pre>

I will still keep adding more features to the repository so stay tuned and feel free to contribute!

<div class="post-details-footer-widgets">
</div>