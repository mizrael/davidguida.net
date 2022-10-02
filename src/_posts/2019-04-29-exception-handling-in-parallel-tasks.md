---
id: 6677
title: Exception handling in parallel Tasks
description: >
  Let's see how to properly do exception handling in parallel Tasks with .NET and C#
date: 2019-04-29T13:04:27-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6677
permalink: /exception-handling-in-parallel-tasks/
image: /assets/uploads/2019/02/parallel_processing_lego_assembly_2_600x400.jpg
tags:
  - .NET Core
  - programming
  - ASP.NET Core
---
In a <a rel="noreferrer noopener" aria-label="previous post (opens in a new tab)" href="https://www.davidguida.net/serial-vs-parallel-task-execution/" target="_blank">previous post</a> we discussed about parallel VS serial execution of asynchronous operations. This time instead we'll see how to properly do exception handling in parallel Tasks.

Let's suppose you have a bunch of network calls to do, maybe to some microservices. Maybe you're in an <a href="https://www.davidguida.net/handling-authentication-and-authorization-in-microservices-part-1/" target="_blank" rel="noreferrer noopener" aria-label="API Gateway (opens in a new tab)">API Gateway</a> and you're aggregating data.

The calls have no dependencies between each other and can be executed in parallel. So what do you do? You wrap the calls in `Task.WaitAll()` or, even better, in `Task.WhenAll()`. Something like this:

<script src="https://gist.github.com/mizrael/184fdd1594529ab1f803893f506c39c2.js"></script>

#### `Task.WhenAll()` returns another `Task` that can be awaited so we don't block the current thread. Nice and clean.

Now! Suppose one or all the async operations fail and throw. How would you handle it? Try/catch is a good start:

<script src="https://gist.github.com/mizrael/064901b97717cc3cce75bda68bbae787.js"></script>

That works fine, in case you have a single exception. If more than one async operation fails, `Task.WhenAll()` will give you visibility only of the first one. That's one of the main differences with `Task.WaitAll()` : this one instead will collect **all** the exceptions and re-throw an `AggregateException`.

So what can we do? Go back to `Task.WaitAll()` ? Nah.

The trick is to not await directly the call to Task.WhenAll() but to store instead the returned `Task` in a variable. In the try/catch block then we can access the `Task.Exception` property, which is an `AggregateException`, and do whatever we want with its `InnerExceptions`:

<script src="https://gist.github.com/mizrael/bd0b0962226bf77c39b3c6a9d1eedb44.js"></script>

As usual I've pushed a <a rel="noreferrer noopener" aria-label="small repo (opens in a new tab)" href="https://github.com/mizrael/parallel-tasks-exceptions" target="_blank">small repo</a> on GitHub. It's a small dotNET Core console app which runs a bunch of tasks in parallel and shows how to trap the exceptions.
