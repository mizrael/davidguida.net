---
id: 197
title: Simple Membership Provider. Oh you!
date: 2012-12-04T21:23:35-05:00
author: David Guida
layout: post
guid: http://davideguida.netne.net/?p=197
permalink: /simple-membership-provider-oh-you/
dsq_thread_id:
  - "5561268730"
categories:
  - ASP.NET
  - MVC
  - Programming
---
> {"The Role Manager feature has not been enabled."}

1/2 hour. Took me half an hour to track down this. It all began with the ASP.NET MVC 4 template, with its shiny AccountController. "Why do I have to write all that auth code? Why can't I use WebMatrix ? "

> {"The Role Manager feature has not been enabled."}

Turns out that SOMETIMES when you call

    WebSecurity.InitializeDatabaseConnection

you can get that error. Searching online I found that you SHOULD be able to solve it by adding this to your appSettings section:

or MAYBE, you can try adding these assemblies:

    <system.web> <compilation debug="true" targetFramework="4.5"> <assemblies> <add assembly="WebMatrix.Data, Version=2.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/> <add assembly="WebMatrix.WebData, Version=2.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"/> </assemblies> </compilation> </system.web>

If none of the above works, the last thing you can try is adding these lines to your system.web section:

    <roleManager enabled="true" defaultProvider="SimpleRoleProvider"> <providers> <clear/> <add name="SimpleRoleProvider" type="WebMatrix.WebData.SimpleRoleProvider, WebMatrix.WebData"/> </providers> </roleManager> <membership defaultProvider="SimpleMembershipProvider"> <providers> <clear/> <add name="SimpleMembershipProvider" type="WebMatrix.WebData.SimpleMembershipProvider, WebMatrix.WebData"/> </providers> </membership> 

Last one worked for me. Yikes!

<div class="post-details-footer-widgets">
</div>