---
description: >
  In this second article we'll take a look at the Blazor Server and it's SignalR integration with OpenSleigh.
id: 8004
title: 'UI notifications system with Blazor and SignalR - part 2'
date: 2021-03-04T10:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8004
permalink: /ui-notifications-blazor-signalr-opensleigh-part-2/
image: /assets/uploads/2021/03/ui-notifications-blazor-signalr-opensleigh-part-2.jpg
tags:
  - .NET Core
  - ASP.NET Core
  - Sagas
  - Software Architecture
  - Design Patterns
  - OpenSleigh
  - Blazor
  - SignalR
---

Hi All! Welcome back to the second part of the Series. Today we're going to connect the last dots and take a look at the server.

The <a href="/ui-notifications-blazor-signalr-opensleigh-part-1/" target="_blank">last time</a> we gave a look at the client and saw how we can leverage Blazor and SignalR to show real-time updates to our users.

But who's generating those updates? And how?

Our users can trigger the execution of a multi-step operation. And since this operation can take some time, it has to run in the background, **without blocking the UI**.

Now, it might also be possible that the operation requires intervention of multiple services. In this case we can opt for either <a  href="/opensleigh-a-saga-management-library-for-net-core/"  target="_blank">orchestration or choreography</a>.

I personally prefer to use choreography to define business processes. I find easier to define the steps and to debug than with orchestration. Beware that it's not a hard choice for me, more a matter of taste and of course, requirements.

### In any case we always need to ensure <a href="/event-sourcing-on-azure-part-4-integration-events/" target='_blank'>proper correlation</a> and monitoring.

So! Our server is going to use <a href="https://www.opensleigh.net" target="_blank">**OpenSleigh**</a> to handle the choreography. In this example, I won't be really focusing on Transport or Persistence, so we'll be simply using the <a  href="https://www.nuget.org/packages/OpenSleigh.Persistence.InMemory/"  target='_blank'>in-memory driver</a>.

The first thing we have to do is to create a <a href="https://docs.microsoft.com/en-us/aspnet/core/signalr/hubs?view=aspnetcore-5.0&WT.mc_id=DOP-MVP-5003878" target="_blank">SignalR Hub</a> :

```csharp
public class SagaHub : Hub
{
    private readonly IMessageBus _bus;

    public SagaHub(IMessageBus bus)
    {
        _bus = bus ?? throw new ArgumentNullException(nameof(bus));
    }
    
    public async Task StartSaga(string clientId, int stepsCount)
    {
        var message = new StartSaga(stepsCount, clientId, Guid.NewGuid(), Guid.NewGuid());

        await _bus.PublishAsync(message);
    }
}
```
It has a very simple but important task: receive the start message from our Client and **trigger the execution of the Saga**.

Our Saga will handle these messages:

```csharp
public  record  StartSaga(int  StepsCount, string  ClientId, Guid  Id, Guid  CorrelationId) : IMessage;

public  record  ProcessNextStep(Guid  Id, Guid  CorrelationId) : IMessage;

public  record  SagaCompleted(Guid  Id, Guid  CorrelationId) : IEvent;
```

Let's take a look at each one.

`StartSaga` is the initiator. We'll use it to initialize the Saga State with the number of steps (sent from the UI) and the *Client ID*. This one contains the <a  href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.signalr.client.hubconnection.connectionid?view=aspnetcore-3.0?WT.mc_id=DOP-MVP-5003878" target="_blank">HubConnection's ConnectionId</a>, we'll need it to send the notifications back to the client.

Be careful though, as the documentation states very clearly:

> "This value will be cleared when the connection is stopped and will have a new value every time the connection is (re)established".

I want to focus on the general idea, so we won't be handling reconnections in this sample (at least not for now).

Our handler for the `StartSaga` message looks like this:

```csharp
public async Task HandleAsync(IMessageContext<StartSaga> context, CancellationToken cancellationToken = default) 
{
	this.State.ClientId = context.Message.ClientId;
	this.State.TotalSteps = context.Message.StepsCount;
	this.State.CurrentStep = 0;

	await SendNotification($"starting saga {context.Message.CorrelationId} with {State.TotalSteps} total steps...");

	await this.Bus.PublishAsync(
	    new ProcessNextStep(Guid.NewGuid(), context.Message.CorrelationId),
	    cancellationToken);
}
```

We first set the initial State, then we call `SendNotification()`  (we'll take a look at it in a second), and lastly, we trigger the execution of the first step with `ProcessNextStep`.

The `SendNotification` looks like this:
```csharp
private async Task SendNotification(string text, bool done = false)
{
    var client = _hubContext.Clients.Client(this.State.ClientId);
    await client?.SendAsync("Notification", text, done);
}
```
It makes use of an instance of <a href="https://docs.microsoft.com/en-us/aspnet/core/signalr/hubcontext?view=aspnetcore-5.0&WT.mc_id=DOP-MVP-5003878#get-an-instance-of-ihubcontext" target="_blank">`IHubContext<SagaHub>`</a>(that we injected in our Saga) to retrieve the initiating Client by ID and send a `Notification` to it. 
As we saw last time, the UI is already registered and handling these notifications by appending the text to the list.

The `ProcessNextStep` handler at this point will:
- check if we have reached the last step
- if we did, publish a `SagaCompleted` event
- otherwise, increase the inner steps counter
- send a notification to the Client
- send another `ProcessNextStep` message.

### I've decided to model `SagaCompleted` as an *event* instead of a *message* because with it we're not doing any actual work, but instead we're informing consumers that something already happened. 

They might take an action as consequence of it but it's not our Saga's concern. The UI is infact doing some operations, like re-enabling the "start" button, but again, our backend has no need to know about it. 

This is what will be logged on the server:

<p class="center">
<img class="" src="/assets/uploads/2021/03/opensleigh-sample8-server.png" />
</p>

That's all! Feel free to take a look at <a  href="https://github.com/mizrael/OpenSleigh/tree/develop/samples/Sample8" target="_blank">the repository on GitHub</a> and don't hesitate to write a comment!