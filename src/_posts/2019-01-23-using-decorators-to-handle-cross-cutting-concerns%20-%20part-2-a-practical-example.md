---
description: >
  In this article we’ll see an example of the Decorator Pattern, .NET Attributes and Dependency Injection to reduce boilerplate code.
id: 6565
title: 'Using the Decorator Pattern to handle cross-cutting concerns - Part 2: a practical example'
date: 2019-01-23T10:23:47-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6565
permalink: '/using-decorators-to-handle-cross-cutting-concerns%20-%20part-2-a-practical-example/'
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
image: /assets/uploads/2019/01/decorators.jpeg
categories:
  - .NET
  - Design Patterns
  - Programming
  - Software Architecture
tags:
  - .NET Core
  - design patterns
  - software architecture
---
In <a aria-label="my previous article  (opens in a new tab)" href="https://www.davidguida.net/using-decorators-to-handle-cross-cutting-concerns/" target="_blank" rel="noreferrer noopener">my previous article, </a>I discussed a bit about how to use the Decorator Pattern to implement cross-cutting concerns and reduce clutter in your codebase. Today it’s going to be a bit more practical: we’ll be looking at a small example I published on Github. It makes use of Decorators as well as some other interesting things like .NET Attributes, CQRS, and Dependency Injection.

I’m not going to deep dive into the details of&nbsp;<a href="https://martinfowler.com/bliki/CQRS.html" rel="noreferrer noopener" target="_blank">CQRS&nbsp;</a>as it would obviously take too much time and it’s outside the scope of this article. I’m using it here because query/command handlers usually expose just one method so there is no need to implement a big interface. Also, I like the pattern a lot&nbsp;🙂

So let’s go straight to the code! The repository is available here:&nbsp;<a href="https://github.com/mizrael/cross-cutting-concern-attributes" rel="noreferrer noopener" target="_blank">https://github.com/mizrael/cross-cutting-concern-attributes</a>

### It’s a very small&nbsp;.NET Core WebAPI application, nothing particularly fancy.&nbsp;**No infrastructure of course**, there’s no need for this article.

There’s just&nbsp;<a href="https://github.com/mizrael/cross-cutting-concern-attributes/blob/master/cross-cutting-concern-attributes/Controllers/ValuesController.cs" rel="noreferrer noopener" target="_blank">one API controller</a>, exposing a single GET endpoint to retrieve a list of “values”. I might have called it “stuff” instead of “values”, it’s just an excuse to retrieve some data from the backend.

As you may have noticed, there’s no direct reference to the query handler in the API controller. I prefer to use <a href="https://github.com/jbogard/MediatR" rel="noreferrer noopener" target="_blank">MediatR</a> to avoid injecting too many things in the constructor. It has become an habit so I’m doing it even when there’s just one dependency.

For those who don’t know it, MediatR acts as a simple in-process message bus, allowing quick dispatch of commands, queries and events. So, basically, it’s a very handy tool when implementing CQRS.

The&nbsp;<a href="https://github.com/mizrael/cross-cutting-concern-attributes/blob/master/cross-cutting-concern-attributes/Queries/Handlers/ValuesArchiveHandler.cs" rel="noreferrer noopener" target="_blank">ValuesArchiveHandler&nbsp;</a>class handles the actual execution of the query. Actually it’s not doing much, apart from returning a fixed list of strings.

What we’re interested into actually is that small attribute, [Instrumentation]&nbsp;. It is just a marker, the real grunt-work will be elsewhere. I could have used an interface as well of course, but there are **several reasons why I didn’t.**

#### First of all, I prefer to avoid empty interfaces: an interface is a contract, and an interface without method doesn’t define any contract.

<blockquote class="wp-block-quote is-style-default">
  <p>
  </p>
</blockquote>

Moreover, attributes can always be configured to not propagate to descendant types automatically, something you cannot do with interfaces.

Now, take a look at the&nbsp;<a href="https://github.com/mizrael/cross-cutting-concern-attributes/blob/master/cross-cutting-concern-attributes/Queries/Handlers/InstrumentationQueryHandlerDecorator.cs" rel="noreferrer noopener" target="_blank">InstrumentationQueryHandlerDecorator&nbsp;</a>class. It’s a query handler Decorator, so it gets an instance of a query handler injected in the constructor, and uses it in the Handle() method.

This decorator is not doing anything particular fancy, it’s just using Stopwatch to track how much time the inner handler is taking to complete.

What we’re interested in is the constructor: there the system is checking if the inner instance has been marked with the [Instrumentation] attribute, flipping a boolean value based on the result. We'll then use that bool in the Handle() method to turn the instrumentation on or off. That’s it!

I’m using&nbsp;<a href="http://structuremap.github.io/" rel="noreferrer noopener" target="_blank">StructureMap&nbsp;</a>as my IoC container and I’m taking care of the handler registration&nbsp;<a href="https://github.com/mizrael/cross-cutting-concern-attributes/blob/master/cross-cutting-concern-attributes/Registries/MediatrRegistry.cs" rel="noreferrer noopener" target="_blank">here&nbsp;</a>. In the same file I also decorate all the query handlers with the InstrumentationQueryHandlerDecorator&nbsp;.

Keep in mind that I could have added some smarts here and check&nbsp;_at registration time&nbsp;_if a particular handler had been decorated with the [Instrumentation] attribute.

<blockquote class="wp-block-quote">
  <p>
    That would probably be&nbsp;<strong>a better solution</strong>&nbsp;as it would avoid runtime type checks, handling everything during the application bootstrap.
  </p>
</blockquote>

I’ll probably add this to the repository, I left it out to keep things simple 🙂

<div class="post-details-footer-widgets">
</div>