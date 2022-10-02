---
description: >
  Last time we started digging into the code and saw how we can model an initial version of our Domain. But what's primitive obsession?
id: 6880
title: 'Let&#8217;s do some DDD with Entity Framework Core 3 &#8211; part 3: better Value Objects'
date: 2019-10-29T12:17:21-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6880
permalink: /lets-do-some-ddd-with-entity-framework-core-3-part-3-better-value-objects/
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
Here we go with the last article of the series. <a rel="noreferrer noopener" aria-label="Last time (opens in a new tab)" href="https://www.davidguida.net/lets-do-some-ddd-with-entity-framework-core-3-part-2-lets-see-some-code/" target="_blank">Last time</a> we started digging into the <a rel="noreferrer noopener" aria-label="code for Example 1 (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo" target="_blank">code for Example 1</a> and saw how we can model an initial version of our Domain. Let&#8217;s see now what&#8217;s primitive obsession and how to avoid it.

Took me a little bit to write this one. I got &#8220;distracted by life&#8221; actually. My wife and I have taken a very important decision and we&#8217;ve only recently started preparing for it. I have left my job at Dell and we&#8217;ll begin a new adventure in Montreal at the end of November. I&#8217;ll probably blog more in the next weeks, now let&#8217;s go back to the matter.

There are few differences between Example 1 and 2. First of all, we&#8217;re not in a Console application anymore, now we&#8217;re **exposing a Web API**.

But more importantly, we&#8217;ve started defining our domain in terms of <a rel="noreferrer noopener" aria-label="Value Objects (opens in a new tab)" href="https://martinfowler.com/bliki/ValueObject.html" target="_blank">Value Objects</a>. I have added two important classes: <a rel="noreferrer noopener" aria-label="Currency  (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo/blob/master/EFCoreCommerceDemo.Example2/EFCoreCommerceDemo.Example2/Models/Currency.cs" target="_blank">Currency </a>and <a rel="noreferrer noopener" aria-label="Money (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo/blob/master/EFCoreCommerceDemo.Example2/EFCoreCommerceDemo.Example2/Models/Money.cs" target="_blank">Money</a>.

The reason is quite simple: the previous version of the Product class was exposing just a simple decimal &#8220;Price&#8221; property. That could work&#8230;for 10 minutes probably. By expressing the cost of the product with a simple decimal we are unable to give a proper indication of what&#8217;s the currency.

Of course we can add a &#8220;Currency&#8221; string to the Product, or even come up with a nice Enum. But by doing so, we will be forced to apply the same treatment to the OrderLine as well. 

#### Eventually this will spread to the whole code base.

Another simple example might be the Username. In many project it is modeled using a simple string, in combination with one or more business logic classes that check its validity (eg. length, special characters and so on).

If we define a **proper Username class** instead, it can be our single source of truth, avoiding duplication and scattering in the rest of the system.

Going back to our eCommerce scenario, now we have the possibility to sell Products in different currencies, and more importantly our customers can buy **in their own currency.**

This may pose another issue though: what if a Customer decides to buy products that have different currencies? We need to convert into something common. We can use a default currency, or even better the Customer&#8217;s one.

But what would be the perfect place for that conversion to happen? We can&#8217;t add that burden to the Currency class directly as we&#8217;re converting **Money**. The Product class as well is not a good place: keep in mind that rates change over time so we definitely need to access some external service.

An option is to define the logic in a Currency Converter service and inject it where needed. Now, in Example 2 we&#8217;re not doing anything fancy, there&#8217;s no CQRS or Event Sourcing so it get injected directly in the API Controller. Quick and dirty, but works for the sake of the example.

Also, note that when an Order gets created from a Quote, the prices on the OrderLines are not converted, but left untouched instead.

The conversion is instead handled at query time, before returning the data to the user. If we were using CQRS, an option would be to persist the Order in the queries db with the amounts converted already to a common currency (eg. the Customer&#8217;s one) and potentially handle the conversion on-demand directly on the UI.

<div class="post-details-footer-widgets">
</div>