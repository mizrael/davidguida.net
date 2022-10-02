---
description: >
  Hi All! Today we're going to explore few ways to perform "dynamic method invocation" with .NET Core.
id: 7973
title: Dynamic method invocation with .NET Core
date: 2021-02-05T15:12:19-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7973
permalink: /dynamic-method-invocation-with-net-core/
image: /assets/uploads/2021/02/Dynamic-method-invocation-with-.NET-Core.jpg
categories:
  - .NET
  - Programming
tags:
  - .NET
  - .NET Core
  - programming
  - tips
---
Hi All! Today we're going to explore few ways to perform "_dynamic method invocation_" with .NET Core.

As some of you know already, a while ago I started working on an open-source project, <a href="https://www.davidguida.net/opensleigh-a-saga-management-library-for-net-core/" target="_blank" rel="noreferrer noopener">OpenSleigh</a>. It's a Saga management library for .NET Core applications.

I have been focusing on it a lot in the last period, and this, unfortunately, led me to be less diligent with my blog. I have several articles in my backlog, looking for the right time to jump off the hat.

Anyways, while working on the first prototypes of OpenSleigh (BTW, make sure to at least fork or star <a href="https://github.com/mizrael/OpenSleigh" target="_blank" rel="noreferrer noopener">the repository</a>!), I had to face a bunch of times an interesting problem. 

Let me try to summarize it very quickly:

### What if we have to call a method on some instance, but the only thing we know is the method signature and not the class type?

It's a tricky situation, but luckily for us, .NET has a few ways to get to the destination.

The problem now is: which one is the best?

So I decided to give it a try and write some benchmarks. I've tested:

  1. direct method invocation
  2. <a href="https://docs.microsoft.com/en-us/dotnet/api/system.reflection.methodinfo.invoke?view=netframework-1.1&WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">MethodInfo.Invoke</a>
  3. <a href="https://docs.microsoft.com/en-us/dotnet/api/system.delegate.dynamicinvoke?view=net-5.0&WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Delegate.DynamicInvoke</a>
  4. <a href="https://docs.microsoft.com/en-us/dotnet/api/system.func-1?view=net-5.0&WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Func<></a> invocation
  5. <a href="https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/types/using-type-dynamic?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">dynamic </a>cast

Of course, _direct method invocation_ is used as a comparison, a baseline for all the other techniques.

Let's suppose we have this small class here:

```csharp
public class Foo
{
    public int Bar(int a, int b, bool c) => a + (c ? b : 0);
}
```

And we want to call _Bar()_ on an instance, but all we have is an _object._ Let's take a look at each technique.

#### MethodInfo.Invoke

We simply start by storing a _MethodInfo_ reference to _Bar()_ and then we simply invoke it:

```csharp
object fooInstance = ...; // we get this from somewhere else
MethodInfo barMethod = ClassType.GetMethod(nameof(Foo.Bar));
barMethod.Invoke(fooInstance, new[] { (object)1, (object)2, (object)false });
```

#### Delegate.DynamicInvoke

In this case, instead, we start off by getting a _MethodInfo_ reference, but we wrap it into a typed _Delegate_:

```csharp
object fooInstance = ...; // we get this from somewhere else
MethodInfo barMethod = ClassType.GetMethod(nameof(Foo.Bar));
var delegateType = Expression.GetDelegateType(typeof(Foo), typeof(int), typeof(int), typeof(bool), typeof(int));
var @delegate = Delegate.CreateDelegate(delegateType, barMethod);
@delegate.DynamicInvoke(new[] { fooInstance, (object)1, (object)2, (object)false });
```

#### Func<> invocation

Similar to the previous one, but we also cast the _Delegate_ to a _Func<>_:

```csharp
object fooInstance = ...; // we get this from somewhere else
MethodInfo barMethod = ClassType.GetMethod(nameof(Foo.Bar));
var delegateType = Expression.GetDelegateType(typeof(Foo), typeof(int), typeof(int), typeof(bool), typeof(int));
var func = (Func&lt;Foo, int, int, bool, int>)Delegate.CreateDelegate(delegateType, barMethod);
func(fooInstance as Foo, 1, 2, false);
```

This one seems a little bit "shady", since we actually know that the instance is of type _Foo._ But still, I decided to add it to the group since it might still come useful.

#### Dynamic cast

This one is the easiest to code (after the direct invocation of course), as it's basically just a cast to _dynamic_ and a method call:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">object fooInstance = ...; // we get this from somewhere else
dynamic dynamicFoo = fooInstance as dynamic;
dynamicFoo.Bar(1, 2, false);</pre>

So, after all this fuss, who's the winner? I guess an image is worth thousand words:<figure class="wp-block-image">

<img src="https://raw.githubusercontent.com/mizrael/BenchmarkDynamicInvocation/main/benchmark.png"  alt="dynamic method invocation" title="dynamic method invocation"/> 

So as you can see, calling a method directly, is definitely the fastest way. Followed immediately by the "shady" _Func<>_ call and then the _dynamic_ cast.

As usual, I've pushed the <a href="https://github.com/mizrael/BenchmarkDynamicInvocation" target="_blank" rel="noreferrer noopener">code to GitHub</a>, so feel free to run your experiments and let me know!