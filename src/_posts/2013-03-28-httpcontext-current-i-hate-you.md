---
id: 248
title: HttpContext.Current, I hate you.
date: 2013-03-28T16:19:40-04:00
author: David Guida
layout: post
guid: http://davideguida.netne.net/?p=248
permalink: /httpcontext-current-i-hate-you/
dsq_thread_id:
  - "5743370425"
categories:
  - ASP.NET
  - Programming
---
What if you have some legacy code that you **cannot **refactor and that contains references to HttpContext.Current ?

What if you are writing unit tests for **your **code and it has references to that legacy code?

Option 1: refactor the calls to the legacy code with <a title="Proxy Pattern" href="http://en.wikipedia.org/wiki/Proxy_pattern" target="_blank">the proxy pattern</a> and continue writing the tests  (please, do this) .

Option 2: create a fake HttpContext and set it.<!--more-->

If for some reason you&#8217;re forced to choose Option 2, here&#8217;s an example of how to create a fake HttpContext:

[code lang=&#8221;csharp&#8221; light=&#8221;false&#8221;]  
var httpRequest = new HttpRequest(filename, domainUrl, null);  
var stringWriter = new StringWriter();

var httpResponce = new HttpResponse(stringWriter);  
var httpContext = new HttpContext(httpRequest, httpResponce);

var sessionContainer = new HttpSessionStateContainer("id", new SessionStateItemCollection(),  
new HttpStaticObjectsCollection(), 10, true,  
HttpCookieMode.AutoDetect,  
SessionStateMode.InProc, false);

SessionStateUtility.AddHttpSessionStateToContext(httpContext, sessionContainer);  
[/code]

<div class="post-details-footer-widgets">
</div>