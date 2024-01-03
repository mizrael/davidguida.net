---
description: >
  Quick article about how to pass custom functions to AngularJS directives using an isolated scope, with or without parameters.
id: 6027
title: How to pass custom functions to AngularJS directives
date: 2015-06-24T17:44:32-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6027
permalink: /pass-custom-functions-to-angularjs-directives/
videourl:
  - ""
dsq_thread_id:
  - "5139698786"
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
image: /assets/uploads/2014/09/angularjs.png
categories:
  - AngularJS
  - Javascript
  - Programming
---
In case you need to pass a callback to your AngularJS directives, looks like one way is to create an <a href="https://docs.angularjs.org/guide/directive#isolating-the-scope-of-a-directive" target="_blank" rel="noopener noreferrer">isolated scope</a> and create a member with the &#8216;&' attr. Here's a quick&dirty example:

In case you have to pass some arguments to the callback, here's how:

Notice that the argument is transformed in a javascript object and passed to the callback. This one is actually a wrapped function around the one you passed.

In case you need it, the Toptal team has put together a nice <a href="https://www.toptal.com/angular-js#hiring-guide" target="_blank" rel="noreferrer noopener">Q/A list</a> with several worth reading best-practices.

<div class="post-details-footer-widgets">
</div>