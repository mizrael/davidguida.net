---
id: 634
title: Pagination with MongoDB
date: 2015-04-02T11:59:07-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=634
permalink: /pagination-with-mongodb/
videourl:
  - ""
dsq_thread_id:
  - "5140027184"
image: /assets/uploads/2014/12/mongodb_logo.png
categories:
  - .NET
  - MongoDB
  - Programming
---
In the last few months I have spent some time looking at the traffic stats for this blog and looks like <a title="Data pagination with WebAPI and AngularJS" href="http://www.davidguida.net/data-pagination-with-webapi-and-angularjs/" target="_blank">this post</a> is attracting a lot of visits, so this time I decided to write a couple of words about how to page query results from a MongoDB collection.

Let&#8217;s start from the very beginning, then! Here&#8217;s the code for connecting to the db:

at this point all you have to do is create a valid query (or just use {} to pick all the documents ), compute the number of items to skip and you&#8217;re almost done. Take a look at this gist:

As you may notice, paging is very similar to the normal Linq approach, using two methods, one for &#8220;skipping&#8221; the previous items ( <a title="Skip" href="http://docs.mongodb.org/manual/reference/method/cursor.skip/" target="_blank">details here</a> ) and another for limiting the number of results to a fixed amount ( <a title="Limit" href="http://docs.mongodb.org/manual/reference/method/cursor.limit/" target="_blank">details here</a> ).

A note on performance: skipping the items may become a very CPU intensive operation because the server has to scroll over all the items till the desired position. With large collections it is very important to plan your queries carefully and create your indexes accordingly.

As a bonus, the code shows also how to sort the items with an instance of <a title="IMongoSortBy" href="http://docs.mongodb.org/manual/reference/method/cursor.sort/" target="_blank">IMongoSortBy</a> and how to pick only a subset of the fields with <a title="IMongoFields" href="http://docs.mongodb.org/manual/tutorial/project-fields-from-query-results/" target="_blank">IMongoFields</a>, I guess I&#8217;ll post more on this in the next days.

<div class="post-details-footer-widgets">
</div>