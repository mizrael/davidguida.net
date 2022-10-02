---
description: >
  We'll see how it's possible to use a Saga to orchestrate a very simple Order Processing workflow with OpenSleigh.
id: 8005
title: 'How to use Sagas to process orders - part 1'
date: 2021-04-02T10:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8005
permalink: /how-to-use-sagas-to-process-orders-part-1/
image: /assets/uploads/2021/04/how-to-use-sagas-to-process-orders-part-1.jpg
tags:
  - .NET Core
  - ASP.NET Core
  - Sagas
  - Software Architecture
  - Design Patterns
  - OpenSleigh
---

Hi All! Today I would like to digress a bit about how it's possible to use a **Saga** to orchestrate a very simple Order Processing workflow. We're going to use <a href="www.opensleigh.net" target="_blank">OpenSleigh</a>, of course, to do all the gruntwork for us.

It's been a while since <a target="_blank" href="/ui-notifications-blazor-signalr-opensleigh-part-2/">my last post</a>. I've been dragged a bit, by life and my work on OpenSleigh. I have also been quite busy preparing for a bunch of <a href="/talks" target="_blank">talks</a> I'm about to give in April. 

We talked already about what <a href="/opensleigh-a-saga-management-library-for-net-core/" target="_blank">Orchestration</a> is and how it differs from Choreography in another post, so I'm not going to spend much time on this.

So, in a regular, microservice-based e-commerce, we usually have multiple services involved in the Order processing workflow. When the customer clicks "Buy" and finalizes her order, there's a whole list of steps our system has to do. 

We might have, for example:

- Inventory service, called to make sure we have products in stock
- Payment service, called to finalize the payment form the customer
- Shipping service, called to send the items to the customer

### This is, of course, an oversimplification of what could happen. There are many other steps involved, just think of Localization, Coupons, Credit check, Customer loyalty and so on.

Organizing this workflow, or multiple workflows like this can be quite overwhelming. **OpenSleigh** can be leveraged as central node, turning our architecture into an event-based, asynchronous, reactive system.

<div class="w100 center">
<img src="/assets/uploads/2021/04/order-processing-1.png" title="trigger the Saga">
</div>

We can use a Saga to handle a `Process Order` command from the main user-facing application. 
**OpenSleigh** will start a new Saga instance and initiate the process.

<div class="w100 center">
<img src="/assets/uploads/2021/04/order-processing-2.png" title="sending the messages">
</div>

The message handler can send multiple commands to the underlying microservices, for example, to check the inventory and to process the payment.

<div class="w100 center">
<img src="/assets/uploads/2021/04/order-processing-3.png" title="handle the results">
</div>

Each individual microservice will publish an event once its work is complete. The Saga can subscribe to those events, and wait for all of them before triggering the last step.

<div class="w100 center">
<img src="/assets/uploads/2021/04/order-processing-4.png" title="shipping the products">
</div>

That's all for today! The <a href="/how-to-use-sagas-to-process-orders-part-2/" target="_blank">next time</a> we'll go a bit more into the details and take a look at some sample code.

Ciao!