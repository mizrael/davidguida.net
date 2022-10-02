---
id: 6139
title: 'CQRS: on Commands and Validation &#8211; part 2: the base handler'
date: 2016-03-03T16:38:19-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6139
permalink: /cqrs-on-commands-and-validation-part-2-the-base-handler/
dsq_thread_id:
  - "5139530421"
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
image: /assets/uploads/2016/02/software_architecture-e1455751845413.jpg
categories:
  - .NET
  - ASP.NET
  - Git
  - Programming
  - Software Architecture
---
<a href="http://www.davidguida.net/cqrs-on-commands-and-validation/" target="_blank" rel="noopener noreferrer">Last time</a> we discussed how to use the <a href="http://martinfowler.com/bliki/DecoratedCommand.html" target="_blank" rel="noopener noreferrer">Decorator </a>pattern to validate our Commands. The approach works fine but while using it I started feeling something strange. It can be probably considered an elegant solution but there&#8217;s something missing, like a <a href="http://martinfowler.com/bliki/CodeSmell.html" target="_blank" rel="noopener noreferrer">code smell</a>.

What is the problem? Easy: how can you tell if you are really running the validation? What if you just &#8220;forget&#8221; to register the decorator? Nah, you need it.

<blockquote class="wp-block-quote">
  <p>
    Also, a better use for decorators should be all those cross cutting concerns like logging, tracing and so on.
  </p>
</blockquote>

Another very simple solution is to use a base class for the Command Handlers that takes an instance of IValidator as optional dependency and consumes it right before executing the command:

as you can see in this case the validator returns a &#8220;result&#8221; object that exposes&nbsp;a boolean status flag&nbsp;and a list of errors that may have occurred.  
If the validation fails a specific exception is thrown, containing the list of errors.

If instead everything is ok, the protected method RunCommand() is executed, and that&#8217;s the only thing you have to implement in your Command Handlers 🙂

<div class="post-details-footer-widgets">
</div>