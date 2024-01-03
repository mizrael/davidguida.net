---
description: >
  How do you make sure an entire software you wrote works? And how would you do that if your system doesn't have a UI? Well, simply by testing the boundaries!
id: 6503
title: Testing the boundaries of your Web APIs
date: 2018-09-17T09:30:55-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6503
permalink: /testing-boundaries-web-api/
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
image: /assets/uploads/2018/09/testing-the-boundaries.jpeg
categories:
  - .NET
  - ASP.NET
  - Microservices
  - Programming
  - Software Architecture
  - Testing
tags:
  - .NET Core
  - refactoring
  - TDD
  - testing
  - web-api
---
How do you make sure an entire software you wrote works? And how would you do that if your system doesn't have a UI? Well, simply by testing the boundaries of course!

From time to time I like to extract pieces of code from what I'm working on and create small repos just to showcase a single functionality or idea.&nbsp;

This time I'm putting some efforts on **TDD on APIs** and after few refactorings I came up with a nice structure that you can use as a starting skeleton for a simple system. You can find all the sources <a href="https://github.com/mizrael/WebApiTestingSkeleton" target="_blank" rel="noopener noreferrer">here on GitHub</a>.

The demo is very simple, just a single controller that stores and provides user details. Nothing fancy. The user model class exposes only three properties: id, full name and email. 

Few points worth noting though:

  * the class is **immutable**. I wrote a bit about the concept <a href="https://www.davidguida.net/immutable-builder-pattern/" target="_blank" rel="noopener noreferrer">here</a>.
  * I'm adopting the <a href="https://martinfowler.com/eaaCatalog/specialCase.html" target="_blank" rel="noopener noreferrer">Special Case</a> (or Null Object) pattern a lot these days. Hence the NullUser static property.  
    

Persistence is done in-memory as it's obviously outside the scope. Moreover, as you can see the Tests project contains only the <a href="https://www.martinfowler.com/bliki/BroadStackTest.html" target="_blank" rel="noopener noreferrer">end-to-end tests</a>, no unit/integration test to cover the persistence layer.

The testing infrastructure is where things gets interesting, even though it's actually fairly straightforward. An <a href="https://github.com/mizrael/WebApiTestingSkeleton/blob/master/WebApiTestingSkeleton.Tests/Fixtures/WebApiFixture.cs" target="_blank" rel="noopener noreferrer">XUnit Fixture</a> is firing up a <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.testhost.testserver?view=aspnetcore-2.1" target="_blank" rel="noopener noreferrer">TestServer</a> and bootstrapping the application using (possibly) the same settings as the real system. 

A shared <a rel="noreferrer noopener" href="https://github.com/mizrael/WebApiTestingSkeleton/blob/master/WebApiTestingSkeleton.Core.Web/WebHostBuilderFactory.cs" target="_blank">WebHostBuilderFactory</a> class is indeed responsible of building the required <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/host/web-host?WT.mc_id=DOP-MVP-5003878&view=aspnetcore-2.1" target="_blank" rel="noreferrer noopener">IWebHostBuilder</a> instance.

##### **That's it!**

Ok, just to be honest, I got the idea from <a href="https://blog.ploeh.dk/" target="_blank" rel="noopener noreferrer">Mark Seemann</a> : he has a very interesting course on Pluralsight named "<a href="https://www.pluralsight.com/courses/outside-in-tdd" target="_blank" rel="noopener noreferrer">Outside-in TDD</a>". If you have the chance, I strongly suggest you to watch it.

So, now that we have our nice infrastructure ready, all we have to do is write our tests! Being this a Web API, these might be considered either "functional" or "end to end". 

Honestly I think it's simply **a naming thing** and doesn't change the fact that probably these should be the first tests you would write.

Why? Because (and Mark explains it **really well** in his course) you're ensuring from the consumer's perspective that your APIs do what they're expected to do. 

## You'll be&nbsp;**"testing the boundaries"**.

But most importantly, you're validating your acceptance criteria and making sure your system works.&nbsp;

#### Everything else is just an&nbsp;implementation detail.

So what are we testing here? The routes of course! Our API is managing users, and being it RESTful, <a href="https://github.com/mizrael/WebApiTestingSkeleton/blob/master/WebApiTestingSkeleton.Tests/E2E/Routes/UsersTests.cs" target="_blank" rel="noopener noreferrer">we're asserting</a> that all the http verbs are doing what we expect to do.&nbsp;

Most of these tests should derive directly from the acceptance criteria written by your Product Owner. In case you don't have one but instead rely on some (even vague) specifications, a good starting point is simply testing inputs and outputs.&nbsp;

<p style="font-size:25px">
  Happy testing!
</p>



<div class="post-details-footer-widgets">
</div>