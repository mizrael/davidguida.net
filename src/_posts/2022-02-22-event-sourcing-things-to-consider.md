---
description: >
  In this article, we'll see 5 of the things to consider when dealing with a system written with Event Sourcing.
id: 8021
title: 'Event Sourcing: 5 things to consider when approaching it'
date: 2022-02-22T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8021
permalink: /event-sourcing-things-to-consider
image: /assets/uploads/2022/02/event-sourcing-things-to-consider.jpg
categories:  
  - Design Patterns
  - Software Architecture
tags:  
  - DDD
  - design patterns
  - software architecture
---

Hi All, and welcome to another post about **Event Sourcing**. Last time we discussed a bit about <a href='/my-event-sourcing-journey-so-far/' target='_blank'>my journey so far</a>, and today I want to talk about some of the things to consider when working on an Event Sourced system.

So, without futher ado, let's begin!

## Eventual Consistency
CQRS is an integral part of an **Event Sourcing** system. By definition, we rely on a subcomponent that takes care of refreshing our View Models (aka. _Projections_). However, it's important to remember that this refresh doesn't happen instantaneously, but it's rather...eventual.

Now, this might not necessarily be an issue. It depends on the application Domain and how much delay we can afford for the data to be available.

### One strategy is to build a “temporary” projection on the client, while the backend is processing the update.

This of course also means that every service consuming the projections (eg. the UI) has to be aware of this delay and plan accordingly.

## Data errors
Once stored, events are to be considered immutable, and by such, they cannot be changed. 

If there are errors in the persisted data we can correct them only by appending more events.

Moreover, events are normally stored as serialized blobs, using JSON or another format. While this can be very flexible, on the other hand, makes support and incident management much harder than with a regular, old-fashion relational storage.

## Schema changes
Things change. We definitely expect the data to change, but we should also expect the _structure_ of the data to receive some updates.

### And of course, updating an event schema definitely won’t change the data persisted so far.

This is extremely common, especially when we realize we have missed some fields in an event.

So, unless we take on the risk and complexity of updating every event ever stored, the other option is to handle different schemas in code, which of course adds another level of complexity. 

## Event modeling
Events should be modeled based around the use cases of the business domain.

Events like "_ShippingUpdated_" should be avoided as they are adding no real meaning or value. They should instead map something that happened in the real world, for example as a consequence of human interaction with our application. 

Each Event should have a deep meaning and importance to our business. Everything that happens around us can be described as events, but that does not mean that we need to implement everything that happens in our software. For example, we should avoid things like "_ButtonClicked_".

So, instead of "_ShippingUpdated_", we should perhaps use "_OrderShipped_" or "_OrderArrived_".

## Onboarding
Let's not lie to ourselves: **Event Sourcing is a complex pattern**. 

It’s also a big philosophical switch, from the good ol’ CRUD to this shiny new way.

Onboarding a new team member, especially a junior one, takes usually more time than a regular CRUD application. And adding a new team member on an existing project has already its own challenges. 

Things might get even worse if we have to build the system from scratch and we have to convince an entire team to use this new pattern.

There will be the ones who would be enthusiastic and immediately jump on the wagon and others who will be completely against it. 

Communication is the key, so be prepared to bake your ideas with a valid list of motivations.



