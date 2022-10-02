---
id: 586
title: Case-insensitive queries on MongoDB
date: 2014-12-03T18:04:09-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=586
permalink: /case-insensitive-queries-on-mongodb/
videourl:
  - ""
dsq_thread_id:
  - "6015178863"
image: /assets/uploads/2014/12/mongodb_logo.png
categories:
  - MongoDB
  - Programming
---
Short version: you can&#8217;t.

Long version: well&#8230;. you can&#8217;t 😀 Or at least you can&#8217;t NOW, based on what is stated here : <a title="case insensitive index" href="https://jira.mongodb.org/browse/SERVER-90" target="_blank">https://jira.mongodb.org/browse/SERVER-90</a> .

If you really need case-insensitive queries one option is to create another field with a lowercase representation of the text, put an index on it and run your queries on this field instead.

<div class="post-details-footer-widgets">
</div>