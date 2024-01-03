---
description: >
  Hi All! Today we'll see how to improve resilience of REST API calls from a Blazor webassembly app using an HTTP Client using Polly.
id: 7438
title: Improving HTTP resilience in Blazor webassembly
date: 2020-07-18T21:45:08-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7438
permalink: /improving-http-resilience-in-blazor-webassembly/
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
image: /assets/uploads/2020/07/resilience.jpg
categories:
  - .NET
  - ASP.NET
  - Blazor
  - Design Patterns
  - Microservices
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
  - design patterns
  - microservices
---
Hi All! Today I decided to take a quick break from my <a aria-label="undefined (opens in a new tab)" href="https://www.davidguida.net/blazor-and-2d-game-development-part-1-intro/" target="_blank" rel="noreferrer noopener">Blazor gamedev</a> series and talk about resilience. We'll see how to call a REST API from a Blazor webassembly app using an HTTP Client and how to handle errors using Polly.

As usual, I've pushed a <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorHttpResiliency" target="_blank" rel="noreferrer noopener">sample repository</a> on GitHub, feel free to check it out.

So, _**resilience.**_ I have always liked this word. 

<blockquote class="wp-block-quote">
  <p>
    re·​sil·​ience&nbsp;|&nbsp;\&nbsp;ri-ˈzil-yən(t)s&nbsp;&nbsp;\<br />- the capability of a strained body to recover its size and shape after&nbsp;deformation&nbsp;caused especially by compressive stress<br />- an ability to recover from or adjust easily to&nbsp;misfortune&nbsp;or change
  </p>
  
  <cite>from <a href="https://www.merriam-webster.com/">https://www.merriam-webster.com/</a></cite>
</blockquote>

Why should we care about it when writing applications? Well, like many other things in our field, the answer lies in <a aria-label="undefined (opens in a new tab)" href="https://en.wikipedia.org/wiki/Murphy%27s_law" target="_blank" rel="noreferrer noopener">Murphy's law</a>:

<blockquote class="wp-block-quote">
  <p>
    "Anything that can go wrong will go wrong"
  </p>
</blockquote>

This applies to most everything in software, regardless it's between application boundaries or when communicating with external systems.

Talking about Blazor webassembly, oftentimes we have to use an Http Client to perform requests to some APIs. Or maybe we're talking with a [gRPC service](https://www.davidguida.net/how-to-consume-dd-rest-api-over-grpc-web-blazor-part-1-the-client/), that's more or less the same concept.

What should we do if a call fails for some reason? Maybe there was a network hiccup. Or maybe the service went down for maintenance. Or again, maybe we just were unlucky and stumbled upon some weird transient issue.

#### There are several cases to handle and to be fair, we can't just surround **all** our calls with try/catch, if/else and so on and so forth.

So, assuming we're using a <a href="https://docs.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Typed Http Client</a>, we can leverage the super-famous NuGet package <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://github.com/App-vNext/Polly" target="_blank">Polly</a> and add few policies here and there.

I wrote about **Polly** <a aria-label="undefined (opens in a new tab)" href="https://www.davidguida.net/event-sourcing-in-net-core-part-4-query-models/" target="_blank" rel="noreferrer noopener">in the past</a> already, but this time let's go a little bit more in detail.

Adding the <a href="https://www.nuget.org/packages/Microsoft.Extensions.Http.Polly/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">Microsoft.Extensions.Http.Polly</a> NuGet will allow us to write something like this:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">builder.Services.AddHttpClient&lt;WeatherClient>((sp, client) =>
{
    client.BaseAddress = new Uri(builder.Configuration["weatherApi"]);
}).AddPolicyHandler(/* let's get fancy here */);</pre>

Now it comes the juicy part: we have to identify what's the right Policy (or combination of) for us.

