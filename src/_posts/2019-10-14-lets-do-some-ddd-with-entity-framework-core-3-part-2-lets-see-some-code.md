---
description: >
  In this article we're going to take a look at how we can start modeling our classes and express our Domain and store our data using Entity Framework.
id: 6823
title: "Let's do some DDD with Entity Framework - part 2: let's see some code!"
date: 2019-10-14T09:30:06-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6823
permalink: /lets-do-some-ddd-with-entity-framework-core-3-part-2-lets-see-some-code/
image: /assets/uploads/2018/01/Entity-Framework-Logo_2colors_Square_RGB-591x360.png
categories:
  - .NET
  - Design Patterns
  - Programming
  - Software Architecture
tags:
  - .NET Core
  - DDD
  - programming
---
<a rel="noreferrer noopener" aria-label="Last time (opens in a new tab)" href="/lets-do-some-ddd-with-entity-framework-core-3/" target="_blank">Last time</a> I talked a bit about **Entity Framework** and introduced the small demo I wrote to test the new features. Now let's see some code!

I took the liberty to update the <a rel="noreferrer noopener" aria-label="repository on GitHub (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo" target="_blank">repository on GitHub</a> and split it into two projects. **Example 1** is just a simple console app, while **Example 2** shows more or less the same code but in a Web API envelope.

Let's start with Example 1 then. The **<a rel="noreferrer noopener" aria-label=" (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo/tree/master/EFCoreCommerceDemo.Example1/EFCoreCommerceDemo.Example1/Models" target="_blank">Models</a>** <a rel="noreferrer noopener" aria-label=" (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo/tree/master/EFCoreCommerceDemo.Example1/EFCoreCommerceDemo.Example1/Models" target="_blank">folder</a> contains the juice of the project. This is the first place to start putting your classes when you want to do some DDD. Of course you need a somewhat clear understanding of the Domain, otherwise you'll surely end up with a <a rel="noreferrer noopener" aria-label="big-ball-of-mud (opens in a new tab)" href="https://en.wikipedia.org/wiki/Big_ball_of_mud" target="_blank">big-ball-of-mud</a>.

#### Using TDD in this case might help: if your knowledge of the Domain is lacking or you don't have yet a complete idea of the final design, writing tests first will give you the proper hints and point you in the right direction.

Or at least will make you ask the right questions.

Going back to the code, here we have 5 classes, modeling a simple eCommerce scenario:

  * Product: nothing fancy, no methods. More or less an "<a rel="noreferrer noopener" aria-label=" (opens in a new tab)" href="https://martinfowler.com/bliki/AnemicDomainModel.html" target="_blank">anemic model</a>". It is an Entity and <a rel="noreferrer noopener" href="https://martinfowler.com/bliki/DDD_Aggregate.html" target="_blank">Aggregate root</a>.
  * Quote: here things get interesting. Holds a list of QuoteItems and an AddProduct() method. This one will check for null and add it to the bucket. Then we have a Total property that computes the&#8230;well, total price. Quote is an Entity and Aggregate root.  
    QuoteItems is modeled as <a href="https://martinfowler.com/bliki/ValueObject.html" target="_blank" rel="noreferrer noopener" aria-label=" (opens in a new tab)">Value Object</a> instead, although in a more complex scenario should be considered as an Entity on its own.
  * Order: more or less as Quote, it's an Entity and Aggregate root. It also holds a collection of products, OrderLines in this case. However, there's no way to update the list as it gets populated at order creation. If you think about it, makes kinda sense: once you've placed an order, you cannot add more items. Again, here as well we have the Total property.  
    OrderLine is a Value Object like QuoteItem.

Almost all the classes have a private parameterless constructor. That's **the only concession** we have to do to Entity Framework Core: it is needed in order to serialize back and forth the instance as it might not be possible to call the other one. 

The <a href="https://github.com/mizrael/EFCoreCommerceDemo/blob/master/EFCoreCommerceDemo.Example1/EFCoreCommerceDemo.Example1/Models/Product.cs" target="_blank" rel="noreferrer noopener" aria-label="Product class (opens in a new tab)">Product class</a> is the only one that doesn't have a parameterless cTor. That's because its cTor arguments are mapping to all the properties exposed from the class (names included).

As you can see, there's no persistence-related code here: these classes are "just" modeling our domain and expressing our business needs, nothing more. 

Persistence instead is handled by our <a rel="noreferrer noopener" aria-label=" (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo/blob/master/EFCoreCommerceDemo.Example1/EFCoreCommerceDemo.Example1/Infrastructure/CommerceDbContext.cs" target="_blank">CommerceDbContext</a> class in the Infrastructure folder. All the mapping is expressed using model-specific implementations of the <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.ientitytypeconfiguration-1?view=efcore-2.1" target="_blank" rel="noreferrer noopener" aria-label=" (opens in a new tab)">IEntityTypeConfiguration</a> interface.

The <a rel="noreferrer noopener" aria-label="QuoteEntityTypeConfiguration (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo/blob/master/EFCoreCommerceDemo.Example1/EFCoreCommerceDemo.Example1/Infrastructure/QuoteEntityTypeConfiguration.cs" target="_blank">QuoteEntityTypeConfiguration</a> and <a rel="noreferrer noopener" aria-label=" (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo/blob/master/EFCoreCommerceDemo.Example1/EFCoreCommerceDemo.Example1/Infrastructure/OrderEntityTypeConfiguration.cs" target="_blank">OrderEntityTypeConfiguration</a> classes are very similar and quite interesting. As you can see we're ignoring the Total property as it's computed dynamically. Also, the QuoteItems and OrderLines are handled as <a rel="noreferrer noopener" aria-label="Owned Entities (opens in a new tab)" href="https://docs.microsoft.com/en-us/ef/core/modeling/owned-entities" target="_blank">Owned Entities</a> . They have a table of their own and both reference the Products table. 

As you may have noticed, I've defined a <a rel="noreferrer noopener" aria-label="shadow property (opens in a new tab)" href="https://docs.microsoft.com/en-us/ef/core/modeling/shadow-properties" target="_blank">shadow property</a> "Id" on both in order to be able to persist them. This won't affect our models, even though in a more advanced scenario we would upgrade them to Entities in order to unlock more functionalities.

For example, imagine you've ordered multiple items on Amazon and your order is ready to be delivered. Maybe each product is sold and shipped by a different vendor. This means that you might not receive all of them together. Modeling the OrderLine as Entity allows you to properly track and handle this kind of situation.

Now, as you might have noticed the QuoteItem class is very small, just two properties. I might have used a struct instead. However, this would allow our consumers to call the default parameterless constructor directly, avoiding the other one. This is a really big problem as we are checking the invariants in that cTor and ensuring the instance is always in a good state.

That's enough for now. <a href='/lets-do-some-ddd-with-entity-framework-core-3-part-3-better-value-objects/'>Next time</a> we're going to take a look at Example 2. See you!