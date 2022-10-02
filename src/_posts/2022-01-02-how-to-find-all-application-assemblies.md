---
description: >
  In this article of the .NET How-Tos series we'll see how we can programmatically find all the Assemblies loaded by our Application.
id: 8020
title: '.NET How-Tos: find all application Assemblies'
date: 2022-01-02T12:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8020
permalink: /how-to-find-all-application-assemblies
image: /assets/uploads/2022/01/how-to-find-all-application-assemblies.jpg
categories:
  - .NET
  - C#
  - .NET How-Tos
tags:
  - .NET
  - C#
  - .NET How-Tos
---

First post of the year! I've decided to start a new Series and write about small .NET tricks and tips. Today we'll see how we can programmatically find all the Assemblies loaded by our Application.

### Why? Well, for example in libraries there's often the need to find all the types implementing a specific interface. 

I had the same issue in <a href='https://github.com/mizrael/OpenSleigh' target='_blank'>OpenSleigh</a> a while ago, I needed a way to find all the possible Messages.

The first and easiest way is through the <a href='https://docs.microsoft.com/en-us/dotnet/api/system.appdomain.getassemblies?view=net-6.0' target='_blank'>AppDomain.GetAssemblies()</a> method. It's quite fast and does its job. What's the issue though?
__Assemblies are lazy-loaded__. This means that if you call it during bootstrap and you haven't touched at least one type per Assembly (good luck with that...), you *might* have incomplete results.

Another option is to start from one Assembly, for example the one returned by <a href='https://docs.microsoft.com/en-us/dotnet/api/system.reflection.assembly.getentryassembly?view=net-6.0' target='_blank'>Assembly.GetEntryAssembly()</a>, and use a <a href='https://en.wikipedia.org/wiki/Breadth-first_search' target='_blank'>Breadth-First Search</a> to navigate the tree of referenced Assemblies.

Something like this should do the trick:

```csharp
var rootAssembly = Assembly.GetEntryAssembly();

var visited = new HashSet<string>();            
var queue = new Queue<Assembly>();

queue.Enqueue(rootAssembly);

while (queue.Any())
{
    var assembly = queue.Dequeue();
    visited.Add(assembly.FullName);

    var references = assembly.GetReferencedAssemblies();
    foreach(var reference in references)
    {
        if (!visited.Contains(reference.FullName))            
            queue.Enqueue(Assembly.Load(reference));
    }
    
    // do whatever you want with the current Assembly here...
}
```

It's quite off-the-books, but let's see what's going on here.

We start by fetching the root Assembly, then we allocate two collections:
- one HashSet to keep track of the visited Assemblies
- a Queue holding the Assemblies we haven't visited yet

Next step is to add the root Assembly to the Queue and start consuming it.
At each iteration we pull one Assembly, add it to the visited list and then pull all its references using <a href='https://docs.microsoft.com/en-us/dotnet/api/system.reflection.assembly.getreferencedassemblies' target='_blank'>GetReferencedAssemblies()</a>. This would return a collection of <a href='https://docs.microsoft.com/en-us/dotnet/api/system.reflection.assemblyname?view=net-6.0'>AssemblyName</a>, so we would have to call `Assembly.Load()` to retrieve the actual Assembly instance. Of course before we do that, we'd have to check if we've already "visited" it.

At this point we're free do whatever we have to do with the assembly and then we can keep processing the Queue.

That's it!