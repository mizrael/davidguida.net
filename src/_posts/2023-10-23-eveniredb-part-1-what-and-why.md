---
description: >
  EvenireDB is yet another database engine, but specifically for Event Sourcing. 
id: 8035
title: 'EvenireDB part 1: what and why?'
date: 2023-10-23T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8035
permalink: /eveniredb-part-1-what-and-why
image: /assets/uploads/2023/10/eveniredb-part-1-what-and-why.jpg
categories:  
  - .NET
  - Event Sourcing
  - Ramblings
  
---

I have quite a fascination for Event Sourcing. Not sure why this pattern got my attention a while ago, but since then I've been using it at work (whenever possible and meaningful) and for some personal projects too.

I have also been <a href='/event-sourcing-in-net-core-part-1-a-gentle-introduction/' target='_blank'>blogging about it</a> for some time, as some of you might know.

Now, being a very curious person, I have always been interested in understanding how things work, in software and in (almost) anything else. I have been reading a bunch of <a href='https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/' target='_blank'>very interesting books</a> about data-intensive applications and after a bit I started playing with the idea of writing my own database engine.

Of course this is definitely not an easy feat to pull off, and for sure not one that can be accomplished by just one guy in his bedroom during his spare time.

But at the same time I'm having a lot of fun so far and I am definitely learning a lot :)

## So here it is: <a href='https://github.com/mizrael/EvenireDB' target='_blank'>EvenireDB</a>!

I got the name from the Latin word
"<a href='https://en.wiktionary.org/wiki/evenire' target='_blank'>Evenire</a>", present active infinitive of *ēveniō*, "to happen".

### The basic idea behind Evenire is quite simple: events can be appended to stream and later on, retrieved by providing the stream ID.

Every stream is kept in memory using a local cache, for fast retrieval. A background process takes care of serializing events to a file, one per stream.

Reads can be done from the very beginning of a stream moving forward or from a specific point. This is the basic scenario, useful when you want to rehydrate the state of an <a href='https://www.martinfowler.com/bliki/DDD_Aggregate.html' target='_blank'>Aggregate</a>.

Another option is to read the events from the end of the stream instead, moving backwards in time. This is particularly interesting, for instance, when you are capturing data from sensors and wish to retrieve the most recent state.

For those interested, I invite you to take a look at the repository on Github and the <a href='https://github.com/mizrael/EvenireDB/tree/main/samples/EvenireDB.Samples.TemperatureSensors' target='_blank'>small sample application</a> I included.

In the next weeks, I'm planning on writing more on how Evenire works internally, and the technical choices I've taken so far.

Stay tuned!