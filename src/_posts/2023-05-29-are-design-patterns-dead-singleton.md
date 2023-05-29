---
description: >
  In this post we'll talk about the Singleton pattern, why it can be useful and why we should avoid it instead.
id: 8033
title: 'Are design patterns dead? The Singleton problem'
date: 2023-05-29T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8033
permalink: /are-design-patterns-dead-singleton
image: /assets/uploads/2023/05/are-design-patterns-dead-singleton.jpg
categories:  
  - Software architecture
  - Design Patterns
  
---

Today we'll talk about another <a href='/are-design-patterns-dead' target='_blank'>Design Pattern</a>: the **Singleton**. I'm pretty much sure everyone knows what I am talking about, but just to be sure, let's do a quick recap.

The Singleton pattern guarantees that there is only one instance of a class throughout the application. This can be beneficial in scenarios where having multiple instances would be inappropriate or could lead to incorrect behavior, such as managing access to shared resources or coordinating access to a centralized system component.

Moreover, the Singleton pattern can be handy when working with legacy code that relies heavily on a global state or uses static methods extensively. By encapsulating the legacy code within a Singleton instance, you can introduce more modern patterns and gradually refactor the codebase. I'll probably blog more about this, but for now let's move on.

A very simple implementation in C# could be something like this:

```csharp
public class Foo
{
  private Foo() { }

  public static readonly Foo Instance = new Foo();
}
```

We marked the constructor private and added a `static readonly` member we can use to access the instance  of `Foo`. And all is well. The property is also initialized the very moment the class is accessed for the first time. Which might not be what we always want: suppose for example we are dynamically iterating over the classes in an assembly.
It might not necessarily be a problem, but what if the constructor is expensive? That would be another anti-pattern per se, but let's digress on that for the moment.

Let's start working on that:

```csharp
public class Foo
{
  private Foo() { }

  private static Foo _instance;
  public static Foo Instance 
  {
      get
      {
        if(_instance is null)
          _instance = new Foo();
        return _instance;
      }      
  }
}
```

We moved from a "regular" member to a fully fledged property. This way we avoid instantiating Foo immediately, which is good.
But now suppose that multiple threads are accessing `Instance` concurrently and it hasn't been initialized yet. It can potentially lead to race conditions and incorrect behavior.

Let's solve that too:

```csharp
public class Foo
{
  private Foo() { }

  private static object _lock = new();
  private static Foo _instance;
  public static Foo Instance 
  {
    get
    {
      if(_instance is null)
      {
        lock(_lock)
        {
          if(_instance is null)
            _instance = new Foo();
        }
      }
      return _instance;           
    }
  }
}
```
In this new snippet we use something called *"the double-checked locking"* pattern. We start by checking if we need to create the instance. If so, we enter our lock and check again. 

But why would you do that? Simple: suppose two threads A and B are accessing a non-instantiated Foo. They concurrently check if `_instance` is null and then they *try* to access the lock. The first one wins, and the second one is left waiting. Let's say that A wins.

This is what is going now to happen:
1. A checks (again) if `_instance` is null
1. it is, so A proceeds and creates the instance
1. at this point A exists the lock
1. B now enters the lock

But wait a second, A has already created the instance! Do you see now where this is going? Withoug that second null check, B would re-instantiate `_instance`.

And we could stop right here, but what if I told you that you can simplify the code **a lot** ? There you go:

```csharp
public class Foo
{
    private static readonly Lazy<Foo> _lazyInstance = new Lazy<Foo>(() => new Foo());

    private Foo() {}

    public static Foo Instance => _lazyInstance.Value;
}
```
The Lazy<T> class ensures lazy initialization and thread safety without the need for explicit locking or the potential issues associated with double-checked locking.
Neat isn't it? 

### Now that you know how to properly create a Singleton class, let's see why **you shouldn't**.

**Global State**: The Singleton pattern introduces a global state into the application, as there is only one instance of the class available throughout the system. This can make it difficult to manage dependencies and can lead to tight coupling between components, making the code less modular and harder to test.

**Testability**: Testing code that relies on a Singleton can be challenging. Singletons can introduce difficulties in unit testing, as they are not easily replaceable with mock or stub objects. This can make it harder to isolate and test components that depend on the Singleton instance. This was a big issue back in the days with `HttpContext.Current`.

**Subclassing**: the Singleton's constructor is private. Good luck trying to create subclasses from `Foo`.

**Tight Coupling**: Since Singleton instances are globally accessible, other components in the system may directly depend on the Singleton. This tight coupling can make the code more difficult to maintain and modify, as changes to the Singleton can have a ripple effect on other parts of the system.

Now, I understand there might be cases where you really need a single instance of a specific class. In those cases, I would strongly recommend learning how to use <a href='/is-dependency-injection-dead-part-1' target='_blank'>Dependency Injection</a> instead and register `Foo` properly in your DI container:

```csharp
services.AddSingleton<IFoo, Foo>();
```

This won't save you from all the headaches, as you still have to deal with the internal state, for example. But you'll get few nice things:
- more flexibility: now you can subclass or replace `Foo` with a different implementation of `IFoo`
- testability: you don't depend anymore on the "real" `Foo`, meaning that you can replace it with a fake implementation
- separation of concerns: consumers of `Foo` won't have to care anymore of its internals, they can rely on standard IoC and worry about other things.
