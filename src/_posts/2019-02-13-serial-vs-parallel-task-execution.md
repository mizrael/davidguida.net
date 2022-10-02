---
id: 6586
title: Serial vs Parallel task execution
description: >
  let's talk a bit about the difference between serial and parallel task execution with .NET and c#
date: 2019-02-13T15:00:58-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6586
permalink: /serial-vs-parallel-task-execution/
dsq_thread_id:
  - "7230053351"
image: /assets/uploads/2019/02/parallel_processing_lego_assembly_2_600x400.jpg
tags:
  - .NET Core
  - programming
  - ASP.NET Core
---
This time let's talk a bit about the difference between serial and parallel task execution.

The idea is simple: if we have two or more operations depending one from another (eg. the result of one goes as input into another), then we need to run them in serial, one after the other.

<div class="center w100">
  <img loading="lazy" width="770" height="400" src="/assets/uploads/2019/02/ford_assembly_line.jpg?resize=770%2C400&#038;ssl=1" alt="" class="wp-image-6597" srcset="/assets/uploads/2019/02/ford_assembly_line.jpg?w=770&ssl=1 770w, /assets/uploads/2019/02/ford_assembly_line.jpg?resize=300%2C156&ssl=1 300w, /assets/uploads/2019/02/ford_assembly_line.jpg?resize=768%2C399&ssl=1 768w" sizes="(max-width: 770px) 100vw, 770px" data-recalc-dims="1" />
</div>

<blockquote class="wp-block-quote">
  <p>
    Total execution time will be the sum of the time taken by the single steps. Plain and easy.
  </p>
</blockquote>

What if instead the operations don't interact? Can they be executed each in its own path so we can collect the results later on? Of course! That is called **parallel execution** .

<div class="center w100">
  <img loading="lazy" width="600" height="250" src="/assets/uploads/2019/02/slot-car-racing-Melbourne.jpg?resize=600%2C250&#038;ssl=1" alt="parallel car racing track"  />
</div> 

It's like those electric racing tracks: each car gets its own lane, they can't hit/interfere each other and the race is over when every car completes the circuit.

<blockquote class="wp-block-quote">
  <p>
    So how can we do that? Luckily for us, in .NET we can use <a rel="noreferrer noopener" aria-label="Task.WhenAll() (opens in a new tab)" href="https://docs.microsoft.com/en-us/dotnet/api/system.threading.tasks.task.whenall?redirectedfrom=MSDN&view=netcore-2.2#overloads" target="_blank">Task.WhenAll()</a> or<a rel="noreferrer noopener" aria-label=" Task.WaitAll() (opens in a new tab)" href="https://docs.microsoft.com/en-us/dotnet/api/system.threading.tasks.task.waitall?redirectedfrom=MSDN&view=netcore-2.2#overloads" target="_blank"> Task.WaitAll()</a> to run a bunch of tasks in parallel.
  </p>
</blockquote>

Both the methods do more or less the same, the main difference is that `Task.WaitAll()` waits for all of the provided `Task` objects to complete execution, blocking the current thread until everything has completed.

`Task.WhenAll()` instead returns a `Task` that can be awaited on its own. The calling method will continue when the execution is complete but you won't have a thread hanging around waiting.

<blockquote class="wp-block-quote">
  <p>
    So in the end, the total time will be more or less (milliseconds heh) the same as the most expensive operation in the set.
  </p>
</blockquote>

I've prepared a [small repository on Github](https://github.com/mizrael/parallel-tasks) to demonstrate the concepts, feel free to take a look. It's a very simple .NET Core console application showing how to execute two operations in serial and then in parallel.

Here's a screenshot I got on my Macbook Pro:

<div class="center w100">
  <img loading="lazy" width="311" height="188" src="/assets/uploads/2019/02/capture.png?resize=311%2C188&#038;ssl=1" alt="" class="wp-image-6595" srcset="/assets/uploads/2019/02/capture.png?w=311&ssl=1 311w, /assets/uploads/2019/02/capture.png?resize=300%2C181&ssl=1 300w" sizes="(max-width: 311px) 100vw, 311px" data-recalc-dims="1" />
</div>