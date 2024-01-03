---
description: >
  Hi all! In this post we'll dig a little bit into the fabulous realm of SQL and see how we can generate a nice report with dynamic columns.
id: 612
title: 'SQL: generate a report with dynamic columns by month'
date: 2015-02-13T16:08:23-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=612
permalink: /sql-generate-a-report-with-dynamic-columns-by-month/
videourl:
  - ""
dsq_thread_id:
  - "5140442395"
image: /assets/uploads/2014/06/sql-672x218.jpg
categories:
  - Programming
  - SQL
---
<div class="wp-block-group">
  <div class="wp-block-group__inner-container">
    <p>
      Hi all! This time I'll try to dig a little bit into the fabulous realm of SQL and see how we can generate a nice report with dynamic columns.
    </p>
    
    <p>
      The need: I had to generate a report&nbsp;showing some counts divided by month, basically the columns represent&nbsp;the months and the user has the possibility to pick a date range.
    </p>
    
    <p>
      For example, imagine that you want to select the number of orders placed by all the customers by month.
    </p>
    
    <p>
      Using the standard <a href="https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/northwind-pubs" target="_blank" rel="noreferrer noopener">Northwind </a>database as a reference, the first thing to do is to generate a list of months along with the relative start and end days:
    </p>

    <p><script src="https://gist.github.com/mizrael/c44e575008f5ab98994f.js"></script></p>
    
    <p>
      The next step is "quite" easy: all we have to do is to generate a string containing the main query that picks all the customers and has many sub-queries, &nbsp;one for each month, SELECT-ing the count of the orders.
    </p>
    
    <p><script src="https://gist.github.com/mizrael/930250f0c792ff54fdc8.js"></script></p>

    <p>
      As you may see, most of the work is done with lines 5-10 where we use the <a title="COALESCE" href="https://msdn.microsoft.com/it-it/library/ms190349.aspx" target="_blank" rel="noopener noreferrer">COALESCE </a>function to concatenate the sub-queries created using the #dates temp table. Note that each query will contain a WHERE clause that filters the Order by Customer.
    </p>
    
    <p>
      On lines 12-13 we create the final query to be executed, and finally, on line 16 we ask&nbsp;<a title="sp_executesql" href="https://msdn.microsoft.com/it-it/library/ms188001.aspx" target="_blank" rel="noopener noreferrer">sp_executesql &nbsp;</a>to run our code.
    </p>
    
    <p>
      Here's a screenshot of the results:
    </p><figure class="wp-block-image alignwide">
    
    <a href="/assets/uploads/2015/02/orders.jpg"><img loading="lazy" width="788" height="359" src="/assets/uploads/2015/02/orders-1024x467.jpg?resize=788%2C359" alt="dynamic sql query variable column names" class="wp-image-618" srcset="/assets/uploads/2015/02/orders.jpg?resize=1024%2C467&ssl=1 1024w, /assets/uploads/2015/02/orders.jpg?resize=300%2C137&ssl=1 300w, /assets/uploads/2015/02/orders.jpg?resize=788%2C359&ssl=1 788w, /assets/uploads/2015/02/orders.jpg?w=1680&ssl=1 1680w, /assets/uploads/2015/02/orders.jpg?w=1576&ssl=1 1576w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a><figcaption>dynamic SQL query variable column names</figcaption></figure> 
    
    <p>
      Don't forget to DROP the #dates table! 😀
    </p>
  </div>
</div>

<div class="post-details-footer-widgets">
</div>