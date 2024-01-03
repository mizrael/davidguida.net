---
description: >
  How to do pagination to display data received from a WebApi backend using AngularJS
id: 565
title: Data pagination with WebAPI and AngularJS
date: 2014-09-13T21:04:07-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=565
permalink: /data-pagination-with-webapi-and-angularjs/
videourl:
  - ""
dsq_thread_id:
  - "5139530177"
image: /assets/uploads/2014/09/angularjs.png
categories:
  - .NET
  - AngularJS
  - ASP.NET
  - Javascript
  - MVC
  - Programming
  - WebAPI
---
**UPDATE**: wonder how to do the same using React and NodeJS? <a href="http://www.davidguida.net/nodejs-react-pagination/" target="_blank">Read here!</a>

One of the first issues I faced while studying/working with AngularJS was how to do pagination with data received from the backend. Assuming that all the real paging is done server-side, I &#8220;just&#8221; needed a way to easily tell the user on which page he is and how to navigate through the rest of the data.

Before we start, I have uploaded a small demo on Git, here&#8217;s the link: <a title="AngularJS Pagination" href="https://github.com/mizrael/AngularJs-Pagination" target="_blank">https://github.com/mizrael/AngularJs-Pagination</a> and a screenshot:

[<img loading="lazy" class="alignnone size-full wp-image-571" src="/assets/uploads/2014/09/AngularJS-pagination.jpg?resize=788%2C387" alt="AngularJS pagination" width="788" height="387" srcset="/assets/uploads/2014/09/AngularJS-pagination.jpg?w=1000&ssl=1 1000w, /assets/uploads/2014/09/AngularJS-pagination.jpg?resize=300%2C147&ssl=1 300w, /assets/uploads/2014/09/AngularJS-pagination.jpg?resize=788%2C386&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" />](/assets/uploads/2014/09/AngularJS-pagination.jpg)

The idea is to use an AngularJS Directive that has access to the paging info (exposed on the current $scope) and creates all the links using an html template.

I have used ASP.NET MVC and WebAPI to generate the dummy data and the Bootstrap <a title="Bootstrap pagination" href="http://getbootstrap.com/components/#pagination" target="_blank">pagination component</a> to display the links.

<a title="API Controller" href="https://github.com/mizrael/AngularJs-Pagination/blob/master/DemoAngularPagination/ApiControllers/ProductsController.cs" target="_blank">Here&#8217;s </a>the simple API controller, the GET action returns an &#8220;enhanced&#8221; collection class containing the items (yeah) and all the relevant pagination infos (look at the sources <a title="Paged Collection" href="https://github.com/mizrael/AngularJs-Pagination/blob/master/DemoAngularPagination/Models/PagedCollection.cs" target="_blank">here</a>)

On Client-Side all the javascript code is included  <a title="demo.js" href="https://github.com/mizrael/AngularJs-Pagination/blob/master/DemoAngularPagination/Scripts/demo.js" target="_blank">in this file</a>, obviously for a bigger project it would be better to split directive, controllers and so on in separate scripts.

As you may see, there&#8217;s the App declaration at the very beginning, then I have created a basic factory to access the data on the server. Right after there&#8217;s the controller that consumes the resource and stores the current page number and the total pages count.  
At the end of the script there&#8217;s our Directive. The most important part is the range() function, in charge of generating and array of the page indices that will be rendered by the <a title="Pager html template" href="https://github.com/mizrael/AngularJs-Pagination/blob/master/DemoAngularPagination/Scripts/templates/pager-template.html" target="_blank">template</a>.

That&#8217;s all!

UPDATE 29/06/2015:  
I have updated the project a little bit, <a href="/data-pagination-with-webapi-and-angularjs-part-2/" target="_blank">here&#8217;s why.</a>

<div class="post-details-footer-widgets">
</div>