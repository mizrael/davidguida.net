---
id: 417
title: 'SDL Tridion: how to reference a parameter schema'
date: 2014-04-03T14:53:32-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=417
permalink: /sdl-tridion-how-to-reference-a-parameter-schema/
dsq_thread_id:
  - "5139530310"
categories:
  - Programming
  - SDL Tridion
---
This is going to be my first post on SDL Tridion and I&#8217;m going to explain different ways to reference a parameter schema from a ITemplate implementation using the TcmTemplateParameterSchema class attribute.

So, assuming you are creating a nice .NET assembly with your Template Building Blocks and you want to reference a schema, here&#8217;s how you could do:

_**<span style="line-height: 1.5;">Way #1: direct reference using the ID</span>**_

1) In the CMS create a Parameters Schema and take the id ( something like &#8220;**tcm:73-7323-8**&#8221; )

2) add the class attribute to your ITemplate implementation, **BUT** change the id of the folder to 0:

[csharp]  
[TcmTemplateParameterSchema("tcm:0-7323-8")]  
public class PageRevisionDate : ITemplate {  
&#8230;&#8230;  
}  
[/csharp]

this is why the uploader is trying somehow to reference the schema in the same destination folder of the assembly first. If you don&#8217;t replace the 0, the upload will fail 🙂

**_Way #2:  embed the schema as a resource  
_** 

I found this method on Rob Stevenson-Leggett&#8217;s blog, so I just <a title="SDL Tridion Quick Tip: Embedding Parameters Schemas in DLLs" href="http://www.building-blocks.com/thinking/quick-tip-embedding-parameters-schemas-in-dlls/" target="_blank">link it.</a> There&#8217;s also <a title="How to add schema as embedded resource" href="https://gist.github.com/rsleggett/3927445" target="_blank">a repo</a> on GitHub so go and take a look 😀

One thing I don&#8217;t like of **Way #1** is that you&#8217;re hardcoding the id of the schema. Hardcoding&#8217;s a big no-no in big project so we need to find another way. **Way #2** instead forces you to create the schema in the CMS, copy/paste the xsd in Visual Studio and update it each time you make some changes to the schema. I&#8217;m a lazy guy so I really want a better way. And here we get **Way #3**!

**_Way #3:  reference an existing schema using webdav url_**

Let&#8217;s start with the drawbacks first: the only real requirement with this approach is that you have to create the schema in the same folder where you&#8217;re uploading the assembly. This may be not an issue, depends on how you have architectured your project.

All you need to do is to create the schema as before (remember the directory thing), <a title="SDL Tridion: how to get WebDAV url of an item" href="http://www.davidguida.net/sdl-tridion-how-to-get-webdav-url-of-an-item/" target="_blank">take it&#8217;s WebDAV url </a>and use it as a parameter for the class attribute:

[csharp]  
[TcmTemplateParameterSchema(@"/webdav/910 Design HTML/Building Blocks/System/Templates/Assemblies/Page Revision Date.xsd")]  
public class PageRevisionDate : ITemplate {  
&#8230;&#8230;  
}  
[/csharp]

Here we go!

<div class="post-details-footer-widgets">
</div>