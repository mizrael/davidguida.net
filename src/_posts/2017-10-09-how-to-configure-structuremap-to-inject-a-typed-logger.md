---
description: >
  In this article I'll show how to configure StructureMap to properly inject a typed logger in your classes and what other alternatives you have
id: 6353
title: How to configure StructureMap to inject a typed logger
date: 2017-10-09T12:31:32-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6353
permalink: /how-to-configure-structuremap-to-inject-a-typed-logger/
dsq_thread_id:
  - "6201533179"
image: /assets/uploads/2014/08/computerprogramming_8406403-655x280.jpg
categories:
  - .NET
  - Programming
  - Software Architecture
---
Logging is an essential part of every application. Might be dead simple as Console.WriteLine() or a complex third party library but every piece of software needs a way to communicate its status.

In my last project I have decided to use the wonderful <a href="http://nlog-project.org/" target="_blank" rel="noopener">NLog </a>. One of the good things this library has is the possibility to add some contextual information to the messages, including (by default) the name of the calling class. Something like this:

> 2017-10-06 17:01:06.0417|<strong style="color: green;">INFO</strong>|<strong style="color: red;">MyAwesomeProgram.MyAwesomeClass</strong>|<strong style="color: blue;">This is my message</strong>

As you can see, I have outlined with different colors the level, the name of the caller and the text.

This can be easily accomplished by something like this:



Using a static cTor to init the logger helps to&nbsp; get a better stack trace in case&nbsp;GetCurrentClassLogger() throws an exception for some reason.

However, in case you're using a DI container (as <a href="https://martinfowler.com/articles/injection.html" target="_blank" rel="noopener">you should</a>), it may become complicate to inject a valid Logger instance into each class.

Getting back to my project, for this I am using&nbsp;<a href="http://structuremap.github.io/" target="_blank" rel="noopener">StructureMap </a>as DI container. Usually I tend to stick with <a href="https://simpleinjector.org/index.html" target="_blank" rel="noopener">Simple Injector</a>, but I just joined the team and it's very important to follow <a href="https://team-coder.com/establish-coding-guidelines/" target="_blank" rel="noopener">the existing conventions</a>.

The idea here is to use a wrapper class around the logger instance that takes as cTor parameter the name of the calling class. I'm using a wrapper just to avoid coupling with a third party library: usually you wouldn't change from a logging library to another unless you've a very good reason for, but this principle applies basically to anything.

Next step is to configure StructureMap to return each time a new instance of the LoggerWrapper with the proper calling class name. And that's actually the easy part!  
Here's the full code:



As you can see the magic happens during the StructureMap setup:&nbsp;**context.ParentType**&nbsp;represents the type of the class that will receive the LoggerWrapper instance.

&nbsp;

Now let's take a step back. Logging falls into the category of <a href="https://en.wikipedia.org/wiki/Cross-cutting_concern" target="_blank" rel="noopener">"cross-cutting concerns"</a>&nbsp;, which basically means that logging can be considered part of the "infrastructure" and of course not of the business logic of the application. Caching can be another good example.

That said, unless you really need to&nbsp; write specific log messages in specific points of your application, another option could be using the <a href="https://en.wikipedia.org/wiki/Decorator_pattern" target="_blank" rel="noopener">Decorator pattern</a>&nbsp;. The idea is pretty straightforward:

  1. create a FooLoggingDecorator class
  2. inject the logger
  3. wrap all the class methods
  4. add logging where needed

Now it's up to you to decide which approach to take, they both have pros and cons. For example, injecting the logger in some case can imply a <a href="https://en.wikipedia.org/wiki/Single_responsibility_principle" target="_blank" rel="noopener">SRP </a>violation. On the other hand, using a decorator requires wrapping all the inner class methods. Keep that in mind when you add stuff to your interfaces 🙂

**[EDIT]**  
As Jeremy wrote in his comment, the <a href="http://structuremap.github.io/the-container/working-with-the-icontext-at-build-time/" target="_blank" rel="noopener">StructureMap documentation</a> suggests to use a logger convention instead which would&nbsp;&nbsp;be (quoting):

> "significantly more efficient at runtime because the decision about which&nbsp;`Logger`&nbsp;to use is only done once upfront"&nbsp;

<div class="post-details-footer-widgets">
</div>