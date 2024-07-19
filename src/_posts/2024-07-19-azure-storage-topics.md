---
description: > 
  In this article we'll talk about basic messaging concepts and discuss what Topics are and how they can be implemented using Azure Storage Queues.
id: 8041
title: 'What's a Topic and how can we implement it using Azure Storage Queues?'
date: 2024-07-19T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8041
permalink: /azure-storage-topics
image: /assets/uploads/2024/07/azure-storage-topics.jpg
categories:  
  - .NET
  - Azure
  - Messaging
  - Events
---

I really like Azure ServiceBus, it's fast, reliable and really easy to integrate into a code base. But when I'm testing something out, or when I really don't want to worry too much about infrastructure, I'd rather use something simpler, like Azure Storage Queues. They're quite good for simple use cases and/or prototypes. 

### However, they lack one critical thing: Topics.

What's a _Topic_, you'd ask. Well, let me take a step back then.

Without going too much into the rabbit hole, when it comes to messages on a queue, we have two major categories: **commands** and **events**.

A *command* is a fire-and-forget operation, meant to be handled by **a single** consumer. Of course you can have multiple instances of this consumer application, all listening on the same queue. But they would all be **competing** for a message. In this case, first come, first served. 
#### A Command it's basically a request to get something done.

Another important property is that a Command should contain all the information necessary to the consumer for handling it.

On the other end, an *event* represents the encoded information about something that has happened on our system. We're basically broadcasting the fact that (for example) a new user account has been created and we want the rest of the world to know about it.

The usual naming convention is with the past tense: `UserCreated`, `OrderPlaced` and so on.
Events are meant to be picked up by multiple consumers, each one possibly belonging to a different *group*. 

Groups represent the logical context that would handle that specific event. For example, suppose we've published an `OrderPlaced` event. We can have a User Notification service picking it up, that would send an email to the customer. A Warehouse Notification service that would instead send an email to the warehouse manager. A Reporting service would record the information and use it to update the reports.

Each service might have multiple instances to improve resiliency, and each instance would belong to the same consumer group.

Unlike Commands, Events instead carry only the bare minimum information necessary. For example, in an `OrderPlaced`, we would probably find only the `OrderId`, and perhaps the `CustomerId`. Each interested service would then pull the data they need, based on _their_ requirements.

Now, why the long introduction? In Azure ServiceBus, we can create a Topic and link it to multiple *Subscriptions*, each one representing a consumer group. 

### Subscriptions are basically queues, all receiving the same message. 

As I mentioned before, Azure Storage Queue don't support Topics, which are the way we can easily broadcast an event to multiple subscriptions. I had some time on my hands during my summer break and I decided to fill the gap.
I spent some time researching and wrote a veeeery simple Custom Binding for Azure Functions, that I called <a href='https://github.com/mizrael/AzureStorageTopics' target='_blank'>Azure Storage Topics</a>.

Usage is pretty straightforward: just add the <a href='https://www.nuget.org/packages/AzureStorageTopics/' target='_blank'>Nuget package</a> to your Azure Functions project, then add the Output binding: 

```csharp
[FunctionName(nameof(SendToTopic))]
public static async Task<IActionResult> SendToTopic(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
    [StorageTopic("MyTopic")] IAsyncCollector<string> outputTopic)
{
    await outputTopic.AddAsync("hello world");

    return new OkObjectResult("wow");
}
```

Subscriptions can be configured directly in the `host.json` file:
```json
{
  "extensions": {
    "storageTopics": {
      "topics": {
        "MyTopic": {
          "subscriptions": [
            {
              "name": "Subscription1"
            },
            {
              "name": "Subscription2"
            }
          ]
        }
      }
    }
  }
}
```

Under the hood, the library is using the configuration from the `host.json` file to create one queue per subscription, using this naming convention: `topic-subscription`, lowercase.

When we're calling the `.AddAsync()` method to publish a message, the system would retrieve the topic's configuration, loop over the relative queues and send the message. 

Easy peasy :)
