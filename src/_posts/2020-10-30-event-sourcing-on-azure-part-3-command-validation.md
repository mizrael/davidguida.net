---
description: >
  Here's the third part of the Event Sourcing on Azure series. Today we'll see how we can handle Command Validation before it execution.
id: 7795
title: 'Event Sourcing on Azure - part 3: command validation'
date: 2020-10-30T12:54:24-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7795
permalink: /event-sourcing-on-azure-part-3-command-validation/
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
image: /assets/uploads/2020/10/command-validation.jpg
categories:
  - .NET
  - ASP.NET
  - Azure
  - Design Patterns
tags:
  - ASP.NET Core
  - Azure
  - CosmosDB
  - CQRS
  - design patterns
  - dotnetcore
---
Hi All! Welcome back for the third part of the **Event Sourcing on Azure** series. Today we'll see how we can do some easy validation on a Command before triggering its execution.

<a href="https://www.davidguida.net/event-sourcing-on-azure-part-2-events-persistence/" target="_blank" rel="noreferrer noopener">Last time</a> we saw how we can use <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/azure/cosmos-db/introduction?WT.mc_id=DOP-MVP-5003878" target="_blank"><strong>CosmosDB </strong></a>and **<a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview?WT.mc_id=DOP-MVP-5003878" target="_blank">ServiceBus</a>** to store the events for our Aggregates. It's not a full solution and there are still some gray areas, but I think we covered most of the ground.

However, every respectable application needs to validate the data before processing and storing it. We can't just create a new Customer in our system because somebody told us to. What if we got bad input data?

I <a href="https://www.davidguida.net/cqrs-on-commands-and-validation-part-2-the-base-handler/" target="_blank" rel="noreferrer noopener">wrote already</a> about Command Validation in CQRS in the past. Well, that was almost 4 years ago. It's **ancient**, but the idea stands still. 

For <a rel="noreferrer noopener" href="https://github.com/mizrael/SuperSafeBank" target="_blank">SuperSafeBank</a> I decided to take a more agile approach and start by adding validation code directly in the **Command Handlers**. Why? Well because I want to keep things simple, that's it. 

So, let's go back to our Create Customer command:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class CreateCustomer
{	
	public Guid CustomerId { get; }
	public string FirstName { get; }
	public string LastName { get; }
	public string Email { get; }
}</pre>

For the sake of the example, let's say that the only thing we want to make sure is that the email address is unique across the system. We are not doing any validation on the _format_ though. 

#### Command Validation should make sure the _business rules_ are satisfied. The other "basic" concerns like ranges, formats and so on, should be handled before it by creating the proper [Value Objects.](https://martinfowler.com/bliki/ValueObject.html)

The Command includes also a pre-populated Customer ID. We don't want to rely on the Persistence layer to give it back to us because CQRS Commands should be almost _fire-and-forget_. Command execution <a href="https://www.davidguida.net/command-handlers-return-values-in-cqrs/" target="_blank" rel="noreferrer noopener">won't return</a> any result. It's either they work or they immediately throw. 

But we need an ID back, so an option would be to generate a random GUID when we create the Command:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">[HttpPost]
public async Task&lt;IActionResult> Create(CreateCustomerDto dto, CancellationToken cancellationToken = default)
{
	if (null == dto)
		return BadRequest();
	var command = new CreateCustomer(Guid.NewGuid(), dto.FirstName, dto.LastName, dto.Email);
	await _commandHandler.Process(command, cancellationToken);
	
	return CreatedAtAction("GetCustomer", new { id = command.Id }, command);
}</pre>

Now, another thing we need is a Customer Emails service. Something basic, responsible of just storing emails and checking if one exists already:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public interface ICustomerEmailsService
{
	Task&lt;bool> ExistsAsync(string email);
	Task CreateAsync(string email, Guid customerId);
}</pre>

We'll write <a href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Web.Persistence.Azure/Services/CustomerEmailsService.cs" target="_blank" rel="noreferrer noopener">an implementation</a> based on **CosmosDB**, using the Email address as <a href="https://docs.microsoft.com/en-us/azure/cosmos-db/partitioning-overview?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Partition Key</a>. 

The final step is to connect the dots and add the validation to the <a href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Domain/Commands/CreateCustomer.cs" target="_blank" rel="noreferrer noopener">Command handler</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class CreateCustomerHandler : INotificationHandler&lt;CreateCustomer>
{
	private readonly IEventsService&lt;Customer, Guid> _eventsService;
	private readonly ICustomerEmailsService _customerEmailsRepository;

	public async Task Handle(CreateCustomer command, CancellationToken cancellationToken)
	{
		if (await _customerEmailsRepository.ExistsAsync(command.Email)){
			var error = new ValidationError(nameof(CreateCustomer.Email), $"email '{command.Email}' already exists");
			throw new ValidationException("Unable to create Customer", error);
		}

		var customer = new Customer(command.Id, command.FirstName, command.LastName, command.Email);
		await _eventsService.PersistAsync(customer);
		await _customerEmailsRepository.CreateAsync(command.Email, command.Id);
	}
}</pre>

Since we're nice people, we can configure our system to capture <a href="https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Core/ValidationException.cs" target="_blank" rel="noreferrer noopener">ValidationExceptions </a>and return them to the user in the <a href="https://tools.ietf.org/html/rfc7807" target="_blank" rel="noreferrer noopener">proper format</a>. Andrew Lock wrote <a href="https://andrewlock.net/handling-web-api-exceptions-with-problemdetails-middleware/" target="_blank" rel="noreferrer noopener">a very good post</a> about Problem Details, showing how to leverage a Middleware to handle them.

Now, in an ideal world this could be enough. But what happens if an error occurs when we store the customer email? We already have persisted the events, but not saving the email means that we might get past the validation with the same address. This will result in two customers with the same email being created, which would break our business rules.

So how can we handle this? One option is to add Transaction support and rollback the whole Handler execution if things go south. For more details, you can take a look at the <a rel="noreferrer noopener" href="https://www.davidguida.net/improving-microservices-reliability-part-1-two-phase-commit/?swcfpc=1" target="_blank">Two-Phase-Commit</a> technique or the <a rel="noreferrer noopener" href="https://www.davidguida.net/improving-microservices-reliability-part-2-outbox-pattern/" target="_blank">Outbox Pattern</a>.

<a href="https://www.davidguida.net/event-sourcing-on-azure-part-4-integration-events/" target="_blank" rel="noreferrer noopener">The next time </a>we'll see what happens to the Aggregate Events once a Command is executed.

Ciao!

<div class="post-details-footer-widgets">
</div>