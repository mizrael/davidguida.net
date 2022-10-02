---
description: >
  In this article we're going to see how we can leverage Docker to scale and spin up multiple instances of a service on our machine.
id: 7883
title: How to scale your services with Docker during development
date: 2020-12-08T12:35:03-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7883
permalink: /how-to-scale-your-services-with-docker-during-development/
image: /assets/uploads/2020/12/docker-works.jpg
categories:
  - Docker
  - Microservices
tags:
  - Docker
  - Microservices
---
Hi All! Today we&#8217;re going to see how we can leverage Docker to scale and spin up multiple instances of a service on our machine.

It&#8217;s a matter of fact: live and dev boxes are not the same. Code working on your machine is likely to not work when deployed. In some cases, this happens because you&#8217;re running a single instance of a service when developing. But maybe that service is instantiated multiple times once deployed.

So unless we have very <a href="https://www.davidguida.net/asp-net-core-structured-logging/" target="_blank" rel="noreferrer noopener">good instrumentation</a> or we start going down the remote debugging path (when possible), the only option is to replicate the services also on our machine.

Luckily, we can use **Docker** to do the grunt-work for us!

The first thing to do, if you&#8217;re not doing that already, is to build a Dockerfile for our service. If you&#8217;re using Visual Studio (and you&#8217;re lazy like me), you can have it generate the Dockerfile automatically.

#### Visual studio <a href="https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/visual-studio-tools-for-docker?view=aspnetcore-5.0&WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">can do that</a> either when creating a new project or later on.

The next step is to create a nice <a href="https://docs.docker.com/compose/" target="_blank" rel="noreferrer noopener">docker-compose </a>config file. Something like this should work:

<pre class="EnlighterJSRAW" data-enlighter-language="yaml" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">version: '3.8'

services: 
  api:
    image: ${DOCKER_REGISTRY}myservice:latest   
    build:
      context: .
      dockerfile: MyService/Dockerfile  
</pre>

Here we&#8217;re defining one single service named _&#8220;api&#8221;_, starting from our image _&#8220;myservice&#8221;_.

We will save this config in the root folder, along the .sln file:

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img loading="lazy" width="257" height="181" src="/assets/uploads/2020/12/image-2.png?resize=257%2C181&#038;ssl=1" alt="" class="wp-image-7892" data-recalc-dims="1" /></figure>
</div>

If we run the command _docker-compose up_, we should see the service starting up.

#### Now, to scale horizontally, we&#8217;ll need to setup a <a href="https://docs.docker.com/engine/swarm/" target="_blank" rel="noreferrer noopener">Docker Swarm</a>. It will allow us to host and manage a cluster of Docker Engines and spin up multiple instances of our service.

But first, we&#8217;ll have to host the image on a registry. We could pick any registry we like or have one on our machine:

<pre class="EnlighterJSRAW" data-enlighter-language="powershell" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">docker run -d -p 5000:5000 --name registry registry:latest
docker start registry</pre>

This will start the registry on _localhost:5000_ .

Now we have to tag and push our service&#8217;s image to this registry:

<pre class="EnlighterJSRAW" data-enlighter-language="powershell" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">docker image tag my-image localhost:5000/myservice
docker push localhost:5000/myservice</pre>

The next step is to build the docker-compose config and push it to the repo. If you recall, we used a _DOCKER_REGISTRY_ environment variable when we defined the service image. We can set it to _localhost:5000/_ and then run

<pre class="EnlighterJSRAW" data-enlighter-language="powershell" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">docker-compose build
docker-compose push</pre>

We&#8217;re getting close. Now we have to create the swarm by running _docker swarm init_ and then we can deploy our service as a <a href="https://docs.docker.com/engine/reference/commandline/stack/" target="_blank" rel="noreferrer noopener">Docker Stack</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="powershell" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">docker stack deploy --compose-file docker-compose.yml myAwesomeSystem</pre>

Notice that we have to provide a name to the Stack. We might want to add multiple services to our docker-compose file later on (eg. databases, monitoring tools and so on), so it&#8217;s better to use a different name.

By default, we still have a single instance though. We have to update the docker-compose config and add the <a href="https://docs.docker.com/compose/compose-file/#replicas" target="_blank" rel="noreferrer noopener"><em>replica</em>s settings</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="yaml" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">version: '3.8'

services: 
  api:
    image: ${DOCKER_REGISTRY}myservice:latest      
    build:
      context: .
      dockerfile: MyService/Dockerfile
    deploy:
      mode: replicated
      replicas: 6
</pre>

Save, and run the _docker stack deploy_ command again.

We&#8217;re done! If you want to make sure the replicas are running, just execute _docker stack services myAwesomeSystem_ .

When we&#8217;re done coding we can shut down the swarm and clean up all the dangling images and containers:

<pre class="EnlighterJSRAW" data-enlighter-language="powershell" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">docker swarm leave --force
docker system prune --all --force</pre>

Happy swarming!

<div class="post-details-footer-widgets">
</div>