---
description: >
  After almost a year, here's my thoughts on Event Sourcing and how my SuperSafeBank repo evolved so far.
id: 8019
title: 'My Event Sourcing journey so far'
date: 2021-12-23T12:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8019
permalink: /my-event-sourcing-journey-so-far/
image: /assets/uploads/2021/12/my-event-sourcing-journey-so-far.jpg
categories:
  - .NET
  - ASP.NET
  - Azure
  - Design Patterns
  - Microservices
  - Software Architecture
tags:
  - Azure
  - DDD
  - design patterns
  - software architecture
---

Almost a year has passed since <a href='/event-sourcing-on-azure-part-4-integration-events/' target='_blank'>my last article</a> on **Event Sourcing**. I left the <a href='https://github.com/mizrael/SuperSafeBank/' target='_blank'>SuperSafeBank repository</a> untouched for a while, I definitely needed some fresh air. 
In the meantime, I noticed with pleasure that there was some interest: it got forked and received a decent amount of stars.

### In March I'll be giving a talk about Event Sourcing at the <a href='https://events.geekle.us/software_architecture/#speakers' target='_blank'>Worldwide Software Architecture Summit '22</a>, so I decided it was the right time to do some house cleaning.

Now, like every other time I went through some "old-ish" codebase of mine, I kept having those recurring WTF moments. 

<div class='center'>
  <img src='/assets/uploads/2021/12/WTF_per_h.png' title='WTF per minute' alt='WTF per minute'>
</div>

"Did I really wrote that?". In total honesty I find this to be a really good sign. Means that after this time, I grew as developer, learned new techniques, *acquired new knowledge*.

### It would be a personal defeat realising that I've learned nothing new in a whole year.

So, what did I change? Well, few bits, here and there. Let's start from the easiest one: I ported everything to <a href='https://devblogs.microsoft.com/dotnet/announcing-net-6/' target='_blank'>.NET6</a>. From the code perspective, this resulted in few changes, from <a href='https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record' target='_blank'>record types</a> to the <a href='https://docs.microsoft.com/en-us/dotnet/core/tutorials/top-level-templates' target='_blank'>new console app template</a>.

After that, I also decided to avoid reusing Domain Events as Integration Events, and introduced <a href='https://github.com/mizrael/SuperSafeBank/tree/master/SuperSafeBank.Domain/IntegrationEvents' target='_blank'>proper classes</a> for those. Why? Well, I gave it a try after a conversation on LinkedIn and some googling. The resulting desing got definitely cleaner, and it also gives me an easier way to manually pick which events I want to be broadcasted to subscribers. 

### The previous implementation instead was directly publishing every Domain Event, right after having persisted them on the Event Store. 

Now, I don't see this necessarily as a big issue. Publishing Integration Events in a reliable way also means the introduction of a retry mechanism (<a href='https://github.com/App-vNext/Polly' target='_blank'>Polly</a> anyone?) and/or an <a href='/improving-microservices-reliability-part-2-outbox-pattern/' target='_blank'>Outbox</a>. 
Publishing Domain Events instead, leverages the fact that those events are already persisted by definition into our Event Store, which makes things somewhat simpler.

Next one: the Event Consumers. I decided to split both the On-Premise and the Azure projects into two parts each:
- one API to handle Queries and Commands
- one Worker to process incoming Events (eg. for refreshing Materialized Views)

Now, let's have a look at one of these Workers, for example the one responsible for rebuilding the <a href='https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Service.Core.Persistence.Mongo/EventHandlers/CustomerDetailsHandler.cs' target='_blank'>Customer Details view</a>. This is how our view looks like:

```csharp
public record CustomerAccountDetails(Guid Id, Money Balance);
public record CustomerDetails(Guid Id, string Firstname, string Lastname, string Email, CustomerAccountDetails[] Accounts, Money TotalBalance);
```
As you can see, it exposes some basic user details and a list of all his Accounts.

Here's our handler (a redacted version of it):

```csharp
public class CustomerDetailsHandler : INotificationHandler<CustomerCreated>
{
    public async Task Handle(CustomerCreated @event, CancellationToken cancellationToken)
    {
        _logger.LogInformation("creating customer details for customer {CustomerId} ...", @event.CustomerId);

        var customerView = await BuildCustomerViewAsync(@event.CustomerId, cancellationToken);
        await SaveCustomerViewAsync(customerView, cancellationToken);
    }

    private async Task<CustomerDetails> BuildCustomerViewAsync(Guid customerId, CancellationToken cancellationToken)
    {
        var customer = await _customersRepo.RehydrateAsync(customerId, cancellationToken);

        var totalBalance = Money.Zero(Currency.CanadianDollar);
        var accounts = new CustomerAccountDetails[customer.Accounts.Count];
        int index = 0;
        foreach (var id in customer.Accounts)
        {
            var account = await _accountsRepo.RehydrateAsync(id, cancellationToken);
            accounts[index++] = CustomerAccountDetails.Map(account);

            totalBalance = totalBalance.Add(account.Balance, _currencyConverter);
        }

        var customerView = new CustomerDetails(customer.Id, customer.Firstname, customer.Lastname, customer.Email.Value, accounts, totalBalance);
        return customerView;
    }

    private async Task SaveCustomerViewAsync(CustomerDetails customerView, CancellationToken cancellationToken)
    {
        var filter = Builders<CustomerDetails>.Filter
                        .Eq(a => a.Id, customerView.Id);

        var update = Builders<CustomerDetails>.Update
            .Set(a => a.Id, customerView.Id)
            .Set(a => a.Firstname, customerView.Firstname)
            .Set(a => a.Lastname, customerView.Lastname)
            .Set(a => a.Email, customerView.Email)
            .Set(a => a.Accounts, customerView.Accounts)
            .Set(a => a.TotalBalance, customerView.TotalBalance);

        await _db.CustomersDetails.UpdateOneAsync(filter,
            cancellationToken: cancellationToken,
            update: update,
            options: new UpdateOptions() { IsUpsert = true });

        _logger.LogInformation($"updated customer details for customer {customerView.Id}");
    }
}
```

When we receive the `CustomerCreated` event, we start by rehydrating the `Customer` model from our Events Store. Then we loop over all his accounts, map them to `CustomerAccountDetails` and at the same time compute the total customer balance. 

Now that we have a fully populated instance of `CustomerDetails`, we can proceed with the upsert operation. This example is using MongoDb as backing storage, which exposes a <a href='https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/' target='_blank'>very easy API</a> for this.

Some of you might have noticed that I'm using a `Money` class to represent, well, _money_. I'm doing the same for <a href='https://github.com/mizrael/SuperSafeBank/blob/master/SuperSafeBank.Domain/Email.cs' target='_blank'>Emails</a> as well. This is done to avoid <a href='https://enterprisecraftsmanship.com/posts/functional-c-primitive-obsession/' target='_blank'>Primitive Obsession</a> (thanks, Vladimir).

That's it for today. Event Sourcing is a complex pattern and should be handled with care. The examples provided here are simple, and definitely this code is not battle-tested for production. Still, they should provide enough guidance and food for thought.

Ad maiora!