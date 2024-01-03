---
description: >
  Welcome to another post of the Structured Logging with ASP.NET Series. This time we'll see how to write the code for integrating Serilog in our applications
id: 7326
title: 'ASP.NET Core structured logging - part 3: the code, finally!'
date: 2020-06-18T18:17:08-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7326
permalink: /asp-net-core-structured-logging-part-3-the-code-finally/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
dsq_thread_id:
  - "8083854757"
image: /assets/uploads/2020/06/structured-logging-infrastructure.jpg
categories:
  - .NET
  - ASP.NET
  - Microservices
tags:
  - .NET Core
  - ASP.NET Core
  - Grafana
  - Loki
  - Serilog
---
Hi! Welcome back to another post of the **Structured Logging** with ASP.NET Series. This time we'll see how to write the code to integrate **<a rel="noreferrer noopener" href="https://serilog.net/" target="_blank">Serilog </a>**in our applications and how to search for the logs in <a rel="noreferrer noopener" href="https://grafana.com/oss/loki/" target="_blank"><strong>Loki</strong></a>.

<a rel="noreferrer noopener" href="https://www.davidguida.net/asp-net-core-structured-logging-part-2-the-infrastructure/" target="_blank">Last time</a> we talked about the necessary infrastructure to host our log entries in a proper way. And by "proper" I mean something that lets us search, run queries and possibly even create charts and graphs.

So today we'll start immediately with the code. Let's start with how we can plug **Serilog** into our system.  
  
First of all, make sure to add these two NuGet packages to your ASP.NET Web API project:

<pre class="EnlighterJSRAW" data-enlighter-language="xml" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;ItemGroup>    
    &lt;PackageReference Include="Serilog.AspNetCore" Version="3.2.0" />
    &lt;PackageReference Include="Serilog.Sinks.Loki" Version="2.0.0" />
  &lt;/ItemGroup></pre>

Then open your **Program.cs** and update the Host creation like this:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup&lt;Startup>();
                }).UseSerilog((ctx, cfg) =>
                {
                    var credentials = new NoAuthCredentials(ctx.Configuration.GetConnectionString("loki"));

                    cfg.MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                        .Enrich.FromLogContext()
                        .Enrich.WithProperty("Application", ctx.HostingEnvironment.ApplicationName)
                        .Enrich.WithProperty("Environment", ctx.HostingEnvironment.EnvironmentName)
                        .WriteTo.LokiHttp(credentials);

                   if(ctx.HostingEnvironment.IsDevelopment())
                       cfg.WriteTo.Console(new RenderedCompactJsonFormatter());
                });</pre>

Few things to note here. First of all, I'm logging to both Console **and** Loki. It's up to you, feel free to disable it.

#### I am also "enriching" **all** the log entries with few additional properties, like "_Application_" and "_Environment_". They'll make our life easier later on when querying.

Secondly, I'm overriding the configuration for the "Microsoft" namespace to "Warning". The reason is pretty simple: the API pipeline is quite "chatty" and generates a lot of log entries. Now, to be clear, those definitely have some value, but in most of the cases you want **your** log entries to show up, not the ones from the libraries your system depends on.

Just to give you an idea of the difference, here's a screenshot of what would happen if we log everything:<figure class="wp-block-image alignwide size-large">

<a href="/assets/uploads/2020/06/image-3.png?ssl=1" target="_blank" rel="noopener noreferrer"><img loading="lazy" width="788" height="326" src="/assets/uploads/2020/06/image-3.png?resize=788%2C326&#038;ssl=1" alt="" class="wp-image-7332" srcset="/assets/uploads/2020/06/image-3.png?resize=1024%2C423&ssl=1 1024w, /assets/uploads/2020/06/image-3.png?resize=300%2C124&ssl=1 300w, /assets/uploads/2020/06/image-3.png?resize=768%2C317&ssl=1 768w, /assets/uploads/2020/06/image-3.png?resize=1536%2C635&ssl=1 1536w, /assets/uploads/2020/06/image-3.png?resize=2048%2C846&ssl=1 2048w, /assets/uploads/2020/06/image-3.png?resize=788%2C326&ssl=1 788w, /assets/uploads/2020/06/image-3.png?w=2364&ssl=1 2364w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a></figure> 

