---
description: >
  How we can improve reliability between microservices? One approach is the Two-Phase-Commit technique, let's see how it works!
id: 6945
title: 'Improving microservices reliability - part 1: Two Phase Commit'
date: 2020-01-06T09:00:00-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6945
permalink: /improving-microservices-reliability-part-1-two-phase-commit/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
categories:
  - Design Patterns
  - Microservices
  - Programming
  - Software Architecture
tags:
  - design patterns
  - microservices
  - software architecture
---
Hi everyone! Today I would like to talk a bit about how we can improve reliability between microservices. This is the first article of the series and we'll be focusing on the **Two-Phase-Commit** technique.

It has been a while since <a rel="noreferrer noopener" aria-label="my last article (opens in a new tab)" href="https://www.davidguida.net/its-dangerous-to-go-alone-take-this/" target="_blank">my last article</a>, this is the first one I write from Montreal. I moved here last November to work with a local Fintech Company, <a rel="noreferrer noopener" aria-label="Fiska (opens in a new tab)" href="https://www.fiska.com" target="_blank">Fiska</a>.

So, let's suppose you're working on a microservices architecture and you need to have them talk each other in some way. An isolated service is not that useful, we have to share some data with the rest of our system. Maybe you're working on the next Amazon or Neflix, who knows!<figure class="wp-block-image size-large">

<img loading="lazy" width="1200" height="628" src="/assets/uploads/2020/01/amazon-netflix-microservices-1.png?fit=788%2C412&ssl=1" alt="" class="wp-image-7000" srcset="/assets/uploads/2020/01/amazon-netflix-microservices-1.png?w=1200&ssl=1 1200w, /assets/uploads/2020/01/amazon-netflix-microservices-1.png?resize=300%2C157&ssl=1 300w, /assets/uploads/2020/01/amazon-netflix-microservices-1.png?resize=1024%2C536&ssl=1 1024w, /assets/uploads/2020/01/amazon-netflix-microservices-1.png?resize=768%2C402&ssl=1 768w, /assets/uploads/2020/01/amazon-netflix-microservices-1.png?resize=788%2C412&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" /> <figcaption>just a bunch of microservices</figcaption></figure> 

Let's make a simple example. Imagine a user placing an order on an ecommerce. The Orders microservice receives the command, stores the data in its persistence layer and then needs to inform all the interested parties. For example a Notifications service that will send emails to the customer and the admins.

#### Of course we don't want emails to be sent if the Orders microservice fails to process the command.

One possible approach is the famous <a rel="noreferrer noopener" aria-label="Two-Phases-Commit (opens in a new tab)" href="https://en.wikipedia.org/wiki/Two-phase_commit_protocol" target="_blank"><strong>Two-Phase-Commit</strong></a> (aka **2PC**):<figure class="wp-block-image size-large">

<a href="https://lh3.googleusercontent.com/gBenjH576PXKUeb0Wo5k49_V4xj3grybDPzh57OByQ6m6MzoVF2_mmXAH1OZzVF77d2s2bX7-QGvibpaXV6TgbHd4CfNdt2lL5PPerIeVcyl5kqH1AIsMHQR9mF9926mEpbIPky8Nf7NJHGtIRBBQyWmOwJpJkxQTUy2yBTgcuR9jfHtO_otP6bQ2C02gK_7NJzyLOJDgPxs9N_azn-Ick4aXT1PhAIy_YU0fjMER6z2_s7SAjCgfhMzM_lrWfDzA2EDm8Bt8Woc0ix9BollMjdQVy9-Fl5QRbYPNGl67kIi2XUFWnMH9zNnZF-5wpd5n7cFVXVa0C5NrDU0hnw1pF2Cd2r29vB9snsF-0tka0TBZ4z1meyDKv8eC11UJ3osa0qNpin5U2VTEs7DlLonIpacJhMvfo0iu5q3O6Bqb_6cfoysQK6l3sSkbd2HWviOWBzDkYB3Xa9994Ivf0aVgD1n92P5CEXt1JnfDZ39ZeGZaHSCVmsARK_EFwHe8GrG_fs-qfHDdE0X1yT-bj0KOfWctjEfZCsilKC20AWmV1uDL0ojlb5p7O2P0LwEoVN-kTQE4reDJTfYLAItnTkQP5MU5UQLqLENM6BUd9o_ttOu1cXLozYC30rWBDfllPPpc7sSAtRLEZrWQb-hVOW3ctrmS-dJWagKrbMOzQZixtKLFflP4QkR7-99=w1955-h659-no" target="_blank" rel="noreferrer noopener"><img loading="lazy" width="3946" height="1330" src="/assets/uploads/2020/01/20200104_172203-scaled.jpg?fit=788%2C265&ssl=1" alt="Two Phase Commit" class="wp-image-6973" srcset="/assets/uploads/2020/01/20200104_172203-scaled.jpg?w=3946&ssl=1 3946w, /assets/uploads/2020/01/20200104_172203-scaled.jpg?resize=300%2C101&ssl=1 300w, /assets/uploads/2020/01/20200104_172203-scaled.jpg?resize=1024%2C345&ssl=1 1024w, /assets/uploads/2020/01/20200104_172203-scaled.jpg?resize=768%2C259&ssl=1 768w, /assets/uploads/2020/01/20200104_172203-scaled.jpg?resize=1536%2C518&ssl=1 1536w, /assets/uploads/2020/01/20200104_172203-scaled.jpg?resize=2048%2C690&ssl=1 2048w, /assets/uploads/2020/01/20200104_172203-scaled.jpg?resize=788%2C266&ssl=1 788w, /assets/uploads/2020/01/20200104_172203-scaled.jpg?w=2364&ssl=1 2364w" sizes="(max-width: 788px) 100vw, 788px" /></a><figcaption>Two Phase Commit</figcaption></figure> 

As you can easily guess, it's a two-step process:

  1. The Coordinator service asks all the participants if they are ready to commit the transaction. They can reply with a yes or no. Note that if a single service replies with a no ( or a timeout or any other error), the full transaction is automatically canceled. 
  2. If all the participants have answered yes, the Coordinator sends the Commit command to them and waits for the final ack.

Although functional, there are few drawbacks with this approach. First of all, it comes with an intrinsic performance penalty as we're putting the all the actors on hold multiple times awaiting for an answer.

Secondly, in some cases it may be possible that other transactions triggered in between are paused till the whole process completes.

#### Moreover, if the Coordinator fails for some reason at the beginning of Phase 2, all the other services are left hanging in a limbo-state.

Don't get me wrong, 2PC is a good approach, but as all the other tools in our belt we need to know when we it can be used. For example it's extremely useful when replicating data among a cluster of db replica nodes.

So, going back to our ecommerce microservices, <a href="https://www.davidguida.net/improving-microservices-reliability-part-2-outbox-pattern/" target="_blank" rel="noreferrer noopener" aria-label="in the next article (opens in a new tab)">in the next article</a> we'll see how can we can leverage the Outbox Pattern to safely notify our services when an order has been placed. 

Au-revoir!

<div class="post-details-footer-widgets">
</div>