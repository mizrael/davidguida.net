---
description: >
  ever wondered why your BackgroundService is blocking your application? Let's find out how to fix it!
id: 8035
title: 'Handling long-running operations in a .NET Background Service'
date: 2023-09-21T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8035
permalink: /2023-09-21-backgroundservice-long-running-operations
image: /assets/uploads/2023/09/backgroundservice-long-running-operations.jpg
categories:  
  - .NET
  
---

I have seen few articles around about how to execute long-running tasks in a `BackgroundService` and most of them do the same mistake. The code looks more or less like this:
```
public class MyWorker : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while(!cancellationToken.IsCancellationRequested)
        {
            await DoSomethingAsync();
        }
    }
}
```

### This code will run your async operation and stop anything else from happening. 

So, if your goal is to have a background worker running some operation in a loop (for example, polling messages from a queue), the right approach would be to spin up a separate task inside `ExecuteAsync`. Something like this:

```
public class MyWorker : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        await Task.Factory.StartNew(async () =>
        {
            await this.ExecuteAsyncCore(cancellationToken).ConfigureAwait(false);
        }, cancellationToken);
    }

    private async Task ExecuteAsyncCore(CancellationToken cancellationToken)
    {
        while(!cancellationToken.IsCancellationRequested)
        {
            await DoSomethingAsync();
        }
    }
}
```

As usual, I created a <a href='https://github.com/mizrael/BlockingBackgroundService' target='_blank'>small repository on GitHub</a> to help you better understand what's going on here.

In the repo we have a simple Minimal Api with a GET endpoint `/counter`. A <a href='https://github.com/mizrael/BlockingBackgroundService/blob/main/BlockingBackgroundService/MyBackgroundService.cs' target='_blank'>background service</a> is used to increase a counter variable. Calling the endpoint will return its current value. It's a very simple scenario, but basically shows how a background service can perform a long running operation (in a loop) and how we can query its state from an API.

Now, in <a href='https://github.com/mizrael/BlockingBackgroundService/blob/193f7b3f98906ac1b1ded52e75b671438b3364d0/BlockingBackgroundService/appsettings.json#L9' target='_blank'>the appsetting</a> you can configure whether you want the background service to be blocking or not.

You'll see that when the value is true, the `/counter` endpoint cannot be reached.

Cheers!