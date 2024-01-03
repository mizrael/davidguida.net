---
description: >
  Barfer is a Twitter clone I am writing in my spare time with NodeJs+RabbitMQ+MongoDb. All the sources are on GitHub and the latest build is on Azure.
id: 6379
title: 'I&#8217;m becoming a Barfer!'
date: 2017-11-17T21:35:35-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6379
permalink: /im-becoming-barfer/
dsq_thread_id:
  - "6291269610"
image: /assets/uploads/2017/11/barfer.png
categories:
  - Azure
  - Git
  - Javascript
  - Microservices
  - MongoDB
  - NodeJS
  - Programming
  - Software Architecture
  - Typescript
---
More than a month! My last post on this blog was more than one month ago. I should write more often. No wait let me rephrase that: I should write&nbsp;**on this blog** more often.

Why? How I spent my last month? <a href="https://barfer.azurewebsites.net/" target="_blank" rel="noopener">Barfing</a>, here&#8217;s how!

Ok, let&#8217;s add more details. A while ago I decided it was a good idea starting to move a little bit away from the .NET world and explore what&#8217;s around. And&nbsp; NodeJs arrived, of course with Typescript: I am 100% sure it&#8217;s basically impossible to write a semi-reliable system without some kind of type checking (along with 10000 other things).&nbsp;

Then I said: &#8220;I don&#8217;t want to just read a manual, what can I write with it?&#8221;. For some crazy reason I opted for a Twitter clone. Yeah, I was really bored.

Early in the analysis phase RabbitMQ and MongoDb joined the party. I was not exactly familiar with RabbitMQ so I thought was a good opportunity to learn something new.

In order to speedup the development and to obtain certain features (eg. authentication ) I have used a bunch of third party services

  * Mongodb is hosted on&nbsp;<a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="nofollow noopener">MongoDB Atlas</a>
  * RabbitMQ is hosted on&nbsp;<a href="https://www.cloudamqp.com/" target="_blank" rel="nofollow noopener">Cloudamqp</a>&nbsp;to handle events and messages
  * <a href="https://auth0.com/" target="_blank" rel="nofollow noopener">Auth0</a>&nbsp;to handle authentication.
  * <a href="https://travis-ci.org/" target="_blank" rel="nofollow noopener">Travis CI</a>&nbsp;to handle the deployment.
  * <a href="https://azure.microsoft.com/en-us/" target="_blank" rel="nofollow noopener">Azure</a>&nbsp;as final hosting platform.
  * <a href="https://github.com/mizrael/barfer" target="_blank" rel="noopener">GitHub</a> (no need to say why)

The system uses a microservices architecture with a front-end that act as api-gateway. For each service I&#8217;ve taken the CQRS path along with Publish/Subscribe. An Azure WebJob is scheduled to run continuously and listen to the various events/messages on the queues. I&#8217;ll blog more about the architecture but that&#8217;s it more or less.

What am I expecting from this? Well it&#8217;s simple: nothing. I mean, I&#8217;m not expecting people to use it (even though would be very nice), I am just exploring new possibilities. Nothing more.

Oh yeah, before I forget:&nbsp;<a href="https://barfer.azurewebsites.net/" target="_blank" rel="noopener">https://barfer.azurewebsites.net/</a>&nbsp;. Enjoy!

<div class="post-details-footer-widgets">
</div>