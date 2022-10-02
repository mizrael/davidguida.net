---
description: >
  Let me talk a little bit about how I used Travis CI to deploy Barfer on Azure along with all the microservices and the web jobs
id: 6374
title: How I used Travis CI to deploy Barfer on Azure
date: 2017-11-27T09:25:02-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6374
permalink: /how-to-use-travis-ci-to-deploy-barfer-on-azure/
dsq_thread_id:
  - "6312845039"
image: /assets/uploads/2017/11/travis-ci-azure.jpg
categories:
  - Azure
  - Barfer
  - Git
  - Javascript
  - Microservices
  - NodeJS
  - Programming
  - Software Architecture
  - Typescript
---
Ok this time I want to talk a little bit about how I used <a href="https://travis-ci.org/" target="_blank" rel="noopener">Travis CI</a> to deploy <a href="https://barfer.azurewebsites.net/" target="_blank" rel="noopener">Barfer</a> on Azure. <a href="https://www.davidguida.net/hashtags-just-landed-barfer/" target="_blank" rel="noopener">Last time</a> I mentioned how much helped having a <a href="https://en.wikipedia.org/wiki/Continuous_delivery" target="_blank" rel="noopener">Continuous Delivery</a> system up and running so I thought it would be worth expanding a little bit the concept.

Some of you may say: &#8220;Azure already has a continuous delivery facility, why using another service?&#8221;. Well there&#8217;s a bunch of reasons why:

  * when I started writing Barfer I had no idea I was going to deploy on Azure
  * in case I move to another hosting service, I&#8217;ll just have to change a little bit the deployment configuration
  * CD on Azure is clunky and to be honest I still don&#8217;t know if I like <a href="https://github.com/projectkudu/kudu" target="_blank" rel="noopener">Kudu</a>.

Let me spend a couple of words on the last point. Initially I wanted to deploy all the services on a Linux web-app. Keep in mind that I wrote Barfer using <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">Visual Studio Code</a> on a Macbook Pro. So I linked the <a href="https://github.com/mizrael/barfer/" target="_blank" rel="noopener">GitHub repo</a> to the Azure Web App and watched my commits being transformed into Releases.

Well, turns out that Kudu on Linux is not exactly friendly. Also, after the first couple of commits it was not able to delete some hidden files in the node_modules folder. Don&#8217;t ask me why.

I spent almost a week banging my head on that then at the end I did two things:

  1. moved to a Windows Web-App
  2. dropped Azure CD and moved to Travis CI

Consider also that I had to deploy 2 APIs, 1 web client and 1 background service (the RabbitMQ subscriber) and to be honest I have absolutely no desire of learning how to write a complex deployment script. I want tools to&nbsp;**help** me doing the job, not blocking my way.

The Travis CI interface is&nbsp; very straightforward: once logged in, link the account to your GitHub one and pick the repository you want to deploy. Then all you have to do is create a .yml script with all the steps you want to perform and you&#8217;re done.

<a href="https://github.com/mizrael/barfer/blob/master/.travis.yml" target="_blank" rel="noopener">Mine</a> is quite simple: since I am currently deploying all the services together (even though each one has its own independent destination), the configuration I wrote makes use of 5 <a href="https://docs.travis-ci.com/user/build-stages/" target="_blank" rel="noopener">Build Stages.</a>&nbsp;The first one runs all the unit and integration tests then for every project there&#8217;s a custom script that

  1. downloads the node packages (or fetches them from the cache)
  2. builds the sources
  3. deletes the unnecessary files
  4. pushes all the changes to Azure

The whole process takes approx 10 minutes to run due to the fact that for every commit all the projects will be deployed, regardless where the actual changes are. I have to dig deeper into some features like tags or special git branches, but I will probably just split the repo, one per project. I just have to find the right way to manage the shared code.&nbsp;

<div class="post-details-footer-widgets">
</div>