Usually the first stop is always **_<a aria-label="undefined (opens in a new tab)" href="https://github.com/App-vNext/Polly#wait-and-retry" target="_blank" rel="noreferrer noopener">WaitAndRetryAsync</a>_**. In a nutshell, it would allow us to retry the call a specified number of times, potentially even using exponential backoff. Something like this:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">Random _jitterer = new Random();

HttpPolicyExtensions
                .HandleTransientHttpError()
                .WaitAndRetryAsync(retryCount,
                    retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))
                                  + TimeSpan.FromMilliseconds(_jitterer.Next(0, 100) );</pre>

Notice the call to _<a aria-label="undefined (opens in a new tab)" href="https://github.com/App-vNext/Polly.Extensions.Http/blob/master/src/Polly.Extensions.Http/HttpPolicyExtensions.cs" target="_blank" rel="noreferrer noopener">HandleTransientHttpError()</a>_. It's a handy method that will handle transient errors for us, like timeouts and server errors. 

This is nice and it's a good starting point. But what if the server is not responding even after all the retries ? Well, depends. We might decide to throw an exception and live with it.

But since we're always trying to be polite, we can try to go for <a aria-label="undefined (opens in a new tab)" href="https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation" target="_blank" rel="noreferrer noopener">graceful degradation</a>. A very simple approach is to use the _NullObject_ pattern, or, as Fowler uses to call it, <a aria-label="undefined (opens in a new tab)" href="https://www.martinfowler.com/eaaCatalog/specialCase.html" target="_blank" rel="noreferrer noopener"><em>Special Case</em></a>.

We can create a compound Policy that wraps our Retry with a Fallback: this way if everything fails, we can return some kind of "acceptable" result to the user. For example, if we're loading an archive of product, we can show a message saying "there are no products matching your query". Whatever.

If you check the sample repository, you'll see that this is exactly the strategy <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorHttpResiliency/blob/master/BlazorHttpResiliency.Client/HttpClientPolicies.cs" target="_blank" rel="noreferrer noopener">I've taken</a> when things start going south:<figure class="wp-block-image size-large">

[<img loading="lazy" width="651" height="555" src="/assets/uploads/2020/07/Screenshot-2020-07-18-at-13.54.24.png?resize=651%2C555&#038;ssl=1" alt="" class="wp-image-7447" srcset="/assets/uploads/2020/07/Screenshot-2020-07-18-at-13.54.24.png?w=651&ssl=1 651w, /assets/uploads/2020/07/Screenshot-2020-07-18-at-13.54.24.png?resize=300%2C256&ssl=1 300w" sizes="(max-width: 651px) 100vw, 651px" data-recalc-dims="1" />](/assets/uploads/2020/07/Screenshot-2020-07-18-at-13.54.24.png?ssl=1)</figure> 

The system is trying the call for 3 times before reverting to the fallback value. Everything is logged so we know what's happening, but we can also instruct Polly to execute some custom operation, in this case logging some additional warning messages.

As you'll see from the code, I have simply expanded the default Weather service example. Our fallback is an empty list of <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorHttpResiliency/blob/master/BlazorHttpResiliency.Client/WeatherForecast.cs" target="_blank" rel="noreferrer noopener">WeatherForecast</a> items, which is treated like this by the UI:<figure class="wp-block-image size-large">

[<img loading="lazy" width="524" height="158" src="/assets/uploads/2020/07/Screenshot-2020-07-18-at-13.55.12.png?resize=524%2C158&#038;ssl=1" alt="" class="wp-image-7448" srcset="/assets/uploads/2020/07/Screenshot-2020-07-18-at-13.55.12.png?w=524&ssl=1 524w, /assets/uploads/2020/07/Screenshot-2020-07-18-at-13.55.12.png?resize=300%2C90&ssl=1 300w" sizes="(max-width: 524px) 100vw, 524px" data-recalc-dims="1" />](/assets/uploads/2020/07/Screenshot-2020-07-18-at-13.55.12.png?ssl=1)</figure> 

Way better than blowing up isn't it?

<div class="post-details-footer-widgets">
</div>