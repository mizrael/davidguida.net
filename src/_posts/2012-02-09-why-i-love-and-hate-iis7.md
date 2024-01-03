---
id: 152
title: Why I love and hate IIS7
date: 2012-02-09T15:26:32-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=152
permalink: /why-i-love-and-hate-iis7/
categories:
  - ASP.NET
  - Programming
---
<div>
  <p>
    Yeah, I missed you too guys.
  </p>
  
  <p>
    Anyway, this took me a while to find out. But things like these are exactly what makes my job a continous research for enlightenment.
  </p>
  
  <p>
    In a nutshell, seems that in IIS7 there's a different way to setup httpHandlers. And I'm not referring to the simple change of parent node in the web.config ( from <system.web> <httpHandlers> to <system.webServer> <handlers> ).
  </p>
  
  <p>
    As many of you have probably already noticed, the handler tag now has a new <strong><em>name </em></strong>attribute. Yeah, an <em>unique </em>name.<br /> Probably this should make some bells ring. Anyway, the big news (the REALLY big news) is that with IIS7 httpHandlers do <strong>not </strong>support any more multiple mappings.
  </p>
  
  <p>
    Right. No more.
  </p>
  
  <p>
    You can't do anymore something like this: <span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;"><</span></span><span style="color: #a31515; font-size: small;"><span style="color: #a31515; font-size: small;">add</span></span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">path</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">*.aspx,*.html,*.whatever</span></span><span style="font-size: small;">"</span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">verb</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">*</span></span><span style="font-size: small;">"</span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">type</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">MyHanlder.CustomHttpHanlder</span></span><span style="font-size: small;">"</span><span style="font-size: small;"><span style="font-size: small;">/><br /> </span></span>
  </p>
  
  <p>
    But you're forced to:<br /> <span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;"><</span></span><span style="color: #a31515; font-size: small;"><span style="color: #a31515; font-size: small;">add </span></span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">name</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">MyCustomHanlder1</span></span><span style="font-size: small;">"</span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">path</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">*.aspx</span></span><span style="font-size: small;">"</span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">verb</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">*</span></span><span style="font-size: small;">"</span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">type</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">MyHanlder.CustomHttpHanlder</span></span><span style="font-size: small;">"</span><span style="font-size: small;"><span style="font-size: small;">/><br /> </span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;"><</span></span><span style="color: #a31515; font-size: small;"><span style="color: #a31515; font-size: small;">add</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;"> </span></span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">name</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">MyCustomHanlder2</span></span><span style="font-size: small;">" </span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">path</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">*.html</span></span><span style="font-size: small;">"</span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">verb</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">*</span></span><span style="font-size: small;">"</span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">type</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">MyHanlder.CustomHttpHanlder</span></span><span style="font-size: small;">"</span><span style="font-size: small;"><span style="font-size: small;">/><br /> </span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;"><</span></span><span style="color: #a31515; font-size: small;"><span style="color: #a31515; font-size: small;">add</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;"> </span></span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">name</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">MyCustomHanlder3</span></span><span style="font-size: small;">" </span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">path</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">*.whatever</span></span><span style="font-size: small;">"</span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">verb</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">*</span></span><span style="font-size: small;">"</span><span style="color: #ff0000; font-size: small;"><span style="color: #ff0000; font-size: small;">type</span></span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">=</span></span><span style="font-size: small;">"</span><span style="color: #0000ff; font-size: small;"><span style="color: #0000ff; font-size: small;">MyHanlder.CustomHttpHanlder</span></span><span style="font-size: small;">"</span><span style="font-size: small;"><span style="font-size: small;">/></span></span>
  </p>
  
  <p>
    As I usually say, beauty is in the eye of the beholder.
  </p>
</div>

<div class="post-details-footer-widgets">
</div>