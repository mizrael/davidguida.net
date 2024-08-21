---
description: > 
  Learn how to build an AI-powered Home Automation assistant using Semantic Kernel and Azure OpenAI
id: 8042
title: >
  AI Home Automation with Semantic Kernel part 1: introduction
date: 2024-08-21T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8042
permalink: /2024-08-21-ai-home-automation-with-semantic-kernel-part-1
image: /assets/uploads/2024/08/ai-home-automation-with-semantic-kernel-part-1.jpg
categories:  
  - .NET
  - Azure
  - OpenAI
  - Semantic Kernel
---

When I approach something new though, I always have to have a practical application or a simple project to build with it, otherwise I will soon lose interest.

Luckily, I recently moved to a new house and started messing with home automation. I am probably never going to build everything on my own, but in any case, this triggered me to start playing with AI.

I have been playing a bit with [Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/overview/) lately and it's increbile how easy it is to integrate it with an AI model and create something from scratch.

So, for my project I wanted to have some kind of chat application where I can ask the status of my home devices and possibly interact with them.

To keep things simple, I started with just lights and door sensors. The operations would basically be:
- listing all devices (perhaps specifying the type)
- get details about a specific device
- turn on/off a light
- open/close a door

### The point now is: how can I have the LLM interact with those devices? The answer is: Semantic Kernel!

The first step is to setup a Chat Completion service with a model hosted on Azure. This way I can have simple conversations in plain english, but there's no actual *interaction*. Now I need to make the agent understand prompts like "how many lights do I have?" or "turn the bathroom light off".

For this, I can leverage the concept of [Function Calling](https://platform.openai.com/docs/guides/function-calling) that some models expose. 

Functions are basically custom code we can write and expose to the model so that it can execute more advanced functionalities.

In simple terms:
- the user asks something
- the model parses the prompt and decides whether to use one or more of the registered functions
- the model tells the client application to run the functions (and can even pass parameters!)
- the model grabs the results and aggregates it with the LLM results to build the message that will be presented to the user

Semantic Kernel makes everything easy by allowing us to create Plugins, which encapsulate the Functions:

```csharp
public class MyFancyPlugin
{
  [KernelFunction("get_current_time")]
  [Description("Gets the current time")]
  [return: Description("the current time in UTC")]
  public DateTimeOffset GetCurrentTime()
  {
    return DateTimeOffset.UtcNow;
  }
}
```

As you can see, a Plugin is a simple class that exposes our custom methods. Each method has to be decorated with the `KernelFunction` attribute and at least one `Description`, which provides some context to the model.

Now all we have to do is to register it during startup`:
```csharp
var kernelBuilder = Kernel.CreateBuilder();
kernelBuilder.Plugins.AddFromType<MyFancyPlugin>();
var kernel = kernelBuilder.Build();
```

This way we can ask the model something like "can you tell me what time it is?".

There is already a [nice list](https://learn.microsoft.com/en-us/dotnet/api/microsoft.semantickernel.plugins.core?view=semantic-kernel-dotnet) of Plugins available and the team is actively adding more and more.

That's all for today! The next time we'll jump into the code and see how to plug all the pieces together and build our smart assistant.

But in case you're too curious, all the sources are already available on [GitHub](https://github.com/mizrael/SmartAssistant). Ciao!