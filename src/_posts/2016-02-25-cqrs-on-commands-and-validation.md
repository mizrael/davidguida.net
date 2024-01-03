---
id: 6136
title: 'CQRS: on Commands and Validation &#8211; part 1: introduction'
date: 2016-02-25T18:47:03-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6136
permalink: /cqrs-on-commands-and-validation/
dsq_thread_id:
  - "5146008397"
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
image: /assets/uploads/2016/02/software_architecture-e1455751845413.jpg
categories:
  - .NET
  - ASP.NET
  - MVC
  - Programming
  - Ramblings
  - Software Architecture
  - Testing
  - WebAPI
---

Let’s have a quick discussion about <a href="http://martinfowler.com/bliki/CQRS.html" target="_blank" rel="noopener noreferrer">CQRS</a>. There’s a lot to say to be honest, so let’s try to focus on just one thing today: validating your Commands (who knows, I could start a series after this, we’ll see).

The idea is simple: how can I make sure that the data I am passing to my Command Handler is valid?

Also, what is the definition of “valid” ?

There are several aspect to take in consideration, several “levels” of validation. I could just make sure the Command object is not null and/or the data it contains is not empty. Or I could run the validation against some kind of context and check the application Business Rules.

As you can imagine, having different levels means that we could have different implementations scattered in various places/layers of our architecture. For example I could have the API Controller (or whatever outmost layer you have) check for null and perform some Business Context validation later, before or directly in the Command Handler.

In my last project however, I decided to keep things simple and keep my validation in just one place.

Initially the right spot was the Command Handler itself, but of course this would have violated the <a href="https://en.wikipedia.org/wiki/Single_responsibility_principle" target="_blank" rel="noopener noreferrer">SRP</a>.

A quick and immediate solution was to have a separate instance of a IValidator<TCommand> injected in the handler. Easy.

Then I realised that my handlers are more “close to the metal” than expected: in most of the cases they access directly the DAL (passing through some kind of IDbContext) and I didn’t wanted to rewrite the call to the IValidator in case I had to switch the persistence layer.

Luckily enough, there’s a nice pattern that came into rescue: the <a href="http://martinfowler.com/bliki/DecoratedCommand.html" target="_blank" rel="noopener noreferrer">Decorator</a>! As explained very clearly on the <a href="http://simpleinjector.readthedocs.org/en/latest/advanced.html#decorators" target="_blank" rel="noopener noreferrer">SimpleInjector docs</a>, you can create a <span class="s1">ValidationCommandHandlerDecorator</span> class, inject an IValidator<TCommand> and let your IoC do the rest.

Maaaaagic.

Bonus tip: in some cases you may want to skip completely the validation. Maybe you have a very good reason or maybe you’re just lazy. Whatever.

In this case, all you have to do is to write some kind of NullValidator<TCommand> class and instruct your IoC to use it when a specific validator is missing for that Command.

The <a href="https://www.davidguida.net/cqrs-on-commands-and-validation-part-2-the-base-handler/" target="_blank" rel="noreferrer noopener">next time</a> we'll take a different approach and see some code as well.