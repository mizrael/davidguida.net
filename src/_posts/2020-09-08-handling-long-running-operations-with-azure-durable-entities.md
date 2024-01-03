---
description: >
  In this post we're going to see a simple way to execute long-running operations and keep track of the status using Azure Durable Entities.
id: 7697
title: Handling long-running operations with Azure Durable Entities
date: 2020-09-08T22:31:43-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7697
permalink: /handling-long-running-operations-with-azure-durable-entities/
zakra_layout:
  - tg-site-layout--customizer
zakra_remove_content_margin:
  - "0"
zakra_transparent_header:
  - customizer
zakra_page_header:
  - "1"
zakra_logo:
  - "0"
image: /assets/uploads/2020/09/growing-plants.jpg
categories:
  - .NET
  - ASP.NET
  - Azure
  - Design Patterns
  - Software Architecture
tags:
  - .NET Core
  - Actor Model
  - Azure
  - Azure Functions
  - message queues
---
Long-running operations. Everyone, at some point in their career, has to face a time-consuming task. And on many occasions you also need to know what&#8217;s the status and what&#8217;s going on right now. Did it fail? Did it complete successfully? 

Today we&#8217;re going to see a simple way to execute a long-running operation and keep track of the status using **<a href="https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-entities?WT.mc_id=DOP-MVP-5003878&tabs=csharp" target="_blank" rel="noreferrer noopener">Azure Durable Entities</a>.**

I feel I&#8217;m in some kind of &#8220;writing spree&#8221; these days. I have 3 other Series still to complete (<a href="https://www.davidguida.net/blazor-and-2d-game-development-part-1-intro/" target="_blank" rel="noreferrer noopener">Blazor Gamedev</a>, <a href="https://www.davidguida.net/event-sourcing-on-azure-part-1-architecture-plan/" target="_blank" rel="noreferrer noopener">Event Sourcing on Azure</a>, and <a href="https://www.davidguida.net/testing-azure-functions-on-azure-devops-part-1-setup/" target="_blank" rel="noreferrer noopener">Azure Function Testing</a>), but still, I feel the urge of writing about a different topic. Feels like I&#8217;m afraid of losing that thought if I don&#8217;t put it &#8220;into stone&#8221; here on this blog. I&#8217;m sure many of you can relate. 

And the same happens when I&#8217;m working. Although, funnily enough, I spend quite some time wandering through the house, doing _apparently_ nothing. It&#8217;s quite hard to explain to my wife that in those moments I&#8217;m trying to get rid of the _writer&#8217;s block_ and find the right solution for a problem I&#8217;m facing. 

#### Coding, as usual, it&#8217;s always the last thing, the least important. It&#8217;s the byproduct of an ardent, fervent process of creation and design.

Anyways, let&#8217;s get back on track! Long-running operations. By definition, they _take time._ A lot. This of course means that we can&#8217;t execute them during an HTTP request, or directly from a UI input. The system will timeout, as well as the user&#8217;s patience.

What we can do instead is offload that computation to the background. But still, we need a way to communicate the status to the caller (or any other interested party). For that we have basically two options:

  1. _**polling**_. By exposing a GET endpoint, everyone can poke the system and get the status. Nice, but not very efficient: lots of time and unnecessary HTTP requests wasted. It&#8217;s like when you&#8217;re working on something very complex and someone is constantly asking you &#8220;are we done?&#8221;. You&#8217;ll also lose time answering.
  2. _**pub/sub**_. Paradigm shift: clients won&#8217;t ping the system anymore, but will get informed _directly ****_by it when the work is done.  
    &#8220;Are we done?&#8221; &#8220;We&#8217;re done when I tell you we&#8217;re done&#8221;.

Nothing prevents us to implement both the options, it&#8217;s just a matter of taste.

For the actual execution instead, we can make use of **Azure Durable Entities.** They&#8217;ll do the job for us, and at the same time keep track of what&#8217;s going on. We talked about **Durable Entities** already <a href="https://www.davidguida.net/how-to-use-azure-durable-entities-to-see-whos-the-strongest-avenger/" target="_blank" rel="noreferrer noopener">in another post</a>, so I&#8217;m not going to introduce them again. 

