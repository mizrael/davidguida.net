---
description: >
  An example of how to paginate your data using NodeJS on the server and React on client-side, both applications have been written using Typescript.
id: 6198
title: Data pagination with NodeJS and React
date: 2016-09-13T19:14:36-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6198
permalink: /nodejs-react-pagination/
dsq_thread_id:
  - "5141541549"
image: /assets/uploads/2016/09/react-node.png
categories:
  - .NET
  - AngularJS
  - Javascript
  - NodeJS
  - Programming
  - React
  - Typescript
  - WebAPI
---
TL;DR:

<a href="https://github.com/mizrael/react-nodejs-pagination" target="_blank">here&#8217;s the link</a> to the GitHub repo.

Some time ago, in <a href="http://www.davidguida.net/data-pagination-with-webapi-and-angularjs/" target="_blank">one of my articles</a> I showed a way to paginate your data using WebAPI on the server and AngularJS on client-side. Funnily enough I wrote that post exactly two years ago, I just noticed it while writing this. Well, turns out a lot of people is still searching for it, so now, after two years, I have decided to write another couple of notes but with a different tech stack.

Yes, of course, I could have used the same backend from the old article, but where&#8217;s the fun in that?

Enter NodeJS and React!

So, let&#8217;s start with the server first. As you can see <a href="https://github.com/mizrael/react-nodejs-pagination/tree/master/server" target="_blank">from the sources</a>, I used Typescript this time. To be honest, I don&#8217;t feel &#8220;safe&#8221; while writing Javascript code, even with lots of unit tests. Having some form of &#8220;strongly-typed&#8221; language is a little bit of relief, at least for the .NET coder in me.

The architecture is very simple: we have an <a href="https://github.com/mizrael/react-nodejs-pagination/blob/master/server/src/server.ts" target="_blank">express application</a> with just one Route ( <a href="https://github.com/mizrael/react-nodejs-pagination/blob/master/server/src/routes/productsRouter.ts" target="_blank">/api/products/</a> ) exposing a GET action which reads from a <a href="https://github.com/mizrael/react-nodejs-pagination/blob/master/server/src/repositories/productsRepository.ts" target="_blank">Repository</a> the paged list of available products. Due to the nature of the example, I decided to keep things simple and not add any kind of IoC container, just to avoid to overcomplicate the code.

I have also added two middlewares, <a href="https://github.com/mizrael/react-nodejs-pagination/blob/master/server/src/middlewares/requestLogger.ts" target="_blank">one</a> to console.log() all the incoming requests and <a href="https://github.com/mizrael/react-nodejs-pagination/blob/master/server/src/middlewares/cors.ts" target="_blank">the other </a>to allow <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS" target="_blank">CORS</a> for a specific domain ( eg. our client application ). In case you need to refresh your memory, <a href="http://expressjs.com/en/guide/writing-middleware.html" target="_blank">here&#8217;s a nice article</a> about NodeJS middlewares.

The core concept that you can see from the Products API is to return an object that exposes the list of Products along with some infos like the total number of pages, the total Products count and the current page number.

Let&#8217;s talk about the client now.

I was definitely not disappointed discovering that the learning curve for React is actually very, very low. Coming from the Angular world, I was expecting more difficulties, but in a matter of hours I have been able to setup my dev env with Typescript ( <a href="http://www.davidguida.net/how-to-setup-your-environment-to-write-typescript-client-applications/" target="_blank">wanna know how? </a> ) and start coding my components.

Oh yes, don&#8217;t miss <a href="http://www.davidguida.net/react-typescript-webinar-rescheduled/" target="_blank">my webinar </a>this Saturday! I&#8217;ll do a quick introduction about Typescript and React.

Ideally, I could have served the client part directly from the NodeJS application, but I preferred to keep everything separated. Yeah, I had to activate CORS, but it&#8217;s not really a big deal. Also, it makes everything more &#8220;<a href="http://martinfowler.com/microservices/" target="_blank">microservices-oriented</a>&#8220;, which is becoming more and more an hype these days. In my mind, for that kind of architecture you should have two servers talking, but bear with me.

In our small demo, the client is using <a href="https://github.com/mizrael/react-nodejs-pagination/blob/master/client/src/services/ProductService.ts" target="_blank">a service</a> to read the products, displays them <a href="https://github.com/mizrael/react-nodejs-pagination/blob/master/client/src/components/ProductsTable.tsx" target="_blank">in a table</a> and renders <a href="https://github.com/mizrael/react-nodejs-pagination/blob/master/client/src/components/Pager.tsx" target="_blank">a pager</a> at the bottom. As you can easily notice, I am using the <a href="https://github.com/github/fetch" target="_blank">fetch() polyfill</a> to perform the AJAX request.

Also, to make things more interesting, in this case I am using an IoC container, <a href="https://github.com/inversify" target="_blank">Inversify</a>, to handle dependencies. However, since Components are instantiated directly by the React engine we cannot use constructor injection but have to revert to property injection&#8230;.which in this case is handled by the @lazyInject decorator. I&#8217;ll write another post about the subject in the upcoming future.

For now, if you enjoy the example, don&#8217;t forget to write a comment!

<div class="post-details-footer-widgets">
</div>