---
id: 6640
title: 'Handling Authentication and Authorization in Microservices - Part 2'
date: 2019-04-11T10:22:00-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6640
permalink: /handling-authentication-and-authorization-in-microservices-part-2/
dsq_thread_id:
  - "7350340608"
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
image: /assets/uploads/2019/04/authorization.jpg
categories:
  - Design Patterns
  - Microservices
  - Programming
  - Software Architecture
tags:
  - design patterns
  - microservices
  - software architecture
---
In the <a href="https://www.davidguida.net/handling-authentication-and-authorization-in-microservices-part-1/" target="_blank" rel="noreferrer noopener" aria-label="previous post (opens in a new tab)">previous post</a> we saw a way for handling authentication using an API Gateway and an Identity Provider. Just to refresh the concept, here&#8217;s the basic diagram:<figure class="wp-block-image">

<img loading="lazy" width="788" height="391" src="/assets/uploads/2019/04/image-1.png?resize=788%2C391&#038;ssl=1" alt="" class="wp-image-6634" srcset="/assets/uploads/2019/04/image-1.png?w=995&ssl=1 995w, /assets/uploads/2019/04/image-1.png?resize=300%2C149&ssl=1 300w, /assets/uploads/2019/04/image-1.png?resize=768%2C381&ssl=1 768w, /assets/uploads/2019/04/image-1.png?resize=788%2C391&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /> </figure> 

The Client will call the API Gateway, which will ask the Identity Provider to (ehm) provide the user details. The Client will get redirected to an external area where the user can login. At this point the Provider will generate a token and pass it back to the Client, which will then **attach it to every call** to the API Gateway.

So now that we have our user, we need a way to check his permissions in every microservice.

An option could be using <a href="https://docs.microsoft.com/en-us/aspnet/core/security/authorization/claims?view=aspnetcore-2.2&WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Claims-based authorization </a>, which basically means storing every permission that the user has on the entire system as claims on the token.

When a microservice receives a request, it will decode the token, verify it and then check if the user has the required permission claim for the requested action.

It&#8217;s a very easy mechanism to implement and works pretty well but also means that we&#8217;re sending back and forth a &#8220;fat&#8221; token, **bloated with a lot of useless information** for most of the calls. The permission claims are an interesting information only for the microservice that cover that specific bounded context. All the other will still receive the data but it **won&#8217;t add any value**.

Another option is to add an Authorization microservice, something like this:<figure class="wp-block-image">

<img loading="lazy" width="740" height="333" src="/assets/uploads/2019/04/image-3.png?resize=740%2C333&#038;ssl=1" alt="Authorization Service" class="wp-image-6644" srcset="/assets/uploads/2019/04/image-3.png?w=740&ssl=1 740w, /assets/uploads/2019/04/image-3.png?resize=300%2C135&ssl=1 300w" sizes="(max-width: 740px) 100vw, 740px" data-recalc-dims="1" /> <figcaption>Authorization Service</figcaption></figure> 

#### This new microservice will basically own all the permissions for every user in the system.

When a microservice receives a request, it will decode the token and verify it. So far so good. Then, if the action requires authorization, it will make a call to the Authorization service, asking if the user has a specific permission.

This way we have decoupled the decision from the microservices, moving it to a specific service that **does a single job**: handling user permissions (and probably stuff like profiles/roles too ).