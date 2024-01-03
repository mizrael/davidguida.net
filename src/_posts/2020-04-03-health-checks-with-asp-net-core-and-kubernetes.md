---
description: >
  Health checks are a fundamental part of our APIs. Let's find out how to add them to our ASP.NET Core services and how to configure Kubernetes to use them.
id: 7102
title: Health checks with ASP.NET Core and Kubernetes
date: 2020-04-03T04:00:39-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7102
permalink: /health-checks-with-asp-net-core-and-kubernetes/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/04/health-checks.jpg
categories:
  - ASP.NET
  - Docker
  - Kubernetes
  - Microservices
  - NuGet
  - Programming
tags:
  - ASP.NET Core
  - kubernetes
  - microservices
  - programming
---
**Health checks** are a fundamental part of our APIs. I guess they fall in that category of &#8220;non-functional-but-**heavily**-required&#8221; things. More or less like a good part of the infrastructure code.

They don&#8217;t add business value per se but have an enormous impact for IT people. More or less like <a href="https://www.davidguida.net/lets-do-some-ddd-with-entity-framework-core-3/" target="_blank" rel="noreferrer noopener">DDD</a> and Design Patterns. You can normally see them in conjunction with container orchestration or monitoring tools to ensure that the system is alive and kicking.

There are mainly two categories of **health checks**: readiness and liveness.

Readiness health checks perform an in-depth check of all the application dependencies, such as databases, external services and so on and so forth. The system is booting, alive but **not yet** ready to serve incoming requests.

Liveness health checks are instead used to signal that the application is ready to serve traffic. They should execute fairly quickly and serve as an immediate probe to ensure everything is fine.

#### The idea is to first run the readiness checks. If they pass, rely only on the liveness ones for a specific amount of time.

A successful health check should return a 200 HTTP status and a basic report, especially for the readiness ones.

Setting up checks in an ASP.NET Core project is fairly easy. Just add a call to `services.AddHealthChecks()` in the `ConfigureServices()` method of our `Startup.cs` .

On GitHub there are few interesting repositories that add some nice extension methods. [AspNetCore.Diagnostics.HealthChecks](https://github.com/Xabaril/AspNetCore.Diagnostics.HealthChecks) is one of the most famous, exposing checks for a wide range of systems like SQL Server, MySql, Oracle, Kafka, Redis, and many others.

Once you&#8217;ve registered the checks on the DI Container, the next step is to expose the endpoint:

<pre class="wp-block-code"><code>public void Configure(IApplicationBuilder app)
{
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapHealthChecks("/ops/health");
    });
}</code></pre>

This is the simplest example possible, however, the MapHealthChecks() methods give us also the possibility to customize the output by specifying a Response Writer:

Based on the checks you&#8217;ve added, this should return something like this:

<pre class="wp-block-code"><code>{
  "status": "Healthy",
  "results": {
    "db": {
      "status": "Healthy",
      "description": null,
      "data": {}
    }
  }
}</code></pre>

Now, I mentioned &#8220;container orchestration&#8221; at the beginning of this article. Nowadays this tends to rhyme with **Kubernetes**, which has its own configuration for health checks. In your `configuration.yml` file you can specify both liveness and readiness:

<pre class="wp-block-code"><code>readinessProbe:
    httpGet:
        path: /health/readiness
        port: 80
    initialDelaySeconds: 10
    timeoutSeconds: 30
    periodSeconds: 60
    successThreshold: 1
    failureThreshold: 5
livenessProbe:
    httpGet:
        path: /health/liveness
        port: 80
    initialDelaySeconds: 10
    timeoutSeconds: 5
    periodSeconds: 15
    successThreshold: 1
    failureThreshold: 3</code></pre>

Few things to note here. First of all, the endpoints are different. As we discussed previously, we can (and should) split our checks in order to let the liveness ones to run as quickly as possible. 

This can be accomplished for example by simply skipping all the checks and return a 200 right away:

<pre class="wp-block-code"><code>endpoints.MapHealthChecks("/health/readiness", healthCheckOptions);

endpoints.MapHealthChecks("/health/liveness", new HealthCheckOptions(){
    Predicate = (_) => false
});</code></pre>

That `Predicate` allows filtering the checks based on various conditions like name or tags. Yes, those are a thing and can be specified. More <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-3.1#filter-health-checks" target="_blank">details here</a>.

Going back to our k8s config, another thing worth mentioning is the different settings used for the checks. For example, `timeoutSeconds` is higher when probing for readiness as we are making sure that all our dependencies are alive. Same thing for `periodSeconds` : we want liveness checks to be executed more often.

Moreover, don&#8217;t forget that if the `failureThreshold` is surpassed for liveness, the Pod will be killed. Failing readiness will cause the pod to be marked as **Unhealthy** instead, and not receive traffic anymore.

<div class="post-details-footer-widgets">
</div>