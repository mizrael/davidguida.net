---
description: >
  Welcome back to episode 2 of the Structured Logging with ASP.NET Series! This time we'll see how to setup the infrastructure to host our log entries.
id: 7308
title: 'ASP.NET Core structured logging - part 2: the infrastructure'
date: 2020-06-12T01:58:08-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7308
permalink: /asp-net-core-structured-logging-part-2-the-infrastructure/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/06/Loki.jpg
categories:
  - .NET
  - ASP.NET
  - Docker
  - Microservices
tags:
  - .NET Core
  - ASP.NET Core
  - Docker
  - Grafana
  - Loki
---
Hi and welcome back to the second episode of the Structured Logging with ASP.NET Series! <a rel="noreferrer noopener" href="https://www.davidguida.net/asp-net-core-structured-logging/" target="_blank">Last time</a> we saw what's the difference between **_standard_** and **_structured_** logging. This time instead we'll start moving away from the theory and see how to setup the **infrastructure** to host our log entries.

Let's be honest here, logging to the Console is the first thing we all do. Probably with a call to \`_Console.Writeline()_\`. Don't worry, I won't judge. And there's nothing wrong with it, let's be clear.

Then the next level is leveraging the built-in logging library of .NET Core. And all of a sudden, we start getting instances of_ **ILogger<>**_ injected in our classes and everything looks much more nice and clean.

#### But still, we're logging to the Console. Maybe with fancy colors, scopes, and log levels now, but still, _Console._

Later on, when the project grows and things start getting serious, we find ourselves in need of gathering log entries from multiple sources, trying to aggregate them, correlate them, search them.

Regex is not enough: we need a better way to filter and extract the data.

This is basically what differentiates _standard_ from _structured_ logging: we can assign labels, create fields and run queries on them.

One of the most used tools for this job nowadays is <a rel="noreferrer noopener" href="https://grafana.com/oss/loki/" target="_blank">Loki </a>in combination with <a rel="noreferrer noopener" href="https://grafana.com/" target="_blank">Grafana</a>.

**Loki** is a horizontally-scalable, highly-available, multi-tenant log aggregation system. We send our entries to it and we can go back to our job, it'll take care of the rest.

**Grafana** instead is a super powerful UI we can leverage to query and visualize logs and metrics.

Of course, there's much more in both of them, but let's start from the basics.

So, the first step is to get our infrastructure up and running. I took the liberty of bothering the <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank" target="_blank">SuperSafeBank</a> repository I'm using for the <a rel="noreferrer noopener" href="https://www.davidguida.net/event-sourcing-in-net-core-part-1-a-gentle-introduction/" target="_blank">Event Sourcing Series</a> . I have updated the Docker Compose config file and added two more services:

<pre class="EnlighterJSRAW" data-enlighter-language="dockerfile" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">loki:
    image: grafana/loki:master
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - loki

  grafana:
    image: grafana/grafana:master
    ports:
      - "3000:3000"
    networks:
      - loki

networks:
  loki:</pre>

Now run `docker-compose up`, open \`localhost:3000\` in the browser and enjoy this nice and warm welcome:<figure class="wp-block-image size-large">

<img loading="lazy" width="1369" height="734" src="/assets/uploads/2020/06/image.png?fit=788%2C422&ssl=1" alt="" class="wp-image-7313" srcset="/assets/uploads/2020/06/image.png?w=1369&ssl=1 1369w, /assets/uploads/2020/06/image.png?resize=300%2C161&ssl=1 300w, /assets/uploads/2020/06/image.png?resize=1024%2C549&ssl=1 1024w, /assets/uploads/2020/06/image.png?resize=768%2C412&ssl=1 768w, /assets/uploads/2020/06/image.png?resize=788%2C422&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" /> </figure> 

The next step is to go to _Configuration -> Data Sources_ and add our Loki instance:<figure class="wp-block-image size-large">

<img loading="lazy" width="1258" height="773" src="/assets/uploads/2020/06/image-1.png?fit=788%2C484&ssl=1" alt="" class="wp-image-7315" srcset="/assets/uploads/2020/06/image-1.png?w=1258&ssl=1 1258w, /assets/uploads/2020/06/image-1.png?resize=300%2C184&ssl=1 300w, /assets/uploads/2020/06/image-1.png?resize=1024%2C629&ssl=1 1024w, /assets/uploads/2020/06/image-1.png?resize=768%2C472&ssl=1 768w, /assets/uploads/2020/06/image-1.png?resize=788%2C484&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" /> </figure> 

As you might have noticed, the URL is <a rel="noreferrer noopener" href="http://loki:3100/" target="_blank"><em>http://loki:3100</em></a>&nbsp;, as both Grafana and Loki are running in the _loki_ network in Docker.

That's all for now. <a href="https://www.davidguida.net/asp-net-core-structured-logging-part-3-the-code-finally/" target="_blank" rel="noreferrer noopener">Next time </a>we'll see how we can leverage <a rel="noreferrer noopener" href="https://serilog.net/" target="_blank">Serilog </a>in our .NET Core applications to send the log entries to Loki.

<div class="post-details-footer-widgets">
</div>