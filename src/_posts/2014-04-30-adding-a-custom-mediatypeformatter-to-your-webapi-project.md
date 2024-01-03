---
id: 476
title: Adding a custom MediaTypeFormatter to your WebAPI project
date: 2014-04-30T15:43:21-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=476
permalink: /adding-a-custom-mediatypeformatter-to-your-webapi-project/
dsq_thread_id:
  - "5139603624"
image: /assets/uploads/2014/04/WebAPI.jpg
categories:
  - ASP.NET
  - Programming
  - WebAPI
---
This is going to be easy. As many of the other posts of this blog, even this entry is due to an issue I was forced to face, this time with the marvelous IE8 😀  
In a nutshell, I have a WebAPI project returning some nice json data. Everything works fine, except when you try to access the api via Ajax + IE8&#8230;the browser is somehow refusing to perform the ajax call due to the fact that the content type "application/json" in the response header is not recognised. Damn.

What I had to do is adding a custom MediaTypeFormatter that returns the json data using "text/plain", and then on client side parse the resulting string using some library like <a title="JSON2" href="https://github.com/douglascrockford/JSON-js" target="_blank">this one</a>.

Here's the code of the formatter:

[csharp]  
public class PlainTextMediaTypeFormatter : MediaTypeFormatter  
{  
const string supportedMediaType = "text/plain";

public PlainTextMediaTypeFormatter()  
{  
this.AddQueryStringMapping("format", "plain", new MediaTypeHeaderValue(supportedMediaType));  
}

public override void SetDefaultContentHeaders(Type type, HttpContentHeaders headers, MediaTypeHeaderValue mediaType)  
{  
base.SetDefaultContentHeaders(type, headers, mediaType);  
}

public override bool CanReadType(Type type)  
{  
return false;  
}

public override bool CanWriteType(Type type)  
{  
return true;  
}

public override Task WriteToStreamAsync(Type type, object value, Stream writeStream, HttpContent content, TransportContext transportContext)  
{  
using (var writer = new StreamWriter(writeStream))  
{  
var jsonData = string.Empty;  
if (null != value)  
jsonData = Newtonsoft.Json.JsonConvert.SerializeObject(value);

writer.WriteLine(jsonData);  
}

var tcs = new TaskCompletionSource<object>();  
tcs.SetResult(null);  
return tcs.Task;  
}  
}  
[/csharp]

The code is pretty easy, we can split it into 2 main parts:  
1) use MediaTypeFormatterExtensions.AddQueryStringMapping to register custom querystring parameter, telling the WebAPI engine to use this media formatter (for example: http://mywebapi.com/products?format=plain)  
2) in the WriteToStreamAsync method just serialize the input value to json and write it to the output stream as string (I am using the terrific <a title="Json.NET" href="http://james.newtonking.com/json" target="_blank">Newtonsoft Json library</a> for this)

BONUS:  
if you don't like adding more querystring parameters,  the <a title="MediaTypeFormatterExtensions" href="http://msdn.microsoft.com/en-us/library/system.net.http.formatting.mediatypeformatterextensions(v=vs.118).aspx" target="_blank">MediaTypeFormatterExtensions </a>class exposes other two methods, AddRequestHeaderMapping and AddUriPathExtensionMapping.

Enjoy!

<div class="post-details-footer-widgets">
</div>