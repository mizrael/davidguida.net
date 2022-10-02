---
id: 8016
title: DI-Friendly Factory Pattern
description: >
 In this article we'll see what the Factory Pattern is, what problem it solves and one small variation that makes it Dependency Injection - friendly.
date: 2021-10-01T00:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8016
permalink: /di-friendly-factory-pattern/
image: /assets/uploads/2021/10/di-friendly-factory-pattern.jpg
tags:
  - .NET
  - Design Patterns
  - Software Architecture
  - C#
  - .NET Core
---

I've finally decided to start blogging again after <a href="/coming-back-to-life/" target="_blank">a not-so-brief</a> interruption. I wanted to start slowly, from something I'm fairly comfortable with: **Design Patterns**.

But I don't want to blog about eye candies, unicorns and rainbows. 

### I'd like to showcase things that you might encounter in the *real* world, on *real* applications. 

So for this first article, we'll see what a *Factory* is and an interesting twist that will make it **Dependency Injection - friendly**.

The **Factory Pattern** is one of the Creational patterns explained in the amazing <a href="https://en.wikipedia.org/wiki/Design_Patterns" target="_blank">Gang-of-Four book</a> that every software engineer should have next to their bed. Quoting:

> "Define an interface for creating an object, but let subclasses decide which class to instantiate. The Factory method lets a class defer instantiation it uses to subclasses."

Let's see a simple example in action:

<script src="https://gist.github.com/mizrael/e61a8261bd5e87e23b4eb5e816637946.js"></script>

We basically define a common interface, `IShapeRenderer` and defer to our `IShapeRendererFactory` implementation the burden of providing the right instance based on some input parameter. 

Plain and easy.

Now, what's the problem with this? *Dependencies*. This Factory assumes that every `IShapeRenderer` implementation takes no dependencies and has a very simple instantiation mechanism.

If this is your case, then you are free to stop reading here.

One option to solve this is to simply inject **all** the dependencies we need in the Factory itself:

<script src="https://gist.github.com/mizrael/c365b9a2c1566756d67570b5d90afa96.js"></script>

Now, this works fine and potentially solves all your problems. If the number of dependencies is low, I would call it a day.
Although to be fair, I'm not a real fan of this approach. Code tends to evolve organically, especially when multiple devs are working on a project.
Moreover, you might incur into some issues with the different lifetimes of your dependencies. And trust me, you don't want to deal with that.

One possible solution is to inject *individual mini-factories* into the main Factory and use a quick dictionary lookup to find and consume the right one:

<script src="https://gist.github.com/mizrael/c021e8dfa0d94de092b7e67e1b85f7a7.js"></script>

### It's all about flexibility.

This approach is simple to write, fits nicely into the DI Container and allows using any kind of lifetime you want for each individual implementation.

On the other hand though, this can become a nightmare very quickly the very moment we start polluting our Composition Root with multiple Factories or complex logics. One option in this case could be to create an extension method on `IServiceCollection` in a separate class and move the Factory registration there. 

Ciao!