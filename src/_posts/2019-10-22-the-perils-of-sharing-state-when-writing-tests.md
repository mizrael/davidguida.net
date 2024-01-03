---
description: >
  what could happen if some classes are sharing state? What about tests instead? What can we do to mitigate?
id: 6862
title: The perils of sharing state when writing tests
date: 2019-10-22T09:30:23-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6862
permalink: /the-perils-of-sharing-state-when-writing-tests/
zakra_layout:
  - tg-site-layout--customizer
zakra_remove_content_margin:
  - "0"
zakra_transparent_header:
  - customizer
zakra_page_header:
  - "1"
zakra_logo:
  - "0"
dsq_thread_id:
  - "7686760400"
image: /assets/uploads/2019/10/sharing.jpg
categories:
  - .NET
  - Programming
  - Testing
tags:
  - programming
  - testing
---
Sharing state is always a bad idea. Functional programmers have been using immutability for a long time now, completely avoiding the perils this can bring.

For all the others that for one reason or another keep going on with the good ol' OOP, this is an hard lesson that needs to be learned. And sooner is the better.

Moreover, this is true for tests as well. They are a piece of software too, and as such they deserve the same care and respect we give to the rest of our applications.

### Let me say that again. Never. Share. State.

As usual Martin Fowler has <a rel="noreferrer noopener" aria-label="a nice article (opens in a new tab)" href="https://martinfowler.com/bliki/AliasingBug.html" target="_blank">a nice article</a> about references and immutable objects. Make sure to check it out, I'll wait.

Now let's go back to the tests problem. The standard setup for unit tests is to: 

  1. mock whatever dependencies your <a href="https://blogs.msdn.microsoft.com/ploeh/2008/10/06/naming-sut-test-variables/" target="_blank" rel="noreferrer noopener" aria-label="SUT (opens in a new tab)">SUT</a> has 
  2. configure them 
  3. instantiate the SUT
  4. test and assert

Now the problem lies in points 1 and 3. Well, **might** lie there.<figure class="wp-block-image alignwide">

<img src="https://i0.wp.com/www.ilmessaggero.it/photos/MED/84/49/4638449_1940_replicante.jpg?w=788&#038;ssl=1" alt="This image has an empty alt attribute; its file name is 4638449_1940_replicante.jpg" data-recalc-dims="1" /> <figcaption>I have seen things&#8230;</figcaption></figure> 

There are cases where you might be tempted to declare the SUT and its dependencies as class members. This will surely simplify the setup as you can initialize everything in the test class cTor.

It's tempting, I know. I've been there.

Maybe you want to get a step further and declare them as **static**. Why not, we're reusing them and we don't want to waste precious time instantiating stuff over and over.

Well if you do, keep in mind that those instances are shared, so every setup you do on the dependencies for example, will be reused by all the tests in that class.

Let's say for example that you're instructing a dependency to throw an exception in order to catch it in the SUT and handle it properly. You're asserting this in a test, but what all the other tests? They'll get the exception too.

I think you're starting to see the point here.

As usual, I've created a micro-repository showing the idea. You can <a rel="noreferrer noopener" aria-label="find it here (opens in a new tab)" href="https://github.com/mizrael/isolated-tests/" target="_blank">find it here</a>.

All in all this might seem a minor thing, but trust me, sooner or later you'll be in the situation where a test passes when executed alone and fails when you run all the suite. Now, **that** is a typical case of shared state. Keep an eye on the symptoms! 

Personally, I'm a great fan of [xUnit](https://xunit.net/). It has some very nice features, but this is one of my favorites (directly <a rel="noreferrer noopener" aria-label="from the docs (opens in a new tab)" href="https://xunit.net/docs/shared-context" target="_blank">from the docs</a>) :

<blockquote class="wp-block-quote">
  <p>
    "xUnit.net&nbsp;creates a new instance of the test class for every test that is run, so any code which is placed into the constructor of the test class will be run for every single test"
  </p>
</blockquote>

This will basically save you as it will create a fresh context for every test.

Now of course this doesn't apply much to persistence and integration tests. In that case you're **expecting** a db to be provisioned and accessible. But again, in that case it would be much better if you rely on a Fixture (or whatever your library of choice has).

A much better strategy would be to generate the db dynamically for each test and drop it at the end. If you're running on a CI/CD platform (like Gitlab or Travis), you can even spin up a Docker container with the db server. I might write a post one of these days and elaborate more.

Going back to the code, if you take a look at the <a rel="noreferrer noopener" aria-label="BetterTests class (opens in a new tab)" href="https://github.com/mizrael/isolated-tests/blob/master/tests/BetterTests.cs" target="_blank">BetterTests class</a> you'll see that I'm defining a static factory method for the SUT, but with a twist: it's accepting "configuration functions" as arguments. The factory method will instantiate the mock dependencies, then use those functions to configure them with whatever is passed from the consumers.

So in one case, we're building a dependency that throws, while in another we're just accepting the instance and nothing else.

Pretty neat, isn't it?

Don't forget to take a look at my series on <a href="https://www.davidguida.net/lets-do-some-ddd-with-entity-framework-core-3/" target="_blank" rel="noreferrer noopener" aria-label="DDD and Entity Framework Core (opens in a new tab)">DDD and Entity Framework Core</a>!

<div class="post-details-footer-widgets">
</div>