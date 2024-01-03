---
id: 6413
title: How an AppDomain can help you isolate your method calls
date: 2018-02-19T09:15:11-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6413
permalink: /appdomain-help-isolate-method-calls/
dsq_thread_id:
  - "6488576832"
image: /assets/uploads/2018/02/ostrichpillow_studiobananathings_kawamuraganjavian_studiokg_06.jpg
categories:
  - .NET
  - Programming
---
In one of my latest pet-projects (which with a bit of luck is about to become a real project, knock on wood!)&nbsp;I have been in need of executing code in total isolation form the containing application.&nbsp;

Without giving too many details, the system allows plugins to be uploaded ( as standard .NET assemblies ), stored and eventually executed. However, in order to avoid a rogue plugin to jeopardise the entire application with nasty stuff like infinite loops or random exceptions, I needed a way to isolate their execution.

Being this a new project, I started writing it using .NET Core but had to revert very quickly to the ol' reliable Framework. Seems that as of now Assemblies can be loaded in memory but there's no way to unload them.  
Just for the sake of documentation, the class responsible of loading is&nbsp;<a href="https://github.com/dotnet/coreclr/blob/master/src/mscorlib/src/System/Runtime/Loader/AssemblyLoadContext.cs" target="_blank" rel="noopener">AssemblyLoadContext</a>&nbsp;. Unfortunately loaded assemblies will be kept in memory till the containing process gets closed (more <a href="https://github.com/dotnet/corefx/issues/19773" target="_blank" rel="noopener">details here</a>).

So what's the alternative? <a href="https://msdn.microsoft.com/en-us/library/system.appdomain(v=vs.110).aspx" target="_blank" rel="noopener">AppDomains</a> ! As often happens, the <a href="https://docs.microsoft.com/en-us/dotnet/framework/app-domains/application-domains" target="_blank" rel="noopener">MS documentation</a> does a pretty good job explaining what they are and how should be used so I'll move straight to the point.

I wrote a small example and pushed it to GitHub, you can find it <a href="https://github.com/mizrael/isolator" target="_blank" rel="noopener">here</a>.

The core is the <a href="https://github.com/mizrael/isolator/blob/master/TypeIsolator/Isolator.cs" target="_blank" rel="noopener">Isolator</a> class: as you can see from the code it can be instantiated passing the Type of the class you want to isolate and the name of the method you want to run on it. Something like this:

> _using (var isolatedFoo = new Isolator(typeof(Foo), "Bar"))  
> &nbsp; &nbsp; &nbsp;isolatedFoo.Run();_

Under the hood the Isolator will:

  * create a new AppDomain
  * load the assembly containing typeof(Foo)&nbsp;
  * create an instance of Foo
  * execute the "Bar" method on said instance

Also, being a very polite class, it will unload the AppDomain during the Dispose() .

More under the hood, the real magic happens inside the&nbsp;IsolatorRunner class. As you can see from the code it inherits from <a href="https://msdn.microsoft.com/en-us/library/system.marshalbyrefobject(v=vs.71).aspx" target="_blank" rel="noopener">MarshalByRefObject</a>, this will allow the instance to act as an intermediary between the two AppDomains, with a proxy that will be automatically generated to intercept the calls on the other side.

Being this a quick example, I didn't focus on the quality of the interfaces. So for example being forced to use a string to denote the method to execute is a little&#8230;disappointing.&nbsp;

I'll work a little more in the next days (weeks?) and try to come up with a nicer API, maybe using Expressions and Funcs 🙂

<div class="post-details-footer-widgets">
</div>