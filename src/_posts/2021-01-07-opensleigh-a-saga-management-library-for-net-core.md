---
description: >
  Today I want to talk a bit about a pet project of mine: I called it OpenSleigh, a Saga management library for .NET Core.
id: 7934
title: 'OpenSleigh: a Saga management library for .NET Core'
date: 2021-01-07T22:34:20-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7934
permalink: /opensleigh-a-saga-management-library-for-net-core/
image: /assets/uploads/2021/01/opensleigh.gif
categories:
  - .NET
  - ASP.NET
  - Design Patterns
  - Kafka
  - Microservices
  - MongoDB
  - OpenSleigh
  - Programming
  - RabbitMQ
  - Software Architecture
tags:
  - .NET Core
  - ASP.NET Core
  - Kafka
  - microservices
  - OpenSleigh
  - rabbitmq
  - software architecture
---
Hi All! Today I want to talk a bit about a pet project of mine I've been working on in the last few weeks. I called it _**<a href="https://github.com/mizrael/OpenSleigh" target="_blank" rel="noreferrer noopener">OpenSleigh</a>**_, it's a Saga management library for .NET Core.

For those who don't know what the Saga Pattern is, Chris Richardson has a very good introduction <a href="https://microservices.io/patterns/data/saga.html" target="_blank" rel="noreferrer noopener">on his website</a>.

The basic idea is quite interesting: in a micro-service architecture, it often happens that we need to handle several long-running operations that span multiple services. <a href="https://www.davidguida.net/improving-microservices-reliability-part-1-two-phase-commit/" target="_blank" rel="noreferrer noopener">Distributed transactions</a> are a nasty little beast and we also need a way to keep track of the global status and manage the whole flow.

#### There are two main schools of thought for this: **_Choreography_** and **_Orchestration_**.

The core idea behind **Choreography** is to decentralize the logic. Make it scattered and shared amongst the participants. They usually communicate using a Message Broker, like RabbitMQ or Kafka, which makes it definitely easier to add and remove message publishers and consumers.

With **Orchestration** instead, a single component handles the logic, and takes care of the entire workflow. Once the process is triggered, this _orchestrator_ will take care of calling each microservice (directly or via messaging) and handling responses and faults.

**OpenSleigh** falls into the realm of the orchestrators. It can be added to regular Console or Web applications, will spin up a bunch of **<a href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-3-the-code-finally/" target="_blank" rel="noreferrer noopener">BackgroundServices</a>,** and do its magic.

The Core module of **OpenSleigh** can be installed from <a href="https://www.nuget.org/packages/OpenSleigh.Core/" target="_blank" rel="noreferrer noopener">NuGet</a>. However, Transport and Persistence packages are necessary to properly use the library.

These are the packages available at the moment:

  * <a href="https://www.nuget.org/packages/OpenSleigh.Persistence.InMemory/" target="_blank" rel="noreferrer noopener">OpenSleigh.Persistence.InMemory</a>
  * <a href="https://www.nuget.org/packages/OpenSleigh.Persistence.Mongo/" target="_blank" rel="noreferrer noopener">OpenSleigh.Persistence.Mongo</a>
  * <a href="https://www.nuget.org/packages/OpenSleigh.Transport.RabbitMQ/" target="_blank" rel="noreferrer noopener">OpenSleigh.Transport.RabbitMQ</a>

Now, there are already several valuable alternatives on the market, like <a href="https://masstransit-project.com/" target="_blank" rel="noreferrer noopener">MassTransit</a> and <a href="https://particular.net/nservicebus" target="_blank" rel="noreferrer noopener">NServiceBus</a>. So why did I started this project?

#### Because I was **curious**. And I'm pretty damn sure many of you can relate.

I wanted to see how a Saga system works from the inside. Also, I wondered if I could build one myself from scratch. I wanted to create an open-source project and create a community around it.

So don't hesitate! Take a look at <a href="https://github.com/mizrael/OpenSleigh" target="_blank" rel="noreferrer noopener">the repository</a> on GitHub, download the packages, play with them, and send me your feedback! 

<div class="post-details-footer-widgets">
</div>