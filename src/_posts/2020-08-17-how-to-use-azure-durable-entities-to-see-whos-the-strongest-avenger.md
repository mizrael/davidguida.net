---
description: >
  Ever wondered who's the strongest Avenger? Would it be Thor or Hulk? Now you can find out by using Azure Durable Entities !
id: 7552
title: 'How to use Azure Durable Entities to see who's the strongest Avenger'
date: 2020-08-17T18:12:55-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7552
permalink: /how-to-use-azure-durable-entities-to-see-whos-the-strongest-avenger/
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
image: /assets/uploads/2020/08/azure-function-entities-avengers.png
categories:
  - .NET
  - Azure
  - Blazor
tags:
  - Actor Model
  - Azure
  - Azure Functions
  - Blazor
---
In the movies, Thor keeps saying that he "is the strongest Avenger". Some people say that it's actually Hulk, but I guess it's a matter of perspective. How can we find a solution to this riddle? By using **Azure Durable Entities** of course!

Azure Durable Functions have been a very nice addition to the Azure ecosystem. They basically let you write stateful functions and run them serverless. There's as usual a whole plethora of patterns you can apply with them, like Function Chaining

<div class="wp-block-image">
  <figure class="aligncenter size-large"><a href="https://i0.wp.com/docs.microsoft.com/en-us/azure/azure-functions/durable/media/durable-functions-concepts/function-chaining.png?ssl=1" target="_blank" rel="noopener noreferrer"><img src="https://i0.wp.com/docs.microsoft.com/en-us/azure/azure-functions/durable/media/durable-functions-concepts/function-chaining.png?w=788&#038;ssl=1" alt="" data-recalc-dims="1" /></a></figure>
</div>

or Fan out/Fan in

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img src="https://i2.wp.com/docs.microsoft.com/en-us/azure/azure-functions/durable/media/durable-functions-concepts/fan-out-fan-in.png?w=788&#038;ssl=1" alt="" data-recalc-dims="1" /></figure>
</div>

or Monitors

<div class="wp-block-image">
  <figure class="aligncenter size-large"><a href="https://i2.wp.com/docs.microsoft.com/en-us/azure/azure-functions/durable/media/durable-functions-concepts/monitor.png?ssl=1" target="_blank" rel="noopener noreferrer"><img src="https://i2.wp.com/docs.microsoft.com/en-us/azure/azure-functions/durable/media/durable-functions-concepts/monitor.png?w=788&#038;ssl=1" alt="" data-recalc-dims="1" /></a></figure>
</div>

There's a full list available in the <a href="https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview?WT.mc_id=DOP-MVP-5003878&tabs=csharp" target="_blank" rel="noreferrer noopener">official docs</a>, make sure to take a look.

Durable Functions currently come in four different types: Activity, Orchestrator, Entity, and Client. I've done a bit of work with all of them and today I'm going to talk a bit about **Entity** **Functions**.

**Entity Functions** define operations for reading and updating small pieces of state, known as&nbsp;_durable entities_. They act as small tiny services that talk between each other via messages. Each entity has a unique id and an internal state. When triggered, they can update their state and/or send a message to other entities. Or do other things like calling external services, triggering orchestrations, and so on.

#### It is also very important to note that **Entity Functions** focus on reliability more than performance, by using reliable queues to handle messaging.

**Entity Functions** are basically another form of the <a rel="noreferrer noopener" href="https://en.wikipedia.org/wiki/Actor_model" target="_blank">Actor Model</a> and share a lot of similarities with <a rel="noreferrer noopener" href="http://dotnet.github.io/orleans/" target="_blank">Project Orleans</a>, although with some <a href="https://en.wikipedia.org/wiki/Actor_model?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">interesting differences</a>. 

To showcase how they work, I prepared a super-duper example, <a href="https://whoisthestrongestapp.azurewebsites.net/" target="_blank" rel="noreferrer noopener">WhoIsTheStrongest</a> 😀 It's a distribute voting platform, aimed to decide who's the _strongest Avenger_! The code is <a href="https://github.com/mizrael/WhoIsTheStrongest" target="_blank" rel="noreferrer noopener">available on GitHub</a>, feel free to wander around.

The UI is written in **Blazor** and to be fair, there's nothing much to say. You can pick your favorite Avenger, click on the button and vote. The system will record your choice and after few seconds you'll see the updated leaderboard. 

<div class="wp-block-image">
  <figure class="aligncenter size-large"><a href="/assets/uploads/2020/08/image-2.png?ssl=1" target="_blank" rel="noopener noreferrer"><img loading="lazy" width="788" height="317" src="/assets/uploads/2020/08/image-2.png?resize=788%2C317&#038;ssl=1" alt="" class="wp-image-7559" srcset="/assets/uploads/2020/08/image-2.png?w=824&ssl=1 824w, /assets/uploads/2020/08/image-2.png?resize=300%2C121&ssl=1 300w, /assets/uploads/2020/08/image-2.png?resize=768%2C309&ssl=1 768w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a></figure>
</div>

The bulk of the logic is handled by Durable Entities: the first time an Avenger gets a vote, the system will generate an Id and spin up an Entity instance. The <a href="https://github.com/mizrael/WhoIsTheStrongest/blob/master/WhoIsTheStrongest.Server/Functions/CharacterScore.cs" target="_blank" rel="noreferrer noopener">Entity state</a> will hold the score and the last vote date. Azure will take care of the rest. The next time the score is incremented, the framework will instantiate the Entity, deserialize its state, and run the operation.

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">[JsonObject(MemberSerialization.OptIn)]
public class CharacterScore 
{
	[JsonProperty("score")]
	public int Score { get; private set; }

	[JsonProperty("lastIncrement ")]
	public DateTime LastIncrement { get; private set; }

	public void Increment()
	{
		this.Score++;
		this.LastIncrement = DateTime.UtcNow;
	}

	[FunctionName(nameof(CharacterScore))]
	public static Task Run([EntityTrigger] IDurableEntityContext ctx) => ctx.DispatchAsync&lt;CharacterScore>();
}</pre>

Few things to note:

  * The&nbsp;`Run`&nbsp;function contains the boilerplate required for using the class-based syntax. It must be a&nbsp;_static_&nbsp;Azure Function.&nbsp;
  * an Entity is a regular POCO class. Public callable operations must return a Task or void.
  * an Entity must be JSON-serializable

A full list of constraint is as usual available <a href="https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-dotnet-entities#defining-entity-classes?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">in the docs</a>.

The score increment operation on an Entity can be triggered by a message in a Queue. The system also exposes an HTTP GET endpoint, returning the current leaderboard. Those are standard Azure Functions, which get an instance of <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.idurableentityclient?view=azure-dotnet?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">IDurableEntityClient </a>as input. This client is what allows them to interact and call operations on Entities.

<div class="post-details-footer-widgets">
</div>