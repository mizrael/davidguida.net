---
id: 6465
title: 'Unit, integration, end-to-end tests: do I need all of them?'
date: 2018-05-09T10:32:01-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6465
permalink: /unit-integration-end-to-end-tests-do-i-need-all-of-them/
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
image: /assets/uploads/2018/05/unit-test.jpg
categories:
  - Programming
  - Ramblings
  - Software Architecture
  - Testing
---
Yes. I mean, don&#8217;t even think about it. You&#8217;ll need all of them, probably in different measures, but there is no &#8220;we shipped to production without tests&#8221;.

Tests are the first rampart separating you from madness and failure.  
Why madness? Try to do even a small refactoring after you&#8217;ve deployed your app. Without automatic tests you&#8217;ll have to manually probe the entire system (or systems if you&#8217;re on microservices).

Why failure ? Simple, just think on the long run. Maintenance will quickly become a hell and adding new features will soon bring you to the infamous &#8220;it&#8217;s better if we re-build this from scratch&#8221;.

So! Where should we start? From the <a href="https://martinfowler.com/bliki/TestPyramid.html" target="_blank" rel="noopener noreferrer">pyramid</a>!

<div style="width: 629px" class="wp-caption alignnone">
  <img loading="lazy" title="the test pyramid" src="https://i1.wp.com/martinfowler.com/bliki/images/testPyramid/test-pyramid.png?resize=619%2C341&#038;ssl=1" alt="the test pyramid" width="619" height="341"  data-recalc-dims="1" />
  
  <p class="wp-caption-text">
    The test pyramid. Image taken directly from Martin Fowler&#8217;s article. Thanks, Martin.
  </p>
</div>

Starting from the bottom, you&#8217;ll begin with writing the&nbsp;**unit** tests. &#8220;Unit&#8221; here means that you&#8217;re testing a single small atomic piece of your system, a class, a function, whatever. You won&#8217;t connect to any external resource (eg. database, remote services) and you&#8217;ll be mocking all the dependencies.&nbsp;  
So, ideally you&#8217;ll be checking that under specific circumstances a method is throwing an exception or the cTor is populating the class properties or the result of a computation is a specific value giving a controlled input.  
Also, unit tests have to be extremely fast, in the order of milliseconds, giving you a very quick and generic feedback of your system.

Next is the &#8220;Service&#8221; layer or, more commonly, &#8220;Integration&#8221;. This is where things start to get interesting. Integration tests check that two or more <a href="https://www.youtube.com/watch?v=vs0GvGnKJ9U" target="_blank" rel="noopener noreferrer">pieces fit</a>&nbsp;correctly and the cogs are oiled and greased.&nbsp; So stuff like your Persistence layer, access to the database, ability to create or update data and so on. They might take more time than&nbsp; unit tests and probably will be in a lesser number, but their value is extremely high.

Then we have the &#8220;UI&#8221; or &#8220;end-to-end&#8221; tests. Here we&#8217;re making sure that the&nbsp;**whole** system is working, inspecting from the outside, with little to none knowledge of the inner mechanism. You&#8217;ll be checking that your API routes are returning the right HTTP statuses, setting the proper headers and eating the right content types.

In the end it&#8217;s all a matter of perception. The point of view is moving from the inside of the system, the developer perspective, to the outside: the consumer perspective.

There are of course other typologies of tests, acceptance, smoke, functional and so on. But if you begin adding the coverage using this pyramid you&#8217;ll save&nbsp;**an awful lot** of headaches and keep your system maintainable and expandable.

<div class="post-details-footer-widgets">
</div>