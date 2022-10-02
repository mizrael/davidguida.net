---
description: >
  quick update on my article about how to data pagination with AngularJS and WebAPI, explaining how to add custom callbacks to the pager links
id: 6029
title: 'Data pagination with WebAPI and AngularJS &#8211; part 2'
date: 2015-06-29T17:49:00-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6029
permalink: /data-pagination-with-webapi-and-angularjs-part-2/
videourl:
  - ""
dsq_thread_id:
  - "5184720341"
image: /assets/uploads/2014/09/angularjs.png
categories:
  - .NET
  - AngularJS
  - ASP.NET
  - Javascript
  - Programming
  - WebAPI
---
Hi all! Looks like the article I wrote some time ago about <a href="http://www.davidguida.net/data-pagination-with-webapi-and-angularjs/" target="_blank">data pagination with AngularJS </a>is still getting some attention, so I decided to give it a quick update just to spicy things a little bit.

In one of my project I needed a way to run different actions before running the actual pagination, so after some thought I decided to enter the marvelous world of callbacks.

In order to make things more generic, I took advantage of what I wrote in my <a href="http://www.davidguida.net/angularjs-passing-functions-to-directives/" target="_blank">last post</a> and updated the pager code adding a callback on the page links: this way we can execute a custom function every time the user clicks on one of the links of the pager.

All I had to do was to create the isolated scope and add a pointer to the callback using the &#8216;&&#8217; attribute. In case you need some refreshing, <a href="http://fdietz.github.io/recipes-with-angular-js/directives/passing-configuration-params-using-html-attributes.html" target="_blank">here&#8217;s a nice article</a> about how to pass data to a directive.  
Finally, you can check<a href="https://github.com/mizrael/AngularJs-Pagination/blob/master/DemoAngularPagination/Scripts/demo.js" target="_blank"> the code here</a>, in the _demoPager_ directive.

Here&#8217;s the link to the project on GitHub: <a title="AngularJS Pagination" href="https://github.com/mizrael/AngularJs-Pagination" target="_blank">https://github.com/mizrael/AngularJs-Pagination</a>

Enjoy!

<div class="post-details-footer-widgets">
</div>