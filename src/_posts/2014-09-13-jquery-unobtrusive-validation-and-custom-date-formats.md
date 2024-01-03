---
id: 560
title: jQuery unobtrusive validation and custom date formats
date: 2014-09-13T00:03:20-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=560
permalink: /jquery-unobtrusive-validation-and-custom-date-formats/
videourl:
  - ""
dsq_thread_id:
  - "5139530354"
image: /assets/uploads/2014/08/computerprogramming_8406403-655x280.jpg
categories:
  - .NET
  - ASP.NET
  - Javascript
  - MVC
  - Programming
---
Another quick reminder for my sloppy memory:  
in case you want to use a custom date format and you need validation (of course, why wouldn't you?), sometimes may happen that the format you're using is not recognised during the client validation phase.

In one of my side projects for example I am using the standard jquery unobtrusive validation along with <a title="jquery/globalize" href="https://github.com/jquery/globalize" target="_blank">globalize.js</a>. Obviously I have a specific bundle configured for this:

[csharp]  
var scriptBundle = new ScriptBundle("~/bundles/validation").Include(  
"~/Scripts/jquery.validate.js",  
"~/Scripts/jquery.validate.unobtrusive.js",

"~/Scripts/globalize/globalize.js",  
"~/Scripts/globalize/globalize.it-IT.js",  
"~/Scripts/jquery.validate.globalize.js"  
);  
[/csharp]

In case you have not noticed, I have imported the Italian globalization script. Again, in case you don't know, in Italy the date format is usually "day/month/year", or specifically dd/MM/yyyy .

In order to make client validation work, all you have to do is include somewhere in your project this script:

[csharp]  
<script type="text/javascript">  
$.validator.methods.date = function (value, element) {  
return this.optional(element) || Globalize.parseDate(value, "dd/MM/yyyy", "it-IT");  
}  
</script>  
[/csharp]

that's it!

Next time: server-side pagination and AngularJs!

<div class="post-details-footer-widgets">
</div>