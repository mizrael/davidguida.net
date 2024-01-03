---
description: >
  Heimdall is a poor man's service registry tool, written in ASP.NET Core, React and MongoDB. Go check it on GitHub!
id: 6284
title: 'Don't worry, Heimdall will watch over all your microservices.'
date: 2017-05-01T16:32:23-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6284
permalink: /dont-worry-heimdall-will-watch-over-all-your-microservices/
dsq_thread_id:
  - "5776335008"
image: /assets/uploads/2017/04/heimdall.jpg
categories:
  - .NET
  - ASP.NET
  - MongoDB
  - Programming
  - React
  - Software Architecture
  - Typescript
  - WebAPI
---
TL;DR : I wrote a <a href="http://microservices.io/patterns/service-registry.html" target="_blank" rel="noopener noreferrer">service registry tool</a>, named <a href="https://github.com/mizrael/heimdall" target="_blank" rel="noopener noreferrer">Heimdall</a>, go and fork it!

Long version: almost every time I am working on a piece of code I get stuck on something and after a while I get&nbsp;new ideas for new projects. This may lead to a huge number of useless git repos, each one with a partially functional software, but it also&nbsp;pushes me to work on new things each day.

This time I was working on a super-secret project (that I will of course share very soon) based on a nice microservices architecture and I soon realized I needed some kind of Service Registry. The project was quite&nbsp;small so I was not really interested in a complex tool like a router with load balancing functions or similia so I decided to code the thing myself.

For the ones of you that don't know what a Service Registry is and what it does, allow me to give you some context.  
Imagine you're a client&nbsp;that needs to consume some APIs. You could of course use a configuration file for storing the endpoints but in case you're cloud-based, urls can change often.

<a href="/assets/uploads/2017/04/Richardson-microservices-part4-1_difficult-service-discovery.png" target="_blank" rel="noopener noreferrer"><img loading="lazy" class="size-medium wp-image-6288 aligncenter" src="/assets/uploads/2017/04/Richardson-microservices-part4-1_difficult-service-discovery-294x300.png?resize=294%2C300" alt="" width="294" height="300" srcset="/assets/uploads/2017/04/Richardson-microservices-part4-1_difficult-service-discovery.png?resize=294%2C300&ssl=1 294w, /assets/uploads/2017/04/Richardson-microservices-part4-1_difficult-service-discovery.png?resize=768%2C783&ssl=1 768w, /assets/uploads/2017/04/Richardson-microservices-part4-1_difficult-service-discovery.png?resize=1004%2C1024&ssl=1 1004w, /assets/uploads/2017/04/Richardson-microservices-part4-1_difficult-service-discovery.png?resize=788%2C803&ssl=1 788w, /assets/uploads/2017/04/Richardson-microservices-part4-1_difficult-service-discovery.png?resize=50%2C50&ssl=1 50w, /assets/uploads/2017/04/Richardson-microservices-part4-1_difficult-service-discovery.png?w=1024&ssl=1 1024w" sizes="(max-width: 294px) 100vw, 294px" data-recalc-dims="1" /></a>

Also, what if you want some nice features like multiple instances, autoscaling and load balancing?

The answer is simple: use a registry!&nbsp;

<a href="/assets/uploads/2017/04/Richardson-microservices-part4-2_client-side-pattern.png" target="_blank" rel="noopener noreferrer"><img loading="lazy" class="size-medium wp-image-6287 aligncenter" src="/assets/uploads/2017/04/Richardson-microservices-part4-2_client-side-pattern-300x283.png?resize=300%2C283" alt="" width="300" height="283" srcset="/assets/uploads/2017/04/Richardson-microservices-part4-2_client-side-pattern.png?resize=300%2C283&ssl=1 300w, /assets/uploads/2017/04/Richardson-microservices-part4-2_client-side-pattern.png?resize=768%2C725&ssl=1 768w, /assets/uploads/2017/04/Richardson-microservices-part4-2_client-side-pattern.png?w=1024&ssl=1 1024w, /assets/uploads/2017/04/Richardson-microservices-part4-2_client-side-pattern.png?resize=788%2C744&ssl=1 788w" sizes="(max-width: 300px) 100vw, 300px" data-recalc-dims="1" /></a>

Every service will register itself during initialization, allowing clients to&nbsp;query the registry and&nbsp;know the endpoint&nbsp;(possibly the best one).

I found this concept pretty useful so I decided to create a poor man's version myself, using ASP.NET Core, MongoDB and React and I named it Heimdall, the guardian god of the&nbsp;[Norse mythology](https://en.wikipedia.org/wiki/Norse_mythology "Norse mythology")&nbsp;.  
The list of features for now is very scarce, you can just register a service, add/remove endpoints and query, but I have a full roadmap ready 🙂

Oh and I also added help pages using <a href="http://swagger.io/" target="_blank" rel="noopener noreferrer">Swagger</a> !

<div class="post-details-footer-widgets">
</div>