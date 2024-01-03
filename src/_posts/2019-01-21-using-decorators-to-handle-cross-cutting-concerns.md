---
description: >
  In this post we’ll explore a simple way to encapsulate cross-cutting concernsin reusable components using the Decorator pattern
id: 6553
title: Using the Decorator Pattern to handle cross-cutting concerns
date: 2019-01-21T09:30:54-05:00
author: David Guida
excerpt: "This time I'll be writing about a very simple but powerful technique to reduce boiler-plate caused by cross-cutting concerns. In this post we’ll explore a simple way to encapsulate them in reusable components using the Decorator pattern."
layout: post
guid: https://www.davidguida.net/?p=6553
permalink: /using-decorators-to-handle-cross-cutting-concerns/
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
image: /assets/uploads/2019/01/capsules.jpeg
categories:
  - .NET
  - Design Patterns
  - Programming
  - Software Architecture
tags:
  - design patterns
  - programming
  - software architecture
---
Hi All! Today I&#8217;ll be writing about a very simple but powerful technique to reduce boiler-plate caused by cross-cutting concerns. We’ll explore a simple way to encapsulate them in reusable components using the Decorator pattern.

I was actually planning of posting this article here but I was migrating to another server the last week and it took one week for the domain to point to the new DNS. Turns out this gave me the chance to try Medium instead, so published [my first article](https://medium.com/@obiuan/using-decorators-to-handle-cross-cutting-concerns-763fdb616f52) there.

Let’s first talk a bit about “cross cutting concerns”. On Wikipedia we can find this definition:

<blockquote class="wp-block-quote is-style-large">
  <p>
    Cross-cutting concerns are parts of a program that rely on or must affect many other parts of the&nbsp;system.
  </p>
</blockquote>

In a nutshell, they represent almost everything not completely tied to the&nbsp;<a href="https://en.wikipedia.org/wiki/Domain-driven_design" rel="noreferrer noopener" target="_blank">domain</a>&nbsp;of the application but that can affect in some way the behaviour of its components.

Examples can be:  
&#8211; caching  
&#8211; error handling  
&#8211; logging  
&#8211; instrumentation

Instrumentation for instance can lead to a lot of boilerplate code which eventually will create clutter and pollute your codebase. You’ll basically end up with a lot of code like this:

#### Of course, being IT professionals, you can quickly come up with a decent solution, find the common denominator, extract the functionality, refactor and so on.

So…how would you do it? One option would be to use the&nbsp;<a href="https://www.martinfowler.com/bliki/DecoratedCommand.html" rel="noreferrer noopener" target="_blank">Decorator pattern</a>! It’s a very common pattern and quite easy to understand:

Basically you have a Foo class that you need somewhere that implements a well known interface, and you need to wrap it into some cross-cutting concern. All you have to do is:

  1. create a new container class implementing the same interface
  2. inject the “real” instance
  3. write your new logic where you need
  4. call the method on the inner instance
  5. sit back and enjoy!

Very handy. Of course it can be quite awkward in case your interface has a lot of methods, but in that case you might have to reconsider your architecture as it is probably breaking&nbsp;<a href="https://en.wikipedia.org/wiki/Single_responsibility_principle" rel="noreferrer noopener" target="_blank">SRP</a>.

One option would be moving to <a aria-label="CQS (opens in a new tab)" rel="noreferrer noopener" href="https://en.wikipedia.org/wiki/Command%E2%80%93query_separation" target="_blank">CQS</a> / <a rel="noreferrer noopener" href="https://www.martinfowler.com/bliki/CQRS.html" target="_blank">CQRS</a>. In <a href="https://www.davidguida.net/using-decorators-to-handle-cross-cutting-concerns%e2%80%8a-%e2%80%8apart-2-a-practical-example/" target="_blank" rel="noreferrer noopener">the next post</a> of the series we will see a practical example and discuss why those patterns can be an even more interesting option when combined with Decorators.

Stay tuned!

<div class="post-details-footer-widgets">
</div>