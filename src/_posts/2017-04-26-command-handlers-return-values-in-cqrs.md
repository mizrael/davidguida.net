---
description: >
  Which approach should you take when writing Command Handlers in CQRS? Should you return a value or maybe throw an exception?
id: 6276
title: Command Handlers return values in CQRS
date: 2017-04-26T22:41:17-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6276
permalink: /command-handlers-return-values-in-cqrs/
dsq_thread_id:
  - "5762554996"
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
  - Programming
  - Software Architecture
  - WebAPI
---
I have recently come across this <a href="https://jimmybogard.com/domain-command-patterns-validation/" target="_blank" rel="noopener noreferrer">very interesting blog post</a> by Jimmy Bogard ( the guy behind <a href="https://github.com/jbogard/MediatR" target="_blank" rel="noopener noreferrer">Mediatr</a>, just FYI). He's talking about CQRS, and makes a good point about how the user should be informed of the result of a Command execution.

Should the Command Handler return a value?  
Should the Command Handler throw an exception?

#### These are just some of the strategies we may take. Another option could be to just log the operation and forget that anything happened. Whatever.

<a href="/cqrs-on-commands-and-validation/" target="_blank" rel="noreferrer noopener">A while ago</a> I blogged about how to validate the Commands and ensure the data passed to the Command Handler is valid. This is the strategy I've been adopting in my projects lately. Why? Well, several reasons: first of all I want to keep Command execution separated from the validation. 

Moreover, Commands should be some sort of "fire and forget" operations. Let me clarify this a little bit.  
In my opinion Command execution should be a boolean operation: the system can either execute it or not. Stop. I should be able to know ahead if a Command can be executed and that's the validation phase. If I finally manage to get to the Handler, I know that the data I have is valid and I can run Command. No need to return a "true".

#### So what should I do to make all the pieces fit?

  1. Use a strategy to ensure each Command is validated before execution. For example:
      1. <a href="https://www.davidguida.net/using-decorators-to-handle-cross-cutting-concerns/" target="_blank" rel="noreferrer noopener">Decorator pattern</a>
      2. External <a href="https://www.davidguida.net/cqrs-on-commands-and-validation-part-2-the-base-handler/" target="_blank" rel="noreferrer noopener">validation class</a> injected into the Command Handler
  2. The Validator should analyze the Command and check its validity against business rules or anything else you want
  3. the Validator gives back a Validation result containing a (hopefully empty) list of errors
  4. in case something went wrong, throw a specialized Exception, for example, something <a href="https://github.com/mizrael/LibCore/blob/master/LibCore.CQRS/Validation/ValidationException.cs" target="_blank" rel="noopener noreferrer">like this</a>.

Since most of the projects I am working on lately is composed of some sort of Web API based on .NET Core, I also decided to create <a href="https://github.com/mizrael/LibCore/blob/master/LibCore.Web/Filters/ExceptionFilter.cs" target="_blank" rel="noopener noreferrer">an Exception Filter</a>. It will eventually return to the user a JSON object with the details of the validation:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class ExceptionFilter : IExceptionFilter
{
	public void OnException(ExceptionContext context)
	{
		int status = ExtractHttpStatus(context);
		var errorInfo = _apiErrorFactory.Create((dynamic)context.Exception);

		context.Result = new ObjectResult(errorInfo)
		{
			StatusCode = status,
			DeclaredType = errorInfo.GetType()
		};
	}
}</pre>

**Bonus  
** You may have noticed that some of the links in this post point to <a href="https://github.com/mizrael/LibCore" target="_blank" rel="noopener noreferrer">this Github repository</a>, LibCore. It's a small set of utilities I am writing, maintaining and using in my projects. I thought it would be useful to share the sources, maybe just to hear comments from the community. Food for thought.

<div class="post-details-footer-widgets">
</div>