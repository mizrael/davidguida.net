---
description: >
  Ever wondered how would it be possible to launch a background task and display its status in your Blazor app?In this post you'll learn two ways to do it!
id: 7215
title: 'Blazor how-tos: status from a background task'
date: 2020-05-20T00:01:36-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7215
permalink: /blazor-how-tos-status-from-a-background-task/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/05/blazor.png
categories:
  - .NET
  - ASP.NET
  - Blazor
  - Programming
tags:
  - .NET Core
  - Blazor
---
Ever wondered how would it be possible to launch a background task and display its status in your **Blazor** app? Well, in this post you'll learn not one, but two ways to do it!

In <a rel="noreferrer noopener" href="https://www.davidguida.net/conways-game-of-life-with-blazor/" target="_blank">the last post</a>, we saw how easy it is to implement Conway's Game of Life using **Blazor**. The code was <a rel="noreferrer noopener" href="https://github.com/mizrael/ConwayBlazor/blob/master/ConwayBlazor/Startup.cs#L32" target="_blank">registering a Scoped instance</a> of the World class which in turn was **broadcasting an event** every time the simulation was updated.

For those interested, I used the Scoped lifetime instead of Singleton in order to ensure that every UI client is receiving its own instance. Otherwise, everyone connecting to the app would see **the same simulation**.

So the first technique is indeed broadcasting the necessary events. The key here is the call to _StateHasChanged()_. From the docs:

<blockquote class="wp-block-quote">
  <p>
    <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.components.componentbase.statehaschanged" target="_blank">StateHasChanged</a> notifies the component that its state has changed. When applicable, calling <code>StateHasChanged</code> causes the component to be rerendered.
  </p>
</blockquote>

Basically, when your UI component is relying on data that gets updated **outside**, maybe from another thread, the system won't be able to detect the changes. In that case your only option is to force the re-rendering in order to get the new state on screen.

The call to _StateHasChanged()_ will switch to the correct context and push a request to the Blazor's rendering queue.

In the UI component, all you have to do is register to the event and call __StateHasChanged__(). Something like this:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">@code{
    protected override void OnInitialized()
    {
        State.OnChangeAsync += Refresh;
    }

    private async Task Refresh()
    {
        await InvokeAsync(StateHasChanged);
    }

    public void Dispose()
    {
        State.OnChangeAsync -= Refresh;
    }
}</pre>

#### It's very important to **unsubscribe** from the event in the Dispose() method to avoid memory leaks.

This covers the first technique. The other one instead is a paradigm shift: instead of having the server notifying the client when the data is available, we have the **client** polling the data at regular intervals. Something like this:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">@code{
    private System.Timers.Timer _timer;

    [Parameter]
    public double Interval { get; set; }

    protected override void OnInitialized()
    {
        _timer = new System.Timers.Timer(this.Interval);
        _timer.Elapsed += async (s, e) =>
        {
            await InvokeAsync(StateHasChanged);
        };
        _timer.Enabled = true;
    }
}</pre>

The core doesn't change, we still need to use _InvokeAsync_ + _StateHasChanged_. But this time all we have to do is just initialize a timer and get the new state in its callback.

As usual, all the code is <a rel="noreferrer noopener" href="https://github.com/mizrael/BlazorBackgroundTask" target="_blank">available on GitHub</a>, feel free to take a look and send me your comments!

In this sample, I'm registering a <a rel="noreferrer noopener" href="https://www.davidguida.net/consuming-message-queues-using-net-core-background-workers-part-1-message-queues/" target="_blank">Background Service</a> that will increment a counter every 500 milliseconds. The Counter has a Value property and exposes also an async Event we can leverage to get notified of status changes.

<div class="post-details-footer-widgets">
</div>