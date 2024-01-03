---
id: 599
title: 'SQLCE: How to execute complex scripts'
date: 2015-01-05T16:36:24-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=599
permalink: /sqlce-how-to-execute-complex-scripts/
videourl:
  - ""
dsq_thread_id:
  - "5260209245"
image: /assets/uploads/2015/01/sqlce.jpg
categories:
  - .NET
  - Elasticsearch
  - EntityFramework
  - Programming
  - SQL
---
For one of the side-projects I am working on, I needed a way to execute long SQL scripts to create some reports. I started the project using SQLCE because I didn&#8217;t wanted to bother with a full installation of a SQL server (even the Express one), so I wrote all the code exploiting EntityFramework 6 and the <a title="SQL Server Compact & SQLite Toolbox" href="http://sqlcetoolbox.codeplex.com/" target="_blank">SQL Server Compact & SQLite Toolbox</a>. I didn&#8217;t used SqlLite because at the time EF6 didn&#8217;t had support for it (was added in February 2014, see <a title="System.Data.SQLite News" href="http://system.data.sqlite.org/index.html/doc/trunk/www/news.wiki" target="_blank">here</a>).

However, one of the drawbacks is the lack of support of some SQL commands, for example the syntax &#8220;SELECT &#8230; INTO &#8230; FROM&#8221;. Also, I had complex scripts that used the GO command to separate the blocks. In order to make these work, I wrote a very simple routine that splits the .sqlce file by line, searches for each GO and executes the query till that point. You can find the code <a title="SQLCE-Multi-Command" href="https://github.com/mizrael/SQLCE-Multi-Command/blob/master/example.cs" target="_blank">here on GitHub</a> 🙂

<div class="post-details-footer-widgets">
</div>