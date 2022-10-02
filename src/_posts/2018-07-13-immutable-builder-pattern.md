---
id: 6486
title: Immutable Builder Pattern
date: 2018-07-13T12:57:32-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6486
permalink: /immutable-builder-pattern/
image: /assets/uploads/2016/02/software_architecture-e1455751845413.jpg
categories:
  - .NET
  - Programming
  - Ramblings
  - Software Architecture
---
This time we&#8217;ll talk about the Immutable&nbsp;<a href="https://en.wikipedia.org/wiki/Builder_pattern" target="_blank" rel="noopener noreferrer">Builder Pattern</a>, but with a twist: the resulting instance has to be immutable.

From time to time I need to move away from the routine, just to avoid getting bored. Also, taking short breaks might help viewing things under a different perspective. Anyways, while working on <a href="https://www.davidguida.net/static-website-is-better/" target="_blank" rel="noopener noreferrer">Statifier</a>&nbsp;I felt the need to get back to the roots and dive a little bit into&nbsp;the Design Patterns World &#x2122; .

Straight from Wikipedia:

<blockquote class="wp-block-quote">
  <p>
    &#8220;the intent of the Builder design pattern is to&nbsp;<a title="Separation of concerns" href="https://en.wikipedia.org/wiki/Separation_of_concerns">separate</a>&nbsp;the construction of a complex object from its representation&#8221;
  </p>
</blockquote>

This pattern is indeed extremely useful when you have to create an instance of a complex class, eg. with a long list of properties that have to be initialized.

It can be confused sometimes with the <a href="https://en.wikipedia.org/wiki/Abstract_factory_pattern" target="_blank" rel="noopener noreferrer">Factory pattern</a>, but there&#8217;s a very important difference: Factories can be used to create an object instance based on some rules and return an **interface**. The result will be **any concrete implementation** of that interface, but consumers won&#8217;t (and don&#8217;t need to ) know which one.

Builders instead know how to create a **single, specific class&nbsp;**and the result is exactly an instance of that class.

And why should I be using the Builder if it can create just one thing? Well maybe because the creation is complex and requires several steps. Maybe you cannot just do something like builder.Build(param1, param2&#8230;..) , but you need a more structured approach.

The Wikipedia page has already some <a href="https://en.wikipedia.org/wiki/Builder_pattern#C#" target="_blank" rel="noopener noreferrer">good examples</a> of how the pattern can be implemented so I won&#8217;t talk much about that.&nbsp;

But what is immutability anyway? Why do I need it?

At its core, immutability is a simple, very important concept: don&#8217;t let anyone from the outside update the internal state of your objects. That&#8217;s it.

Coding-wise, it translates basically into classes with no setters at all. All the properties will be initialized in the cTor, along with all the dependencies.

And why should I use it? Here&#8217;s <a href="http://wiki.c2.com/?ValueObjectsShouldBeImmutable" target="_blank" rel="noopener noreferrer">an excellent article</a> by Martin Fowler (yeah I love quoting him). Take your time, I&#8217;ll wait.

Ok so now let&#8217;s get back to out Builder. Here&#8217;s a sample implementation:

Few points to note:

  1. Vehicle cTor is private. Only the Builder can create an instance, and this is the main reason why the Builder class is declare&nbsp;**inside** the Vehicle class.
  2. all properties on Vehicle are get-only. Internal state cannot be changed, immutability is ensured. Good luck changing them.
  3. every call to Build() creates a new instance of Vehicle. This is again made to ensure immutability but comes with a twist: you have to be more careful if you want to&nbsp;**reuse** an instance of the builder to create more vehicles. You&#8217;ve been warned.

<div class="post-details-footer-widgets">
</div>