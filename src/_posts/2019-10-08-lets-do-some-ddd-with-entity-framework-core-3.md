---
description: >
  let's explore some of the new features of Entity Famework Core 3 and see how we can apply DDD with Persistence Ignorance
id: 6743
title: "Let's do some DDD with Entity Framework!"
date: 2019-10-08T10:01:34-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6743
permalink: /lets-do-some-ddd-with-entity-framework-core-3/
dsq_thread_id:
  - "7667470290"
image: /assets/uploads/2018/01/Entity-Framework-Logo_2colors_Square_RGB-591x360.png
categories:
  - .NET
  - Design Patterns
  - EntityFramework
  - Programming
  - Software Architecture
tags:
  - .NET Core
  - DDD
  - programming
---
Few days ago Microsoft released **Entity Framework Core 3**, introducing a <a rel="noreferrer noopener" aria-label="lot of improvements (opens in a new tab)" href="https://devblogs.microsoft.com/dotnet/announcing-ef-core-3-0-and-ef-6-3-general-availability/" target="_blank">lot of improvements</a> in both functionalities and performance ( and some breaking change as well).

#### Now we have full support for very cool stuff like C# 8, Async Enumerables, plus a brand new LINQ provider.

I'm using a lot **Entity Framework** in my daily job but of course before upgrading a project &#8216;s dependency to a mayor version there's always some testing to do.

As I often do, I decided to write a small demo and try out some of these new functionalities. You can find the all sources <a rel="noreferrer noopener" aria-label="available on GitHub (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo" target="_blank">available on GitHub</a>.

My goal for this project was to model a bunch of <a href="https://lostechies.com/jimmybogard/2008/05/21/entities-value-objects-aggregates-and-roots/" target="_blank" rel="noreferrer noopener" aria-label=" (opens in a new tab)">Aggregates and Value Objects</a> with proper <a rel="noreferrer noopener" aria-label=" (opens in a new tab)" href="https://deviq.com/persistence-ignorance/" target="_blank">Persistence Ignorance</a>, eg: I don't want to pollute my business logic classes with code responsible of storing and retrieving data.

Luckily **Entity Framework** **Core** offers the possibility to configure the Entity/Table mapping using a nice <a href="https://martinfowler.com/bliki/FluentInterface.html" target="_blank" rel="noreferrer noopener" aria-label=" (opens in a new tab)">Fluent Interface</a> , avoiding attributes on our properties.

We have basically two options. First one is to write all the configuration code in the <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontext.onmodelcreating?view=efcore-2.1#Microsoft_EntityFrameworkCore_DbContext_OnModelCreating_Microsoft_EntityFrameworkCore_ModelBuilder_" target="_blank" rel="noreferrer noopener" aria-label="OnModelCreating() (opens in a new tab)">OnModelCreating()</a> method of our DbContext. Quick and easy, but leads to a lot of very confused code.

A much cleaner option is to use the <a rel="noreferrer noopener" aria-label="IEntityTypeConfiguration<>" href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.ientitytypeconfiguration-1?view=efcore-2.1" target="_blank">IEntityTypeConfiguration<></a> interface. With it we can separate the configuration for each Entity and have a much cleaner structure.

Using this second option, I modeled a very simple eCommerce scenario with Products, Quotes and Orders. These last two Entities also hold one-to-many relationships with Quote Items and Order Lines respectively.

When you run the application the first time, it will generate the db, which looks like this:<figure class="wp-block-image alignwide">

<a href="/assets/uploads/2019/10/image-2.png?ssl=1" target="_blank" rel="noreferrer noopener"><img loading="lazy" width="788" height="632" src="/assets/uploads/2019/10/image-2.png?resize=788%2C632&#038;ssl=1" alt="" class="wp-image-6801" srcset="/assets/uploads/2019/10/image-2.png?w=924&ssl=1 924w, /assets/uploads/2019/10/image-2.png?resize=300%2C241&ssl=1 300w, /assets/uploads/2019/10/image-2.png?resize=768%2C616&ssl=1 768w, /assets/uploads/2019/10/image-2.png?resize=788%2C632&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a><figcaption>database diagram generated with [https://sqldbm.com](https://sqldbm.com/) </figcaption></figure> 

Then the code will:

  1. create some products
  2. add just one product to a quote and save it
  3. update the quote adding another product
  4. create an order from that quote
  5. add another product to the quote
  6. create another order from the quote<figure class="wp-block-image alignwide">

<a href="/assets/uploads/2019/10/image.png?ssl=1" target="_blank" rel="noreferrer noopener"><img loading="lazy" width="788" height="308" src="/assets/uploads/2019/10/image.png?resize=788%2C308&#038;ssl=1" alt="" class="wp-image-6797" srcset="/assets/uploads/2019/10/image.png?w=912&ssl=1 912w, /assets/uploads/2019/10/image.png?resize=300%2C117&ssl=1 300w, /assets/uploads/2019/10/image.png?resize=768%2C301&ssl=1 768w, /assets/uploads/2019/10/image.png?resize=788%2C308&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a></figure> 

<a href="https://www.davidguida.net/lets-do-some-ddd-with-entity-framework-core-3-part-2-lets-see-some-code/" target="_blank" rel="noreferrer noopener" aria-label="In the next post (opens in a new tab)">In the next post</a> we're going to take a look at the code and talk about each Entity configuration. Stay tuned!

<div class="post-details-footer-widgets">
</div>
