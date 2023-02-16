---
description: >
  Are microservices the right choice for my project? Should I go for a monolith instead?
id: 8032
title: 'Microservices or Monolith, what to pick?'
date: 2023-02-16T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8032
permalink: /microservices-or-monolith-what-to-pick
image: /assets/uploads/2023/02/microservices-or-monolith-what-to-pick.jpg
categories:  
  - Software architecture
  
---

Wow, almost 2 months since my last post. I'm really starting to fall behind.

And honestly, it would probably have taken even more, if it wasn't for one of my connections on Linkedin. 

A few days ago, I got a message from one of my contacts. They wanted a piece of advice for a new project they're starting. Here's the question:

> I am starting another project, I have full domain knowledge and know all bounded context (because previously worked with same domain). In this case, what will be your advise, can I start with microservice architecture OR
should I start with modular monolith?

I think it's an excellent question, so I decided to share my answer here on my blog.

### TL;DR: start with a monolith.

You can stop reading right here if you want, but if you are also curious about my reasons, go on then.

Microservices are _complicated_. Even assuming that you have 100% confidence in your domain knowledge (which trust me, is rarely the case), there is a lot of boilerplate code and setup necessary to spin up a new service. Setting up your CI/CD pipeline and make it reusable takes time and effort, so make sure to add this to your estimates.

Also, your microservices are probably going to talk to each other in some way. Which means you'll need the infrastructure for that too (eg. a message broker of some sort, like Kafka or RabbitMQ). And you might even have to deal with things like <a target='_blank' href='/opensleigh-a-saga-management-library-for-net-core/'>Choreography or Orchestration</a>.

Let's talk about costs also! By definition, each microservice has to have its own DB (or no DB at all). Are you ready to pay the cost of all that extra infrastructure?

Your codebase will become huge. If you have a single team, you'll probably go for a monorepo, which has its own quirks to deal with. 
Moreover, if you really have just a single team, microservices will simply be overkill for you. This is one area where <a href='https://en.wikipedia.org/wiki/Conway%27s_law' target='_blank'>Conway's law</a> will always be true.

### So my honest advice now is: start with a monolith. 

Make sure you have clear separation between your bounded contexts. Slice it <a href='https://jimmybogard.com/vertical-slice-architecture/' target='_blank'>vertically</a>.
Most importantly, strive for _Persistence Agnosticism_: design your model classes first, leave the choice of the DB at the very end. It has to be a mere implementation detail. Don't let the DB tech impose limitations on how you define your Domain.