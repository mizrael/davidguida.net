---
description: >
  In the previous article of this series we talked a bit about Message Queues. This time instead I'll be introducing Background Workers.
id: 6724
title: 'Consuming message queues using .net core background workers &#8211; part 2: background workers'
date: 2019-07-04T09:30:05-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6724
permalink: /consuming-message-queues-using-net-core-background-workers-part-2-background-workers/
dsq_thread_id:
  - "7514141271"
image: /assets/uploads/2019/07/construction-worker-silhouette-work-background_43605-1096.jpg
categories:
  - .NET
  - ASP.NET
  - Design Patterns
  - Microservices
  - Programming
  - RabbitMQ
  - Software Architecture
tags:
  - design patterns
  - software architecture
---
In the <a rel="noreferrer noopener" aria-label="previous article (opens in a new tab)" href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-1-message-queues/" target="_blank">previous article</a> of this series we talked a bit about Message Queues. This time instead I&#8217;ll be introducing **Background Workers**.

Just to recap, Message Queues can be used to handle asynchronous communication between services, improving resiliency and scalability.

Now, suppose you have an API for handling blog posts and tags. Every post can be assigned to one or more tags. Let&#8217;s say that you&#8217;re using MongoDB with a single &#8220;Posts&#8221; collection. Something simple, like this:

<pre class="wp-block-code"><code>{
    title: ...,
    description: ...,
    creationDate: ...,
    tags: ["lorem", "ipsum", "dolor"]
}</code></pre>

Works fine, your API can handle a huge amount of requests. All is good, everybody is happy. 

One day you&#8217;re asked to add a &#8220;tag-cloud&#8221; functionality: the API has to expose a new endpoint that returns a list of **all the tags** plus the posts count. Something like this:

<pre class="wp-block-code"><code>[
    {tag: "lorem", posts_count: 42},
    {tag: "ipsum", posts_count: 13},
    {tag: "dolor", posts_count: 71}
]</code></pre>

Again, nothing fancy. Now the question is: how do you collect the data?

One option would be to update the counts with an <a rel="noreferrer noopener" aria-label="upsert operation (opens in a new tab)" href="https://docs.mongodb.com/manual/reference/glossary/#term-upsert" target="_blank">upsert operation</a> every time a blog post is added or updated. 

#### This works fine but it&#8217;s not exactly scalable. The whole operation could take time, or fail and you would end up with an inconsistent state.

Yes you could add a <a rel="noreferrer noopener" aria-label="Circuit Breaker  (opens in a new tab)" href="https://martinfowler.com/bliki/CircuitBreaker.html" target="_blank">Circuit Breaker </a>but I&#8217;m sure it won&#8217;t be enough.

Another option would be to use a **Background Worker**! In a nutshell, the application will spin up a new thread and execute whatever operation it has to. 

#### Of course this thread will be running **outside** the http request/response cycle so you won&#8217;t get access to anything like logged user, cookies and so on.

Going back to our small example, at application bootstrap we could spin up a **Background Worker** that would recreate the tag cloud from scratch at regular intervals (say every 6 hours or so, depends on how frequently you have new posts published). Being it on MongoDb it could use <a rel="noreferrer noopener" aria-label="map/reduce (opens in a new tab)" href="https://docs.mongodb.com/manual/core/map-reduce/" target="_blank">map/reduce</a> or the <a rel="noreferrer noopener" aria-label=" (opens in a new tab)" href="https://docs.mongodb.com/manual/aggregation/" target="_blank">aggregate pipeline</a>, doesn&#8217;t matter.

A **Background Worker** can also be used to consume messages published on a queue. For example we could react to an &#8220;Order fulfilled&#8221; event and have the worker send notification emails to the customer. 

Or maybe we can have a **Background Worker** consuming a &#8220;Blog post updated&#8221; event and refresh a de-normalized version of the Post in the Queries db, which will eventually be used by our Query engine in a <a rel="noreferrer noopener" aria-label="CQRS architecture (opens in a new tab)" href="https://martinfowler.com/bliki/CQRS.html" target="_blank">CQRS architecture</a>.

That&#8217;s all for today. <a href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-3-the-code-finally/" target="_blank" rel="noreferrer noopener" aria-label="Next time (opens in a new tab)">Next time</a> I&#8217;m going to show some code so stay tuned!

<div class="post-details-footer-widgets">
</div>