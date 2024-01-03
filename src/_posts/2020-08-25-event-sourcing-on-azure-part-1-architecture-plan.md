---
description: >
  Welcome to a new series about Event Sourcing on Azure. We'll talk about the pattern, general architecture and the individual building blocks.
id: 7596
title: 'Event Sourcing on Azure - part 1: architecture plan'
date: 2020-08-25T21:27:21-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7596
permalink: /event-sourcing-on-azure-part-1-architecture-plan/
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
image: /assets/uploads/2020/08/azure-event-sourcing.jpg
categories:
  - .NET
  - ASP.NET
  - Azure
  - Design Patterns
  - Microservices
  - Software Architecture
tags:
  - .NET Core
  - ASP.NET Core
  - Azure
  - Azure Functions
  - design patterns
  - message queues
  - software architecture
---
Hi All! With this post, we'll start a new Series about Event Sourcing on Azure. We're going to talk a bit about the pattern, general architecture, and the individual building blocks. Then in the next posts, we'll dig more and see each one in detail.

If you're a regular reader of this blog, you might know that I wrote already about Event Sourcing <a href="https://www.davidguida.net/event-sourcing-in-net-core-part-1-a-gentle-introduction/" target="_blank" rel="noreferrer noopener">in the past</a>. It's a complex pattern, probably one of the most complex to get right. I enjoy the challenges it gives and how it causes a whole plethora of other patterns to be evaluated in conjunction (<a href="https://www.davidguida.net/lets-do-some-ddd-with-entity-framework-core-3-part-3-better-value-objects/" target="_blank" rel="noreferrer noopener">CQRS</a> anyone?). 

#### And like any other pattern, there are no _silver bullets_. Architecture and implementation will change based on the Domain needs. 

But we can "quickly" lay out the general idea, and then diverge from it based on our necessities (or should I say the **business** necessities).

So let's start with the architecture!

<div class="wp-block-image">
  <figure class="aligncenter size-large"><a href="/assets/uploads/2020/08/image-3.png?ssl=1" target="_blank" rel="noopener noreferrer"><img loading="lazy" width="788" height="392" src="/assets/uploads/2020/08/image-3.png?resize=788%2C392&#038;ssl=1" alt="" class="wp-image-7603" srcset="/assets/uploads/2020/08/image-3.png?w=968&ssl=1 968w, /assets/uploads/2020/08/image-3.png?resize=300%2C149&ssl=1 300w, /assets/uploads/2020/08/image-3.png?resize=768%2C382&ssl=1 768w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a></figure>
</div>

On the left we have the Commands (or _Write Side_), let's begin with that. The Commands our system exposes will be accessed via REST endpoints through a Web API. We could use Azure Functions with an HTTP trigger as well, but we'll talk more about this in another post of the Series.

Whatever way we pick to communicate with the outer world, the commands will first go through a validation phase against the business rules. This usually happens by re-hydrating the <a href="https://docs.microsoft.com/en-us/archive/msdn-magazine/2011/november/the-cutting-edge-design-of-a-domain-model?WT.mc_id=DOP-MVP-5003878#customer-as-an-aggregate-root-class" target="_blank" rel="noreferrer noopener"><em>Aggregate</em> <em>Root</em></a> from past events and performing a set of operations on it. 

#### Then, if everything is fine, the commands be translated into _Domain Events_ and persisted in our Event Store. We will be using CosmosDB for this.

Then we have to publish _Integration Events_ to inform other parts of the system that "something" happened. This will be handled by <a href="https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview?WT.mc_id=DOP-MVP-5003878#topics" target="_blank" rel="noreferrer noopener">Azure Service Bus Topics</a>. We'll use Topics instead of simple Queues because we might have different consumer types interested in a particular event type. And of course, we want to deploy, operate, and scale those consumers independently.

One of these consumers will be an Azure Functions App with a very important role: <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/azure/architecture/patterns/materialized-view?WT.mc_id=DOP-MVP-5003878" target="_blank">materializing our Query Models</a>. When querying data, we can't, of course, rehydrate the Aggregates each time. Yes, we would get consistent data each time, but it would be overkill, even if we were using _snapshots_.

So we subscribe to the Topics and each time we receive an event, we refresh a query-specific version of the data and we store it in another storage. We will still be using CosmosDB in our example.

Materialized views have the great benefit of being exactly what our calling application needs, including all the possible aggregated data. Moreover, in case our requirements change, we can always add new views or update the existing ones. As long as we have the original events stream, we can flush all the views and rebuild them from scratch with little cost.

That's all for today. <a href="https://www.davidguida.net/event-sourcing-on-azure-part-2-events-persistence/" target="_blank" rel="noreferrer noopener">Next time</a> we'll see how we can handle events persistence. Ciao!

<div class="post-details-footer-widgets">
</div>