<div class="wp-block-image">
  <figure class="aligncenter size-large"><a href="/assets/uploads/2020/09/image.png?ssl=1"><img loading="lazy" width="788" height="411" src="/assets/uploads/2020/09/image.png?resize=788%2C411&#038;ssl=1" alt="" class="wp-image-7704" srcset="/assets/uploads/2020/09/image.png?resize=1024%2C534&ssl=1 1024w, /assets/uploads/2020/09/image.png?resize=300%2C157&ssl=1 300w, /assets/uploads/2020/09/image.png?resize=768%2C401&ssl=1 768w, /assets/uploads/2020/09/image.png?w=1142&ssl=1 1142w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a></figure>
</div>

Let&#8217;s start from left to right. We have 2 HTTP endpoints: _POST-ing_ to _/processes_ will put a message on a queue and return a 202 straight away. It will also generate an id and set the <a href="https://docs.microsoft.com/en-us/rest/api/searchservice/common-http-request-and-response-headers-used-in-azure-search?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Location header</a> pointing to the second endpoint. 

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">[FunctionName("RequestProcess")]
public static async Task&lt;IActionResult> RequestProcess(
	[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "/processes")] HttpRequest req,
	[Queue(QueueName, Connection = QueueConnectionName)] CloudQueue encryptionRequestsQueue)
{
	var command = new StartOperation(Guid.NewGuid());

	var jsonMessage = System.Text.Json.JsonSerializer.Serialize(command);
	await encryptionRequestsQueue.AddMessageAsync(new CloudQueueMessage(jsonMessage));

	return new AcceptedObjectResult($"processes/{command.RequestId}", command);
}</pre>

The GET endpoint will return a 200 or a 202 if the system is still processing the operation. We might also decide to return a different status in case of error, it&#8217;s up to you. 

Now the juicy part: the message on the queue will inform the system that it&#8217;s time to roll up the sleeves and do some real work:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">[FunctionName("RunProcess")]
public static async Task RunProcess([QueueTrigger(QueueName, Connection = QueueConnectionName)] string message,
	[DurableClient] IDurableEntityClient client)
{
	var command = Newtonsoft.Json.JsonConvert.DeserializeObject&lt;StartOperation>(message);
	var entityId = new EntityId(nameof(LongRunningProcessOrchestrator), command.RequestId.ToString());
	await client.SignalEntityAsync&lt;ILongRunningProcessOrchestrator>(entityId, e => e.Start(command));
}</pre>

The code is pretty straightforward: it deserializes the command from the message and spins up an _Orchestrator Entity_. This one will serve two purposes: spinning up a _Runner Entity_ and keeping track of the state. 

#### We can&#8217;t run the process directly in the orchestrator, otherwise the system won&#8217;t be able to properly store the current state. 

Better offload (again, yes) the work to someone else:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public void Start(StartOperation command)
{
	this.Id = command.RequestId;
	this.Status = ProcessStatus.Started;

	var runnerId = new EntityId(nameof(LongRunningProcessRunner), command.RequestId.ToString());
	_context.SignalEntity&lt;ILongRunningProcessRunner>(runnerId, r => r.RunAsync(command));
}</pre>

Moreover, this way we can have different types of _Runner Entities_ and trigger one or another based on the input command.

Once triggered, the _Runner_ will do whatever it&#8217;s meant to do and then call back the Orchestrator. It might also pass some details about the result of the operation, if needed:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public async Task RunAsync(StartOperation command)
{
        // do something very very time-consuming
	var orchestratorId = new EntityId(nameof(LongRunningProcessOrchestrator), command.RequestId.ToString());
	_context.SignalEntity&lt;ILongRunningProcessOrchestrator>(orchestratorId, r => r.OnCompleted());
}</pre>

And here&#8217;s the final part: in the _OnCompleted()_ method, the Orchestrator will update its state and finally go to rest:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public void OnCompleted()
{
	Status = ProcessStatus.Completed;	
}</pre>

This is also the place where you might want to send the <a href="https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions?WT.mc_id=DOP-MVP-5003878#topics-and-subscriptions" target="_blank" rel="noreferrer noopener">integration event </a>to the subscribers, informing them the work is completed (maybe).

The code for a working sample <a href="https://github.com/mizrael/AzureLongRunningProcess" target="_blank" rel="noreferrer noopener">is available on GitHub</a> as usual, let me know what you think. À la prochaine!

<div class="post-details-footer-widgets">
</div>