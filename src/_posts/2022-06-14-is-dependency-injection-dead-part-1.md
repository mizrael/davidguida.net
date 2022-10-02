---
description: >
  Is Dependency Injection really dead? Can we bring it back to life by getting a real understanding of how it actually works?
id: 8024
title: 'Is Dependency Injection dead? - Part 1'
date: 2022-06-14T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8024
permalink: /is-dependency-injection-dead-part-1
image: /assets/uploads/2022/06/is-dependency-injection-dead-part-1.jpg
categories:  
  - Design Patterns
  - Software Architecture
---

**TLDR:** No, of course, it's not dead. But you've been probably using it wrong this whole time.

### Slightly longer version:

<a href='/are-design-patterns-dead' target='_blank'>Last time</a> I wrote about the general decline of Design Patterns among software engineers and how I feel about it. 

Today we're going to talk about **Dependency Injection**, one of the fundamental patterns that every engineer must understand. It's one of the keys to clean, reusable and testable code.

Now, in .NET we are somewhat "spoiled" since the framework is kind enough to come with pre-baked support for it. 
This leads to a long list of developers who are mistreating and misusing their Startup.cs files, or whatever is their <a href='https://freecontent.manning.com/dependency-injection-in-net-2nd-edition-understanding-the-composition-root/' target='_blank'>Composition Root</a>, by registering services over services without a real understanding of what *service lifetime* means.

So, let's start from the very beginning. **Dependency Injection** is a very elegant way to achieve something called *Inversion of Control* ( *IoC* from this moment on). We are basically trying to:
- avoid instantiating things on our own as much as possible
- <a href='https://stackoverflow.com/questions/2697783/what-does-program-to-interfaces-not-implementations-mean' target='_blank'>code against interfaces</a> and not implementations

In programming terms, we are trying to avoid doing this:

```csharp
public class Foo
{
  public void DoSomething()
  {
    var bar = new Bar(); // this is bad!
    // use bar to do something
  }
}
```

And do this instead:
```csharp
public interface IBar { }

public class Foo
{
  public void DoSomething(IBar bar) // this is good!
  {
    // use bar to do something
  }
}
```

What I just showed there is called *Method Injection*, it's the easiest form possible of Dependency injection. Notice also how I'm using an interface instead of providing the actual implementation. More on this later.

### In a nutshell, we are separating the *usage* of an object from its *instantiation*.

Another form is called *Property Injection*, which is used (guess what) to inject an instance of something into another object via a property. It's normally used in extreme cases (eg. when refactoring legacy code) and should be avoided as much as possible, so I won't be talking much about it.

The last form is *Construction Injection*. We start from this:

```csharp
public class Foo
{
  private Bar _bar;
  
  public Foo()
  {
    _bar = new Bar(); // this is bad!
  }
}
```

But what we want is actually this:

```csharp
public interface IBar { }

public class Foo{
  private IBar _bar;

  public Foo(IBar bar){
    _bar = bar; // this is good!
  }
}
```

But who is in charge of creating the actual instance? Here comes the *Container*. During the application bootstrap, in our Composition Root, we configure all our services, mapping the implementations to their interfaces (or <a href='https://blog.ploeh.dk/2012/08/31/ConcreteDependencies/' target='_blank'>maybe not</a>). 

At this point, the IoC Container is able to build a complete map of who-depends-on-what, so that every time we need something, all we have to do is just ask for it:

```csharp
public interface IBar { }
public interface IFoo { }

public class Foo : IFoo {
  public Foo(IBar bar){ ... }
}

IFoo myFoo = container.GetService<IFoo>();
```
The container will locate the registered implementation for `IFoo`, then will traverse the graph starting from it, looking recursively for all the dependencies. And their dependencies. And their dependencies. And you don't have to worry about it.

So why do we want to use Dependency Injection? Let's play a game. Suppose you are working on some application and you need to add logging.
You pick a random library that you like and you start instantiating it in every class where you have to log something.

No interfaces, straight calls to `new FileLogger()`.

Now, suppose that at some point in time something happens and you can't log to files anymore. Maybe your infrastructure requirements changed. Maybe there are <a href='https://resources.infosecinstitute.com/topic/log4j-vulnerability-explained/' target='_blank'>security concerns</a>. Maybe the library just got deprecated.

### Anyways, all of a sudden, you have to update your entire codebase and get rid of those calls.

With Dependency Injection instead, all you do is configure your container **once**.

Moreover, if you don't want to log anything during tests, you can just create <a href='https://nsubstitute.github.io/' target='_blank'>a mock logger</a> and get away with it. Great, innit?

Let me stop here for today. <a href='/is-dependency-injection-dead-part-2-service-lifetimes' target='_blank'>Next time</a> we'll get more into the rabbit hole and talk about service lifetimes.

Ciao!