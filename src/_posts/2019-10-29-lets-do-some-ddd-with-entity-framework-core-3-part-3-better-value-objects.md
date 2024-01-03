---
description: >
  Last time we started digging into the code and saw how we can model an initial version of our Domain. But what's primitive obsession?
id: 6880
title: "Let's do some DDD with Entity Framework - part 3: better Value Objects"
date: 2019-10-29T12:17:21-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6880
permalink: /lets-do-some-ddd-with-entity-framework-core-3-part-3-better-value-objects/
image: /assets/uploads/2018/01/Entity-Framework-Logo_2colors_Square_RGB-591x360.png
categories:
  - .NET
  - ASP.NET
  - Programming
  - Software Architecture
tags:
  - DDD
  - programming
  - software architecture
---
Here we go with the last article of the series. <a rel="noreferrer noopener" aria-label="Last time (opens in a new tab)" href="https://www.davidguida.net/lets-do-some-ddd-with-entity-framework-core-3-part-2-lets-see-some-code/" target="_blank">Last time</a> we started digging into the <a rel="noreferrer noopener" aria-label="code for Example 1 (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo" target="_blank">code for Example 1</a> and saw how we can model an initial version of our Domain. Let's see now what's primitive obsession and how to avoid it.

Took me a little bit to write this one. I got "distracted by life" actually. My wife and I have taken a very important decision and we've only recently started preparing for it. I have left my job at Dell and we'll begin a new adventure in Montreal at the end of November. I'll probably blog more in the next weeks, now let's go back to the matter.

There are few differences between Example 1 and 2. First of all, we're not in a Console application anymore, now we're **exposing a Web API**.

But more importantly, we've started defining our domain in terms of <a rel="noreferrer noopener" aria-label="Value Objects (opens in a new tab)" href="https://martinfowler.com/bliki/ValueObject.html" target="_blank">Value Objects</a>. I have added two important classes: <a rel="noreferrer noopener" aria-label="Currency  (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo/blob/master/EFCoreCommerceDemo.Example2/EFCoreCommerceDemo.Example2/Models/Currency.cs" target="_blank">Currency </a>and <a rel="noreferrer noopener" aria-label="Money (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo/blob/master/EFCoreCommerceDemo.Example2/EFCoreCommerceDemo.Example2/Models/Money.cs" target="_blank">Money</a>.

The reason is quite simple: the previous version of the Product class was exposing just a simple decimal "Price" property. That could work&#8230;for 10 minutes probably. By expressing the cost of the product with a simple decimal we are unable to give a proper indication of what's the currency.

Of course we can add a "Currency" string to the Product, or even come up with a nice Enum. But by doing so, we will be forced to apply the same treatment to the OrderLine as well. 

#### Eventually this will spread to the whole code base.

Another simple example might be the Username. In many project it is modeled using a simple string, in combination with one or more business logic classes that check its validity (eg. length, special characters and so on).

If we define a **proper Username class** instead, it can be our single source of truth, avoiding duplication and scattering in the rest of the system.

Going back to our eCommerce scenario, now we have the possibility to sell Products in different currencies, and more importantly our customers can buy **in their own currency.**

This may pose another issue though: what if a Customer decides to buy products that have different currencies? We need to convert into something common. We can use a default currency, or even better the Customer's one.

But what would be the perfect place for that conversion to happen? We can't add that burden to the Currency class directly as we're converting **Money**. The Product class as well is not a good place: keep in mind that rates change over time so we definitely need to access some external service.

An option is to define the logic in a Currency Converter service and inject it where needed. Now, in Example 2 we're not doing anything fancy, there's no CQRS or Event Sourcing so it get injected directly in the API Controller. Quick and dirty, but works for the sake of the example.

Also, note that when an Order gets created from a Quote, the prices on the OrderLines are not converted, but left untouched instead.

The conversion is instead handled at query time, before returning the data to the user. If we were using CQRS, an option would be to persist the Order in the queries db with the amounts converted already to a common currency (eg. the Customer's one) and potentially handle the conversion on-demand directly on the UI.