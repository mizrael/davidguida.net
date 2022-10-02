---
description: >
  Outbox Pattern implementation with C# .NET Core, WebAPI and EntityFramework
id: 7005
title: 'Improving microservices reliability &#8211; part 3: Outbox Pattern in action'
date: 2020-01-20T08:45:00-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7005
permalink: /improving-microservices-reliability-part-3-outbox-pattern-in-action/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/01/postman.jpg
categories:
  - .NET
  - ASP.NET
  - Design Patterns
  - EntityFramework
  - Microservices
  - Programming
  - Software Architecture
tags:
  - design patterns
  - dotnetcore
  - entityframework
  - microservices
  - software architecture
---
And here we are for the third and last part of the Series! [Last time](https://www.davidguida.net/improving-microservices-reliability-part-2-outbox-pattern/) we talked about the **Outbox Pattern** and it&#8217;s now time to see it in action.

The main idea is to persist in the same transaction the Entity data plus the Messages that will be eventually sent to the potential subscribers. 

This will help lessening the pain of dealing with distributed transactions, guaranteeing that Domain Events can be broadcasted **at least once** to all the interested parties.

Enough talking, let&#8217;s dive into the code!

#### Here&#8217;s the link to <a rel="noreferrer noopener" aria-label=" the GitHub repository. (opens in a new tab)" href="https://github.com/mizrael/DDD-School/" target="_blank">the GitHub repository.</a> Take your time and wander a bit through the sources, I&#8217;ll wait.

For this demo I&#8217;ve used .NET Core, EntityFramework and WebAPI.

In the previous articles I used the eCommerce scenario as example. However here I&#8217;ve decided to switch to a different Domain just to avoid repetitiveness.

In this system we have Courses and Students. A <a rel="noreferrer noopener" aria-label="student (opens in a new tab)" href="https://github.com/mizrael/DDD-School/blob/master/DDD.School/Student.cs" target="_blank">Student</a> can enroll, withdraw and complete a <a rel="noreferrer noopener" aria-label="course (opens in a new tab)" href="https://github.com/mizrael/DDD-School/blob/master/DDD.School/Course.cs" target="_blank">Course</a>, and each operation will enforce some specific rules (eg. you cannot withdraw from a course if you&#8217;re not enrolled).

Also, every operation will trigger a <a rel="noreferrer noopener" aria-label=" (opens in a new tab)" href="https://github.com/mizrael/DDD-School/tree/master/DDD.School/Events" target="_blank">Domain Event</a> that will eventually be broadcasted to the subscribers. Bear in mind that for the sake of simplicity we&#8217;re not making any distinction between <a rel="noreferrer noopener" aria-label="Domain and Integration Events (opens in a new tab)" href="https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation#domain-events-versus-integration-events" target="_blank">Domain and Integration Events</a>.

The Events won&#8217;t be dispatched immediately but instead added to a list on the <a rel="noreferrer noopener" aria-label="BaseAggregateRoot class (opens in a new tab)" href="https://github.com/mizrael/DDD-School/blob/master/DDD.School/BaseEntity.cs" target="_blank">BaseAggregateRoot class</a>.

Then, right before persisting the Entities, the Events will be serialized and converted to Messages. These will be in turn stored in the db. The <a rel="noreferrer noopener" aria-label=" (opens in a new tab)" href="https://github.com/mizrael/DDD-School/blob/master/DDD.School.Persistence.SQL/SchoolUnitOfWork.cs" target="_blank">SchoolUnitOfWork class</a> handles all the logic for this.

#### It&#8217;s worth mentioning that once serialized, Events will be removed from their containing Entities to prevent them from being converted to Messages more than once. 

This basically covers the first half of the **Outbox Pattern**. The second part is instead handled outside the API flow, in a background task. Ideally we could have had a completely separate application for this, probably even running on a different machine. All in all, it doesn&#8217;t have to serve all the traffic the API has, so it wouldn&#8217;t need powerful hardware.

For this demo I&#8217;ve decided to make use of a .NET Core BackgroundService and have it sit next to our API. We talked already about them <a href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-1-message-queues/" target="_blank" rel="noreferrer noopener" aria-label="in another post (opens in a new tab)">in another post</a>, take a moment to refresh your memory if you need.

The <a rel="noreferrer noopener" aria-label="MessagesProcessorTask (opens in a new tab)" href="https://github.com/mizrael/DDD-School/blob/master/DDD.School.API/Services/MessagesProcessorTask.cs" target="_blank">MessagesProcessorTask</a> will execute at regular intervals and retrieve an instance of the <a rel="noreferrer noopener" aria-label="MessagesProcessor (opens in a new tab)" href="https://github.com/mizrael/DDD-School/blob/master/DDD.School/Services/MessageProcessor.cs" target="_blank">MessagesProcessor</a> class. This in turn, will fetch the unprocessed Messages from the db and publish them. 

I haven&#8217;t used any &#8220;real&#8221; message queue here, I think it&#8217;s outside the scope of the article, although I might be tempted to add it in the future.

And this completes the series about the **Outbox Pattern**. Don&#8217;t forget to read <a rel="noreferrer noopener" aria-label="part 1 (opens in a new tab)" href="https://www.davidguida.net/improving-microservices-reliability-part-1-two-phase-commit/" target="_blank">part 1</a> and <a rel="noreferrer noopener" aria-label="part 2 (opens in a new tab)" href="https://www.davidguida.net/improving-microservices-reliability-part-2-outbox-pattern/" target="_blank">part 2</a> if you haven&#8217;t and don&#8217;t hesitate to add a comment or ask a question!

<div class="post-details-footer-widgets">
</div>