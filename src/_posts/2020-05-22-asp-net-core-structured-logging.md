---
description: >
  In this post, we'll see what's the difference between "standard" and "structured" logging and how the latter can help us tracing down issues in our systems.
id: 7228
title: 'ASP.NET Core structured logging &#8211; part 1: introduction'
date: 2020-05-22T23:27:11-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7228
permalink: /asp-net-core-structured-logging/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/05/logging.jpg
categories:
  - .NET
  - ASP.NET
  - Microservices
tags:
  - .NET Core
  - ASP.NET Core
  - logging
  - microservices
---
Hi All! In this post, we&#8217;ll see what&#8217;s the difference between &#8220;_standard_&#8221; and &#8220;_structured_&#8221; logging and how the latter can help us tracing down issues in our systems.

But first, let&#8217;s begin with a question. Ever had to go through countless of log messages to find a single tiny entry?

Then you know how it feels like.

_Standard_ logging represents the simplest form possible. It&#8217;s just a simple message, possibly correlated with a timestamp and probably a few other pieces of data.

<pre class="wp-block-preformatted">"creating customer 123..."<br />"an exception has been thrown by..."<br />"something, somewhere, went terribly, terribly wrong"</pre>

Maybe, if you&#8217;re lucky you also get a bit of stack trace.

#### Adding logging to an ASP.NET application is <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-3.1" target="_blank" rel="noreferrer noopener">quite easy</a>, although configuring it properly can be sometimes tricky.

Knowing **what** to log instead is the real deal. We don&#8217;t want to lose important information but at the same time, we have to avoid polluting the system with unnecessary messages.

Now, the problem with _standard ****_logging is that searching for specific entries can become difficult. Very difficult, especially when our system has been online and used for a while.

Filtering and potentially doing some aggregation is doable but the quality of results is questionable. There are multiple tools that can help us with this, like <a rel="noreferrer noopener" href="https://grafana.com/" target="_blank">Grafana</a> and <a rel="noreferrer noopener" href="https://www.splunk.com/" target="_blank">Splunk</a> (and do much more than that, to be fair).

So what other option do we have? Well, we can move to **_structured_** logging instead. What&#8217;s the difference? Well basically we&#8217;re **enriching** the log entry with some additional data, regardless of the actual text message. 

These fields can then be used later on to filter the entries, create aggregation, stats and charts. All this data is of course extremely useful, helping us monitoring and keeping under control the health of our systems.

#### Now, obviously, if your application is creating just a hundred messages per day, you won&#8217;t find much benefit from all of this. Just come up with a decent Regexp and you&#8217;re good to go.

This of course doesn&#8217;t mean that you&#8217;ll have to start throwing more messages just for the sake of it. All the opposite.

But if you&#8217;re orchestrating a large microservice application, with a lot of moving parts, possibly with complex architectures like <a rel="noreferrer noopener" href="https://www.davidguida.net/event-sourcing-in-net-core-part-1-a-gentle-introduction/" target="_blank">Event Sourcing</a>, then you want to be careful.

If we&#8217;re being diligent and keeping field naming consistent, structured logging will help us tracing down the flow of our transactions amongst the different services. Yes, it can be hard, especially when there are multiple teams working on separate microservices.

In this case, things like <a rel="noreferrer noopener" href="https://devblogs.microsoft.com/aspnet/improvements-in-net-core-3-0-for-troubleshooting-and-monitoring-distributed-apps/" target="_blank">Trace identificators</a> are the key solution to our problem.

That&#8217;s all for today. <a href="https://www.davidguida.net/asp-net-core-structured-logging-part-2-the-infrastructure/" target="_blank" rel="noreferrer noopener">Next time</a> we&#8217;ll see some examples and how to leverage structured logging in our ASP.NET Core application.

<div class="post-details-footer-widgets">
</div>