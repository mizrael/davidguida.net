---
description: >
  Do you know who your users are? Do you know what they can do? And do your microservices know this as well? No? Let's find out how!
id: 6628
title: 'Handling Authentication and Authorization in Microservices - Part 1'
date: 2019-04-04T12:15:27-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6628
permalink: /handling-authentication-and-authorization-in-microservices-part-1/
image: /assets/uploads/2019/04/door_lock.jpg
categories:
  - Design Patterns
  - Microservices
  - Programming
  - Software Architecture
tags:
  - microservices
  - software architecture
---
In the last few weeks I&#8217;ve started working mainly on a quite important part of the system: adding authentication and authorization to some of the microservices that compose the whole application.

For those who don&#8217;t know, I work for a <a rel="noreferrer noopener" aria-label="quite well know Company  (opens in a new tab)" href="https://www.dell.com" target="_blank">quite well know Company </a>on the internal sales tools. In a nutshell we could say that is an enormous e-commerce, but of course there&#8217;s more on the plate than that.

But let&#8217;s go back to the topic. As I was saying, I&#8217;ve been tasked to add authentication and authorization to a bunch of microservices. Of course we were already checking the user identity before. And yes, we care a lot about who can do what. But we are constantly pushing to do more and more and add functionalities on top of the others, so one nice day we got from the architects a whole lot of new requirements to implement.

And so the fun had begun.

#### In this post I won&#8217;t go of course into the details of the actual implementation, however I&#8217;ll share with you one of the strategies that can be applied to solve this kind of task.

First of all, for those of you who still don&#8217;t know, **authentication** is the process of identifying who the user actually is. Hopefully, if the credentials are correct, this will generate some kind of user object containing few useful details (eg: name, email and so on).<figure class="wp-block-image">

<a href="https://www.geekyhobbies.com/" target="_blank" rel="noreferrer noopener"><img src="https://i2.wp.com/www.geekyhobbies.com/assets/uploads/2016/02/Guess-Who-5.jpg?w=788&#038;ssl=1" alt="Box for Guess Who, courtesy of geekyhobbies.com" data-recalc-dims="1" /></a></figure> 

**Authorization** instead means figuring out **what the user can do** on the system. Can he read data? Can he create contents? I guess you got the point.

#### In the microservice world authorization can be handled more granularly if the <a rel="noreferrer noopener" aria-label="bounded context (opens in a new tab)" href="https://www.martinfowler.com/bliki/BoundedContext.html" target="_blank"></a>[bounded context](https://www.martinfowler.com/bliki/BoundedContext.html)[s](https://www.martinfowler.com/bliki/BoundedContext.html) are defined properly.

Now that the basics are covered, let&#8217;s try to move on to the juicy part! Normally, when talking about microservices, one of the most common architectural design patterns is the** __**<a rel="noreferrer noopener" aria-label="API Gateway (opens in a new tab)" href="https://docs.microsoft.com/en-us/azure/architecture/microservices/design/gateway" target="_blank"><strong><em>API Gateway</em></strong></a>** __**:<figure class="wp-block-image">

<img loading="lazy" width="788" height="309" src="/assets/uploads/2019/04/image.png?resize=788%2C309&#038;ssl=1" alt="API Gateway" class="wp-image-6633" srcset="/assets/uploads/2019/04/image.png?w=1003&ssl=1 1003w, /assets/uploads/2019/04/image.png?resize=300%2C118&ssl=1 300w, /assets/uploads/2019/04/image.png?resize=768%2C301&ssl=1 768w, /assets/uploads/2019/04/image.png?resize=788%2C309&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /> </figure> 

The idea here is to have a layer in the middle between the client and the actual microservices. This Gateway can build and prepare the DTOs based on the client type (eg: a mobile might see less data than a desktop), do logging, caching, and handle authentication as well. There are of course many more things it could do but that&#8217;s a topic for another post.

So how this gateway can help us? We need to introduce another block: the **_Identity Provider_**.<figure class="wp-block-image">

<img loading="lazy" width="788" height="391" src="/assets/uploads/2019/04/image-1.png?resize=788%2C391&#038;ssl=1" alt="API Gateway and Identity Provider" class="wp-image-6634" srcset="/assets/uploads/2019/04/image-1.png?w=995&ssl=1 995w, /assets/uploads/2019/04/image-1.png?resize=300%2C149&ssl=1 300w, /assets/uploads/2019/04/image-1.png?resize=768%2C381&ssl=1 768w, /assets/uploads/2019/04/image-1.png?resize=788%2C391&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /> </figure> 

Here&#8217;s the flow: the Gateway will call the Identity Provider, possibly redirecting the user to a &#8220;safe zone&#8221; where he/she can enter the credentials and get redirected back to our application, this time with a nice token containing the user details.

There are several types of token we can use, cool kids these days are using <a rel="noreferrer noopener" aria-label="JWT (opens in a new tab)" href="https://jwt.io/introduction/" target="_blank">JWT</a>. Quoting the docs:

<blockquote class="wp-block-quote">
  <p>
    JSON Web Token (JWT) is an open standard (<a href="https://tools.ietf.org/html/rfc7519">RFC 7519</a>) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.&nbsp;
  </p>
</blockquote>

Pretty neat, isn&#8217;t it?

Now we got our user authenticated in the Gateway, but we still need to handle authorization at the microservice level. We&#8217;ll see how in <a href="https://www.davidguida.net/handling-authentication-and-authorization-in-microservices-part-2/" target="_blank" rel="noreferrer noopener" aria-label="the next post (opens in a new tab)">the next post</a> of this series!

<div class="post-details-footer-widgets">
</div>