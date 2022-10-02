---
description: >
  Why should you reset the state of an Entity Framework Db Context? In this article I'll explain why might be useful and in which scenarios you might encounter potential issues by not doing it.
id: 6402
title: How to reset the entities state on a Entity Framework Db Context
date: 2018-01-26T15:49:34-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6402
permalink: /how-to-reset-the-entities-state-on-a-entity-framework-db-context/
dsq_thread_id:
  - "6439417238"
image: /assets/uploads/2018/01/Entity-Framework-Logo_2colors_Square_RGB-591x360.png
categories:
  - .NET
  - EntityFramework
  - Programming
  - SQL
  - Testing
---
I had two bad days. Those days wasted chasing a stupid bug. I had a test class with 4 test cases on my <a href="https://www.techopedia.com/definition/32090/infrastructure-layer" target="_blank" rel="noopener">infrastructure layer</a>. If executed one by one, they pass. If the whole suite was executed, only the first one was passing.

At the end I found out that it was due to the&nbsp;<a href="https://github.com/aspnet/EntityFrameworkCore" target="_blank" rel="noopener">Entity Framework Core</a>&nbsp;db Context tracking the state of the entities. More or less.&nbsp;  
In a nutshell, every time a call to SaveChanges() fails, &nbsp;the subsequent call on the **same instance** of the db context will retry the operations.&nbsp;

So let’s say your code is making an INSERT with bad data and fails. Maybe you catch that and then you do another write operation reusing the db context instance.

Well that will fail too. Miserably.

Maybe it&#8217;s more correct to say that the second call will look for changes on the entities and will try to commit them. Which is basically the standard and expected behaviour.

Since _usually_ db context instances are created for every request this might not be a big issue.

However, in case you are writing tests using&nbsp;<a href="https://xunit.github.io/docs/shared-context.html" target="_blank" rel="noopener">XUnit Fixtures</a>, the instance is created once per test class and reused for all the tests in that class. So in this case it might affect test results.

A potential solution is to reset the state of the changed entities, something like this:  


Another option is to avoid entirely reusing the db context and generating a new one from scratch.  
In my code the db context was registered on the DI container and injected as dependency. I changed the consumer classes to use a <a href="https://en.wikipedia.org/wiki/Factory_method_pattern" target="_blank" rel="noopener">Factory</a> instead and that fixed the tests too 🙂

<div class="post-details-footer-widgets">
</div>