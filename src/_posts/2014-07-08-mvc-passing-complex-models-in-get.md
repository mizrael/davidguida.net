---
id: 498
title: 'MVC: passing complex models in GET'
date: 2014-07-08T12:57:38-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=498
permalink: /mvc-passing-complex-models-in-get/
dsq_thread_id:
  - "6021061396"
image: /assets/uploads/2014/06/NET-672x331.png
categories:
  - .NET
  - ASP.NET
  - MVC
  - Programming
  - WebAPI
---
I started recently to work on a REST WebAPI project and soon realized I needed a way to pass complex parameters to my GET actions.

For example, in some cases I have &#8220;searcher&#8221; classes that expose properties like pagination data, text fields, identificators and so on, something like this:

[csharp]  
public class Identificator{  
public int Id {get;set;}  
public string Name {get;set;}  
}

public class Searcher{  
public int Page {get;set;}  
public int PageSize {get;set;}  
public Identificator Key {get;set;}  
}  
[/csharp]

and I use classes like this to filter my data and perform queries.  
I could have used the <a title="FromUriAttribute" href="http://msdn.microsoft.com/en-us/library/system.web.http.fromuriattribute(v=vs.118).aspx" target="_blank">[FromUri]</a> attribute, but seems that it doesn&#8217;t correctly deserialize inner classes.

Since it&#8217;s perfectly legal to create (on client-side) a JSON string from the &#8220;searcher&#8221; and pass it on the querystring, I spent an hour or so to create a custom attribute that works like [FromUri], but is able to deserialize the JSON data to the correct model type.

I have created a repo on Git, here&#8217;s the link: <a title="MVC-Json-Model-From-Uri" href="https://github.com/mizrael/MVC-Json-Model-From-Uri" target="_blank">https://github.com/mizrael/MVC-Json-Model-From-Uri</a>

PS: this is the first post I write using my new MacbookPro 😀

<div class="post-details-footer-widgets">
</div>