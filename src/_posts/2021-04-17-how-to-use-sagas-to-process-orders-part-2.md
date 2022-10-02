---
description: >
  In this article we'll take a look at the code and see how we can configure OpenSleigh to orchestrate of our Order Processing Saga.
id: 8006
title: 'How to use Sagas to process orders - part 2'
date: 2021-04-17T10:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8006
permalink: /how-to-use-sagas-to-process-orders-part-2/
image: /assets/uploads/2021/04/how-to-use-sagas-to-process-orders-part-2.jpg
tags:
  - .NET Core
  - ASP.NET Core
  - Sagas
  - Software Architecture
  - Design Patterns
  - OpenSleigh
---
Hi All and welcome back to the second article of the Series. Today we're going to take a look at the code and see how we can configure **<a href="www.opensleigh.net" target="_blank">OpenSleigh</a>** to act as the orchestrator of our Order Processing Saga.

So, <a target="_blank" href="/how-to-use-sagas-to-process-orders-part-1/">last time</a> we defined the overall workflow and which different services were involved. Just as a recap:

- Inventory service, called to make sure we have products in stock
- Payment service, called to finalize the payment form the customer
- Shipping service, called to send the items to the customer

Again, this is an *extreme* oversimplification of a regular e-commerce flow, but I suppose it should be enough to give the idea.

The first thing to do, of course, is to install the **OpenSleigh** <a href="https://www.nuget.org/packages/OpenSleigh.Core/" target="_blank">Nuget package</a>, by running `dotnet add package OpenSleigh.Core` . 

You also have to install a Persistence and a Transport package too, of course At the moment I have added support for CosmosDB, MSSQL, MongoDB, RabbitMQ, Azure ServiceBus and Kafka. There's an In-Memory driver as well, super useful when running on local and/or writing tests.

Once you've done that, the next step is to configure the system in your Composition Root. You can find the documentation for this on the <a target="_blank" href="https://www.opensleigh.net/how-to/transport-persistence-configuration.html">official website</a>, so I'm not going to spend much time on it.

Our Orchestrator Saga will be modelled more or less like this:
```csharp
public class OrderSaga :
        Saga<OrderSagaState>,
        IStartedBy<SaveOrder>,
        IHandleMessage<CrediCheckCompleted>,
        IHandleMessage<InventoryCheckCompleted>,
        IHandleMessage<ShippingCompleted>
{
	// code omitted for brevity
}
```
As you can see, the Saga will react to a `SaveOrder` message. Let's take a look at its handler:

```csharp
public async Task HandleAsync(IMessageContext<SaveOrder> context, CancellationToken cancellationToken = default)
{
	this.State.OrderId = context.Message.OrderId;
	
	var startCreditCheck = ProcessCreditCheck.New(context.Message.OrderId);
	this.Publish(startCreditCheck);

	var startInventoryCheck = CheckInventory.New(context.Message.OrderId);
  this.Publish(startInventoryCheck);
}
```
We are basically requesting the execution of both the Credit and the Inventory Check, concurrently. Of course, the two microservices responsible won't return the result at the same time, but it's not a problem for us. At least not in this context. 
### The main idea is, in fact, to react to two events, `CrediCheckCompleted` and `InventoryCheckCompleted`. When both are completed, we'll send a `ProcessShipping` command.

Our Saga State will be indeed something like this:
```csharp
public class OrderSagaState : SagaState{
	public OrderSagaState(Guid id) : base(id){}

  public Guid OrderId { get; set; }
	public bool CreditCheckCompleted { get; set; } = false;
	public bool InventoryCheckCompleted{ get; set; } = false;
}
```

This way, when we receive, say, the `InventoryCheckCompleted` event, all we have to do is check if we're done. If so, we can proceed shipping the items to our beloved customer:

```csharp
public async Task HandleAsync(IMessageContext<InventoryCheckCompleted> context, CancellationToken cancellationToken = default)
{
	this.State.InventoryCheckCompleted = true;
	if (CheckCanShipOrder(cancellationToken)) {
		var message = ProcessShipping.New(this.State.OrderId);
		this.Publish(message);
	}
}

private bool CheckCanShipOrder(CancellationToken cancellationToken = default)
{
	var checksFulfilled = this.State.CreditCheckCompleted && this.State.InventoryCheckCompleted;
  return checksFulfilled;
}
```

And that's it from the Orchestrator perspective.

Each microservice will have it's own Saga, taking care of the relative local transaction. For example, the Inventory service might have something like this:

```csharp
public class InventoryCheckSaga :
    Saga<InventoryCheckSagaState>,
    IStartedBy<CheckInventory>
{
  public async Task HandleAsync(IMessageContext<CheckInventory> context, CancellationToken cancellationToken = default)
  {
    // do something meaningful and then...
    
    var message = InventoryCheckCompleted.New(context.Message.OrderId);
    this.Publish(message);

    this.State.MarkAsCompleted();
  }
}
```

Byt having the `InventoryCheckCompleted` class implementing the `IEvent` interface, we allow multiple consumer types to receive and react to it.
This is extremely useful, because we can add other subscribers, not just the main Orchestrator. 
### We could, for example, add a *Notifications* service, that takes care of sending emails to the customer, informing him of the status of the order. 

For those interested, a working example can be found <a href="https://github.com/mizrael/OpenSleigh/tree/develop/samples/Sample4" target="_blank">here</a>. 

Have fun!