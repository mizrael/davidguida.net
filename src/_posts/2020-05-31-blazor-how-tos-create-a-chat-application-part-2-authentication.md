---
description: >
  Welcome to the new episode of the Blazor Chat series. This time we'll see how we can add simple authentication and how we can see who is online.
id: 7276
title: 'Blazor how-to&#8217;s: create a chat application &#8211; part 2: authentication'
date: 2020-05-31T22:07:50-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7276
permalink: /blazor-how-tos-create-a-chat-application-part-2-authentication/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/05/blazorchat.jpg
categories:
  - .NET
  - Blazor
tags:
  - authentication
  - Blazor
  - message queues
---
Hi All! Welcome to the new episode of the Blazor Chat series. This time we&#8217;ll see how we can easily implement simple authentication and how we can see who is online.

<a rel="noreferrer noopener" target="_blank" href="https://www.davidguida.net/blazor-how-tos-create-a-chat-application-part-1-introduction/">Last time</a> we saw how we can use a queue to dispatch the messages to all the users in our chat room. We leveraged the **<a rel="noreferrer noopener" target="_blank" href="https://www.davidguida.net/how-to-implement-producer-consumer-with-system-threading-channels/">System.Threading.Channels</a>** library to act as an in-memory queue and wrote a very quick implementation of our message dispatcher.

In our small sample, we won&#8217;t be dwelling much into the realm of authentication. 

#### Identifying a user is far beyond the scope of this series, so I decided to simplify the flow and allow users to enter the chatroom by typing just their username.

<pre class="EnlighterJSRAW" data-enlighter-language="html" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;EditForm Model=@_login OnValidSubmit="HandleValidSubmit" class="form-signin">
    
      &lt;h1 class="h3 mb-3 font-weight-normal">Please sign in&lt;/h1>

      &lt;label for="inputEmail" class="sr-only">Username&lt;/label>
      &lt;InputText id="inputEmail" class="form-control mb-4" @bind-Value=_login.Username placeholder="Username" required autofocus />
      
        &lt;button class="btn btn-lg btn-primary btn-block" type="submit">Sign in&lt;/button>
      
    &lt;/EditForm></pre>

Which translates into something like this:

<div class="wp-block-image">
  <figure class="aligncenter size-large is-resized"><img loading="lazy" src="/assets/uploads/2020/05/image.png?resize=497%2C263&#038;ssl=1" alt="" class="wp-image-7282" width="497" height="263" srcset="/assets/uploads/2020/05/image.png?w=497&ssl=1 497w, /assets/uploads/2020/05/image.png?resize=300%2C159&ssl=1 300w" sizes="(max-width: 497px) 100vw, 497px" data-recalc-dims="1" /><figcaption>our super-secure login screen</figcaption></figure>
</div>

The model class used is just exposing a single property, decorated with some validation attributes:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class Login
{
        [Required, MinLength(1)]
        public string Username{get;set;}
}</pre>

When the user submits the form, the system will store the state in a class and send it to a repository:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public User Login(string username, ConnectedClient client)
{
    var user = new User(username);
    user.Connect(client);
    _usersProvider.AddOrUpdate(user);

    this.UserLoggedIn?.Invoke(this, new UserLoginEventArgs(user));

    return user;
 }</pre>

Actually, there&#8217;s a bit more going on here. As you might have noticed, we&#8217;re storing the username, and link it to an instance of <a rel="noreferrer noopener" href="https://github.com/mizrael/BlazorChat/blob/master/BlazorChat/Models/ConnectedClient.cs" target="_blank">ConnectedClient</a>. We&#8217;re also dispatching an event, but we&#8217;ll talk more about it later.

Where is this ConnectedClient coming from? Well, from a **CircuitHandler**! From the <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/aspnet/core/blazor/state-management?view=aspnetcore-3.1" target="_blank">official docs</a>:

<blockquote class="wp-block-quote">
  <p>
    Blazor Server is a stateful app framework. Most of the time, the app maintains an ongoing connection to the server. The user&#8217;s state is held in the server&#8217;s memory in a&nbsp;<em>circuit</em>.
  </p>
</blockquote>

With <a href="https://github.com/mizrael/BlazorChat/blob/master/BlazorChat/ClientCircuitHandler.cs" target="_blank" rel="noreferrer noopener">a custom <strong>CircuitHandler</strong></a>, we can keep track of the open connections to the server and be informed in case the communication drops (eg. the user closes the browser tab or there&#8217;s a network issue).

In our case, we don&#8217;t actually need it to authenticate our user. The idea, however, is to link the logged user with the circuit id. This way we can react in case of disconnections and keep track of **who is online**. Nice isn&#8217;t it?

This is basically why our core <a rel="noreferrer noopener" href="https://github.com/mizrael/BlazorChat/blob/master/BlazorChat/Services/ChatService.cs" target="_blank">ChatService</a> class exposes two events, _UserLoggedIn_ and _UserLoggedOut_. We subscribe to them on the UI and <a rel="noreferrer noopener" href="https://www.davidguida.net/blazor-how-tos-status-from-a-background-task/" target="_blank">force a refresh</a> every time they get triggered.

That&#8217;s all folks! Thank you for reading 🙂

<div class="post-details-footer-widgets">
</div>