---
description: >
  Let's see what a Compensating Transaction is, how it can help us recover from errors and how important it is to have deep knowledge of our domain before running them.
id: 8031
title: 'What does a Compensating Transaction do?'
date: 2022-12-11T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8031
permalink: /what-does-a-compensating-transaction-do
image: /assets/uploads/2022/12/what-does-a-compensating-transaction-do.jpg
categories:  
  - Software architecture
  - Design patterns
  - OpenSleigh
---

Hi All! Today I want to expand a bit the concept we discussed <a href='/why-would-you-send-messages-twice' target='_blank'>last time</a>, and talk about __Compensating Transactions__.

### In simple terms, a Compensating transaction it's all about reversing the effects of a previous transaction.

This is often used in cases where a previous transaction was made in error, or if the original transaction can no longer be completed as intended.

And we could potentially stop here, but there are some additional considerations to make.

Let's start with a *very basic* example.

Let's say you made a purchase on an e-commerce website and the transaction was successfully processed. However, something goes wrong with any of the subsequent steps (inventory checking, billing, logistics, shipping, just to name a few). In this case, the e-commerce website would run a compensating transaction to reverse the effects of the original transaction and refund your money.

The core idea is that the system should keep track of the steps performed so far so that in case an error occurs, we can backtrack our way and rollback the changes made.

Keep in mind though that some of the steps might have been performed in parallel. Therefore it's not always possible to compensate the full workflow in the exact reverse order as it was initially processed.

Another important concept to understand in relation to compensating transactions is idempotency. Like any other operation, they are prone to failures. Our systems have to be able to recover, and if necessary, repeat it from scratch. This also means that the same compensating transaction has to be structured in a way that it can be be run multiple times without changing the final result.

Now, it's crucial to note that compensating transactions are not always as straightforward as in the e-commerce example above. 

### The steps involved in running a compensation can vary depending on the business domain and the specific circumstances of the transaction. 

This is why it's important to have a deep understanding of the business domain and of each underlying operation when working with compensating transactions. In other words, there is no one-size-fits-all approach to implementing compensation logic. 

Going back to the previous e-commerce example, let's say that due to an inventory mismatch, the products you've bought are not available anymore *after* the purchase.
At this point the system might decide to *not* refund the money, but instead propose you some alternative products or a gift card or a discount on your next purchase.

Another very classical text-book example is the travel booking system. You want to book a flight/hotel combination for your next holiday trip. You manage to book (and pay) the flight, but something goes wrong with the hotel reservation. Should the system cancel your flight as well? Or wouldn't it be better to just give you an alternative list of hotels instead?

This is why in <a href='https://github.com/mizrael/OpenSleigh' target='_blank'>OpenSleigh</a> each message handler has a corrispective "rollback" operation, which you can decide to implement or not. However, OpenSleigh will basically stop there and leave it up to you the choice of what to do next.
You could decide to continue with the rest of the Saga, or perhaps trigger a whole different one and mitigate some of the steps taken. 

You're in control.