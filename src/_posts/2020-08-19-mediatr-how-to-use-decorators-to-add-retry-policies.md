---
description: >
  Today we'll see how we can leverate the Decorator Pattern in conjunction with Polly and Scrutor to add retry policies to MediatR.
id: 7568
title: 'MediatR: how to use Decorators to add retry policies'
date: 2020-08-19T13:40:20-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7568
permalink: /mediatr-how-to-use-decorators-to-add-retry-policies/
zakra_layout:
  - tg-site-layout--customizer
zakra_remove_content_margin:
  - "0"
zakra_transparent_header:
  - customizer
zakra_page_header:
  - "1"
zakra_logo:
  - "0"
dsq_thread_id:
  - "8170998394"
image: /assets/uploads/2020/08/Hourglass.jpg
categories:
  - .NET
  - ASP.NET
  - Design Patterns
  - Software Architecture
tags:
  - .NET Core
  - ASP.NET Core
  - design patterns
---
Hi All! Today we&#8217;ll see an interesting technique to add retry policies to <a href="https://www.davidguida.net/event-sourcing-in-net-core-part-4-query-models/" target="_blank" rel="noreferrer noopener">Med</a><a href="https://www.davidguida.net/command-handlers-return-values-in-cqrs/" target="_blank" rel="noreferrer noopener">i</a><a href="https://www.davidguida.net/event-sourcing-in-net-core-part-4-query-models/" target="_blank" rel="noreferrer noopener">atR</a>. It can actually be used also for other types of policies (fallback, circuit breaker, and so on), but we&#8217;ll focusing on retries to keep things simple.

As you might have guessed, this &#8220;magic trick&#8221; involves the use of the Decorator Pattern. We talked already about it <a href="https://www.davidguida.net/using-decorators-to-handle-cross-cutting-concerns/" target="_blank" rel="noreferrer noopener">in another article</a> so I&#8217;m not going to spend time on it. Let&#8217;s jump into the code!

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class RetryDecorator&lt;TNotification> : MediatR.INotificationHandler&lt;TNotification>
        where TNotification : MediatR.INotification
{
	private readonly INotificationHandler&lt;TNotification> _inner;
	private readonly Polly.IAsyncPolicy _retryPolicy;

	public RetryDecorator(MediatR.INotificationHandler&lt;TNotification> inner)
	{
		_inner = inner; 
		_retryPolicy = Polly.Policy.Handle&lt;ArgumentOutOfRangeException>()
			.WaitAndRetryAsync(3,
				i => TimeSpan.FromSeconds(i));
	}

	public Task Handle(TNotification notification, CancellationToken cancellationToken)
	{
		return _retryPolicy.ExecuteAsync(() => _inner.Handle(notification, cancellationToken));
	}
}</pre>

I showed this class already in another article of my <a href="https://www.davidguida.net/event-sourcing-in-net-core-part-4-query-models/" target="_blank" rel="noreferrer noopener">Event Sourcing</a> series, but without going too much into the details. Today we&#8217;ll see how we can register it in our system using Dependency Injection.

This class is decorating an instance of <a href="https://github.com/jbogard/MediatR/blob/master/src/MediatR/INotificationHandler.cs" target="_blank" rel="noreferrer noopener">INotificationHandler</a>. In <a href="https://github.com/mizrael/SuperSafeBank" target="_blank" rel="noreferrer noopener">SuperSafeBank</a>, I use Notification Handlers to react to Integration Events and update the Query Models. 

#### However, sometimes an update might fail, maybe because other dependencies are (still) not available or there&#8217;s a network issue with the DB server or whatever.

Now, MediatR has already built-in support for decorators using Behaviors, but as of today ( v8 ) it **<a href="https://github.com/jbogard/MediatR/wiki/Behaviors#nb" target="_blank" rel="noreferrer noopener">doesn&#8217;t cover Notification Handlers</a>** .

In those cases, we can make use of <a href="https://github.com/App-vNext/Polly" target="_blank" rel="noreferrer noopener">Polly</a> and add a policy wrapping the &#8220;unstable&#8221; code. But how can we decorate all our Handlers?

Most of the IoC libraries available have already commodity functions to register decorators. But to be honest, I like the built-in .NET Core IoC Container, it covers all the basic scenarios and lifetimes. Moreover, if you&#8217;re in need of something more exotic, most of the time you&#8217;d have to review the design.

Unfortunately though, Decorators are not part of the library. But we can use another interesting NuGet: <a href="https://github.com/khellang/Scrutor" target="_blank" rel="noreferrer noopener">Scrutor</a>. It&#8217;s a tiny library, created specifically for this: &#8220;_Assembly scanning and decoration extensions for Microsoft.Extensions.DependencyInjection_&#8220;. Perfect for us.

So, the first thing is to look for all our handlers and register them:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public void ConfigureServices(IServiceCollection services) {
	services.Scan(scan => {
		scan.FromAssembliesOf(typeof(Startup))
			.RegisterHandlers(typeof(INotificationHandler&lt;>));
	});
}</pre>

Here we use the _.Scan()_ method to go through the assembly containing a specific type and retrieving all the classes implementing _INotificationHandler<>_. For the sake of the example, I&#8217;m assuming that our handlers are in the same assembly as the _Startup_ class.

####  
We have also to take into account that _RetryDecorator_ implements _INotificationHandler<>_ as well, and we don&#8217;t want any cyclic registration. 

We can handle this with _.RegisterHandlers()_ :



<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public static class IImplementationTypeSelectorExtensions
{
	public static IImplementationTypeSelector RegisterHandlers(this IImplementationTypeSelector selector, Type type)
	{
		return selector.AddClasses(c =>
				c.AssignableTo(type)
					.Where(t => t != typeof(RetryDecorator&lt;>))
			)
			.UsingRegistrationStrategy(RegistrationStrategy.Append)
			.AsImplementedInterfaces()
			.WithScopedLifetime();
	}
}</pre>

Let&#8217;s see what&#8217;s happening here. _AddClasses_() goes through the classes picked by our _selector_ and adds them to the _IServicesCollection_. But with a twist: we only want classes that are assignable to a specific _type_ (in this case _INotificationHandler_<> ) **and** we skip the current class if it&#8217;s _RetryDecorator_. 

The rest of the code makes sure that the selected classes are _appended_ to the container, without replacing existing ones. We also want them to be registered and discoverable using their implemented interfaces. And finally, we want them to use the <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?WT.mc_id=DOP-MVP-5003878&view=aspnetcore-3.1#scoped" target="_blank" rel="noreferrer noopener">Scoped lifetime</a>.

We have one last small step to make: registering the decorator itself 😀

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public void ConfigureServices(IServiceCollection services){
    services.Decorate(typeof(INotificationHandler&lt;>), typeof(RetryDecorator&lt;>));
}</pre>

Piece of cake!

<div class="post-details-footer-widgets">
</div>