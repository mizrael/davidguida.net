---
description: >
  Everything that happens around us is an event of some sort. Let's find out what Event Sourcing is and how we can implement it in .NET Core.
id: 7079
title: 'Event Sourcing in .NET Core &#8211; part 1: a gentle introduction'
date: 2020-03-30T05:30:00-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7079
permalink: /event-sourcing-in-net-core-part-1-a-gentle-introduction/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
dsq_thread_id:
  - "7941826053"
image: /assets/uploads/2020/03/waterfall.jpg
categories:
  - .NET
  - ASP.NET
  - Design Patterns
  - Programming
  - Software Architecture
tags:
  - DDD
  - event sourcing
  - message queues
  - programming
  - software architecture
---
**Event sourcing**, aka &#8220;the great myth&#8221;. I&#8217;ve been thinking about writing a series of articles about this for a while, and now it&#8217;s time to put my hands back on the keyboard. 

I thought that with all this bull**it pandemic at least I could have had more time to write on this blog but it turns out the reality has been **slightly** different so far.

Anyways let&#8217;s get back in track! **Event sourcing**. It&#8217;s probably one of the hardest things to code, immediately after <a rel="noreferrer noopener" aria-label="two other things (opens in a new tab)" href="https://martinfowler.com/bliki/TwoHardThings.html" target="_blank">two other things</a>.

Everything that happens around us is an event of some sort. The cake is ready in the oven. The bus has arrived at the stop. Your cellphone&#8217;s battery runs out. And for every event, there might be zero or more actors reacting to it. Cause and effect, we could say.

So how does it translate for us? **Event sourcing**, at its heart, basically means storing all the events occurring on our system in a timely-ordered fashion. All of our write operations are basically appending to a log-like persistence storage and that&#8217;s it. Events can **only** be appended. Not updated or deleted.

#### Then what? How do we **query** our data? Here we get the **reaction** part. 

**Event sourcing** has a very important pre-requisite: CQRS. All the read operations have to be performed on a different datastore, which is in turn populated by the appropriate event handlers.

I know it might sound a bit complex (and actually it is), so let&#8217;s try with an example. 

Imagine you&#8217;re writing the software for a bank. The system can:

  1. create customers
  2. create accounts for the customers
  3. withdraw money from an account
  4. deposit money on an account

Armed with these infos, we can start modeling our **commands**:

  1. create a customer
  2. create an account for a customer
  3. withdraw money from an account
  4. deposit money on an account

We&#8217;ll keep it simple and won&#8217;t be dwelling much into **domain-specific** details like currency conversion and the like. Although DDD is another aspect that is essential to our success (and we <a rel="noreferrer noopener" aria-label="discussed it already (opens in a new tab)" href="https://www.davidguida.net/lets-do-some-ddd-with-entity-framework-core-3/" target="_blank">discussed it already</a>).

Let&#8217;s see our **queries** now:

  1. archive of customers, each with the number of open accounts
  2. customer details with the list of accounts, each with its balance
  3. list of transactions on an account

At 10,000ft. the system looks more or less like this:<figure class="wp-block-image size-large">

<img loading="lazy" width="671" height="321" src="/assets/uploads/2020/03/image-1.png?resize=671%2C321&#038;ssl=1" alt="" class="wp-image-7091" srcset="/assets/uploads/2020/03/image-1.png?w=671&ssl=1 671w, /assets/uploads/2020/03/image-1.png?resize=300%2C144&ssl=1 300w" sizes="(max-width: 671px) 100vw, 671px" data-recalc-dims="1" />

Events get pushed into the **Write side** which does basically two things: 

  * appends them to a storage system
  * pushes <a href="https://devblogs.microsoft.com/cesardelatorre/domain-events-vs-integration-events-in-domain-driven-design-and-microservices-architectures/" target="_blank" rel="noreferrer noopener" aria-label="integration events (opens in a new tab)">integration events</a> to a queue

**Eventually**, the integration events will be captured and consumed by the relative handlers on the **Query side**, materializing all the Query Models our system needs.

#### Now, why in the world one would even think about implementing a system like this? Well, there are quite a few good reasons.

Keeping track of what happens in an append-only storage allows replaying the events and rebuild the state of our domain models at any time. In case something bad occurs, we have an almost immediate way to understand what went wrong and possibly how to fix the issue.

Performance and scalability. The Query Models can be built with whatever technology fits the needs. Data can be persisted in a relational db, in a NoSQL one or just plain HTML. Whatever is faster and more suited for the job. Basically, if the business needs change we can quickly adapt and generate completely new forms of the models.

Moreover, the Query DBs can be wiped out and repopulated from scratch by simply replaying all the events. This gives the possibility to avoid potentially problematic things like migrations or even backups since all you have to do is just run the events again and you get the models back.

So where&#8217;s the catch? Well, the drawbacks are a few as well. We&#8217;ll talk about them in another post of this series. <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://www.davidguida.net/event-sourcing-in-net-core-part-2-storing-events/" target="_blank">Next time</a> instead we&#8217;ll take a look at a possible implementation of our bank example and we&#8217;ll start talking about how to get events into the system.

If you&#8217;re working on Azure, don&#8217;t miss [my other Articles](https://www.davidguida.net/event-sourcing-on-azure-part-1-architecture-plan/)!

<div class="post-details-footer-widgets">
</div>