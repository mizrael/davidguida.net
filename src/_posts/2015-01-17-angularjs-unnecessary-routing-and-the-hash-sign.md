---
id: 606
title: 'AngularJS: unnecessary routing and the hash sign'
date: 2015-01-17T01:45:45-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=606
permalink: /angularjs-unnecessary-routing-and-the-hash-sign/
videourl:
  - ""
dsq_thread_id:
  - "5454605776"
image: /assets/uploads/2014/09/angularjs.png
categories:
  - AngularJS
  - Javascript
  - Programming
  - Ramblings
---
If you are using AngularJS for something different from a Single Page Application, probably you are not using the built-in routing functionality. In this case, don't add the ngRoute dependency to your app , or it will always try to handle your #hashes (and most probably your web app won't work).

Cheers!

<div class="post-details-footer-widgets">
</div>