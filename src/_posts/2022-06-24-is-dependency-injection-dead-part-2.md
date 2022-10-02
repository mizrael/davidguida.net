---
description: >
  Is Dependency Injection dead? It's not! But let's see what "Service Lifetime" means and how many options we have when setting up our Dependency Injection container.
id: 8025
title: 'Is Dependency Injection dead? - Part 2: Service Lifetimes'
date: 2022-07-15T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8025
permalink: /is-dependency-injection-dead-part-2-service-lifetimes
image: /assets/uploads/2022/07/is-dependency-injection-dead-part-2-service-lifetimes.jpg
categories:  
  - Design Patterns
  - Software Architecture
---

Welcome back to the second part of the **Dependency Injection** series! <a href='/is-dependency-injection-dead-part-1' target='_blank'>Last time</a> we saw what DI is and why it helps us write more maintainable, robust and testable code.

Today we'll keep talking about it, and we'll see what *service lifetimes* are.

### In a nutshell, a *lifetime* defines how frequently and under which conditions a service is instantiated.

Let's imagine this scenario: you have an Azure Function App exposing some HTTP endpoints and at some point in time you receive a request on one of them. The Function starts and it has one or two dependencies. Your DI Container triggers, does *some magic* and returns the service to the Function.

But we are curious people and don't really like *magic*. Unfortunately, we won't be going too down the rabbit hole in this case, but we can answer a question: is the DI Container creating a new instance of the requested service every time?

The answer is...**depends**. Depends on you. Well, most of the time, at least.

If you remember from the previous article, we need to configure our DI Container during application bootstrap. This is usually done in the <a href='https://freecontent.manning.com/dependency-injection-in-net-2nd-edition-understanding-the-composition-root/' target='_blank'>Composition Root</a>. Now we'll see what "configuring" means, and we'll start with one of the most common lifetimes available: *Transient*.

In .NET it normally looks like this:

```csharp
services.AddTransient<IFoo, Foo>();
```

We are basically telling our container to create a new instance of `Foo` every time a class has a dependency on `IFoo`. 

### And I mean it: in this particular case, *Transient* lifetime means that the implementation will be instantiated on every request.

The other very common lifetime is *Singleton*:
```csharp
services.AddSingleton<IBar, Bar>();
```
Guess what: `Bar` will be instantiated the first time `IBar` is requested, and that instance will be alive till the application is shut down. Let me reiterate on this: the **same instance** will be returned **every time**. 

### This is crucial, especially when you're storing some state in it.

Indeed, if your `Bar` instance is holding some state, every class depending on `IBar` has virtually the power to alter that state. And this might not exactly be what you want. 

On the other hand, this might be instead the desired behaviour, for example in case you're doing some in-memory caching.

There is another potential lifetime, and it's called *Scoped*:
```csharp
services.AddScoped<IBaz, Baz>();
```
This is a funny one. It's not used as much as the other two but has an interesting behaviour, kind of the middle between them.

Let's try with an example.

One very common scenario for a *Scoped* service is during an HTTP request.
At the very beginning, the application creates a DI Scope. At this point, if a *Scoped* service is required, our container will create an instance of it and keep it alive for the entire scope ( => the duration of the HTTP request). Like a Singleton.

However, scopes are tied to the HTTP request that initiated it, which means that you'll get a new scope per request. And this means that `Baz` will be instantiated in every scope. Like a Transient.

That's all for today! Next time we will see some more use cases and talk a bit about some DI anti-patterns.

Ciao!