This instead is what happens when we filter Microsoft logs:<figure class="wp-block-image alignwide size-large">

<a href="/assets/uploads/2020/06/image-2.png?ssl=1" target="_blank" rel="noopener noreferrer"><img loading="lazy" width="2557" height="564" src="/assets/uploads/2020/06/image-2.png?fit=788%2C174&ssl=1" alt="" class="wp-image-7330" srcset="/assets/uploads/2020/06/image-2.png?w=2557&ssl=1 2557w, /assets/uploads/2020/06/image-2.png?resize=300%2C66&ssl=1 300w, /assets/uploads/2020/06/image-2.png?resize=1024%2C226&ssl=1 1024w, /assets/uploads/2020/06/image-2.png?resize=768%2C169&ssl=1 768w, /assets/uploads/2020/06/image-2.png?resize=1536%2C339&ssl=1 1536w, /assets/uploads/2020/06/image-2.png?resize=2048%2C452&ssl=1 2048w, /assets/uploads/2020/06/image-2.png?resize=788%2C174&ssl=1 788w, /assets/uploads/2020/06/image-2.png?w=2364&ssl=1 2364w" sizes="(max-width: 788px) 100vw, 788px" /></a></figure> 

The next step is to inject the Serilog middleware into the pipeline. Open the file **Startup.cs** and update it like this:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
    if (env.IsDevelopment()){
        app.UseDeveloperExceptionPage();
     }
     app.UseSerilogRequestLogging();
     // add all the other middlewares here
}</pre>

**Serilog** should be plugged in before most of the other middlewares, otherwise it won't be able to capture their entries.

And we're done with the initialization. Now it comes the fun part: writing our logs!

Technically speaking, it doesn't change much. I mean, you'll keep using the same methods but in a slightly different manner. 

Let's take a look at <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Web.API/EventHandlers/CustomerDetailsHandler.cs" target="_blank">CustomerDetailsHandler.cs</a> (code omitted for brevity):

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class CustomerDetailsHandler {
    public async Task Handle(EventReceived&lt;CustomerCreated> @event, CancellationToken cancellationToken)
    {
        _logger.LogInformation("creating customer details for {AggregateId} ...", @event.Event.AggregateId);</pre>

We basically assigned a **label** to the value of _@event.Event.AggregateId_ , this way we can later on leverage the Loki's querying capabilities and search for all the log entries for a given Aggregate:<figure class="wp-block-image alignwide size-large">

<a href="/assets/uploads/2020/06/image-4.png?ssl=1" target="_blank" rel="noopener noreferrer"><img loading="lazy" width="2556" height="1297" src="/assets/uploads/2020/06/image-4.png?fit=788%2C400&ssl=1" alt="" class="wp-image-7337" srcset="/assets/uploads/2020/06/image-4.png?w=2556&ssl=1 2556w, /assets/uploads/2020/06/image-4.png?resize=300%2C152&ssl=1 300w, /assets/uploads/2020/06/image-4.png?resize=1024%2C520&ssl=1 1024w, /assets/uploads/2020/06/image-4.png?resize=768%2C390&ssl=1 768w, /assets/uploads/2020/06/image-4.png?resize=1536%2C779&ssl=1 1536w, /assets/uploads/2020/06/image-4.png?resize=2048%2C1039&ssl=1 2048w, /assets/uploads/2020/06/image-4.png?resize=788%2C400&ssl=1 788w, /assets/uploads/2020/06/image-4.png?w=2364&ssl=1 2364w" sizes="(max-width: 788px) 100vw, 788px" /></a></figure> 

And this is the real power of **Structured Logging**, and it all resides in attaching a local context and the proper labels to the entries.

<div class="post-details-footer-widgets">
</div>