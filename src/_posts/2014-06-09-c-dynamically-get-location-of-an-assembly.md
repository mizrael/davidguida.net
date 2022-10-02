---
id: 491
title: 'C# :  dynamically get location of an assembly'
date: 2014-06-09T16:12:55-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=491
permalink: /c-dynamically-get-location-of-an-assembly/
dsq_thread_id:
  - "5627751519"
image: /assets/uploads/2014/06/NET-672x331.png
categories:
  - .NET
  - Programming
---
This time I&#8217;m posting just a simple tip (because my memory is sloppy, yeah):

I was playing a little bit with T4 templates and dynamic assembly generation and I needed to reference a couple of assembly included in my project. Unfortunately the adding a reference to the <a title="ReferencedAssemblies" href="http://msdn.microsoft.com/it-it/library/system.codedom.compiler.compilerparameters.referencedassemblies(v=vs.110).aspx" target="_blank">ReferencedAssemblies </a>collection on a <a title="CompilerParameters" href="http://msdn.microsoft.com/en-us/library/system.codedom.compiler.compilerparameters.aspx" target="_blank">CompilerParameters </a>instance requires the referenced assembly to be in the GAC or in the same output folder of the executing assembly.

A quick workaround I found is to just recover the reference local path using a contained type, something like this:

[csharp]  
private static string GetAssemblyLocationByType<T>()  
{  
return typeof(T).Assembly.Location;  
}  
[/csharp]

Et voilà!

<div class="post-details-footer-widgets">
</div>