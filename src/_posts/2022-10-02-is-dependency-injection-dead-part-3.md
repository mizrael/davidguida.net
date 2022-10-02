---
description: >
  Is Dependency Injection dead? It's not! But let's see what "Service Lifetime" means and how many options we have when setting up our Dependency Injection container.
id: 8026
title: 'Is Dependency Injection dead? - Part 3: Anti-Patterns'
date: 2022-07-15T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8026
permalink: /is-dependency-injection-dead-part-3-anti-patterns
image: /assets/uploads/2022/10/is-dependency-injection-dead-part-3-anti-patterns.jpg
categories:  
  - Design Patterns
  - Software Architecture
---

Welcome back to the third part of the **Dependency Injection** series! <a href='/is-dependency-injection-dead-part-2-service-lifetimes' target='_blank'>Last time</a> we talked about Services registration and lifetime configuration.

Today instead we'll see 2 very common anti-patterns in DI world.

Let's start from the basics. The first anti-pattern is called *Control Freak*. Let's see some code first:
```csharp
public class Foo {
    private Bar _baz;

    public Foo() {
        _baz = new Bar();
    }
}
```

What do you see there? Well, there are a few things here that make my skin crawl:

- no dependencies are injected
- class members are instantiated directly
- no use of abstractions

What does it mean for us? Well, it's easy to say: `Foo` is a *Control Freak*. 

### It has absolute control over its own dependencies, which means that we can't switch from one `Bar` implementation to another unless we update the code directly.

Imagine that `Bar` is a Repository pulling data from a SQL DB. What if we need to move to MongoDB instead? You could argue that only `Foo` needs to be changed. Fine. What if I tell you that if you use a Repository in a single place, probably you don't need DI altogether? In big projects, it is extremely rare that a Repository instance is used in a single place. If all the references are *Control Freaks* then you're going to have a hard time for sure.

Moreover, unit testing `Foo` is very hard. You can't mock `Bar`
and if it talks to external resources, every test will try to access them.

Let's now move to the second anti-pattern, the *Service Locator*:

```csharp
public class Foo {
    private IBar _baz;

    public Foo(IServiceLocator locator) {
        _baz = locator.GetService<IBar>();
    }
}
```

at first might look like a good idea. I mean, you're asking a service to find and instantiate for you an implementation of `IBar`. It looks DI-ish, right ?

Well... nope. Let's see what's wrong with it. First of all, it doesn't communicate clearly what are the dependencies for `Foo`. Which means that unless you inspect the class sources, you will never have a clue of how it actually works. 

But let's get to the juicy part: if you forget to register an implementation for `IBar` in your Composition Root, you get a runtime exception.

Things will only get worse if by any chance the Service Locator instance is static and therefore not injected:

```csharp
public static ServiceLocator
{
    public static ServiceLocator Instance;
}

public class Foo {
    public Foo() {
        _baz = ServiceLocator.Instance.GetService<IBar>();
    }
}
```
You will have no idea of what dependencies `Foo` needs, neither Visual Studio will (probably). 
Which also means that you'll never get build errors if the hidden dependencies change for any reason. It's a slippery road to 

Last but not least, unit testing now is just way harder because you're relying on a static class, which means that it's internal state is shared between all the tests you're running. And that is <a href='/the-perils-of-sharing-state-when-writing-tests/'> very bad</a>.

Let's see another anti-pattern now, the *Fat class*:
```csharp
public class Foo {
  public Foo(IBar bar, IBaz baz, IDee dee, IGee gee, IMeh meh){
    // do something with all of that 
  }
}
```



That's all for today! Next time we will continue talking about <a href='/are-design-patterns-dead'>Design Patterns</a> and see more real-world scenarios.

Ciao!