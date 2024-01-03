---
description: >
  Hi All! For my first Azure article ever I'll show few snippets of how to dynamically set the blob name and write to it using an Azure Function
id: 7468
title: How to dynamically set blob name in an Azure Function
date: 2020-07-28T21:16:55-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7468
permalink: /how-to-dynamically-set-blob-name-in-an-azure-function/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
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
dsq_thread_id:
  - "8144892147"
image: /assets/uploads/2020/07/azure-functions.png
categories:
  - .NET
  - Azure
tags:
  - Azure
  - Azure Functions
  - message queues
---
Hi All! Today we're going to see how to dynamically set the blob name and write to it in an **Azure Function**. This is probably my first Azure article ever, and probably the first one of a long list 🙂

I'll probably end up writing something about **Azure** and **Event Sourcing** at some point, so if you're interested don't forget to take a look at my <a href="https://www.davidguida.net/event-sourcing-in-net-core-part-1-a-gentle-introduction/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">other articles</a>.

So, let's suppose we have a nice Azure Function with a <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">BlobTrigger</a>, meaning that the function will be triggered every time a file is uploaded to a specific Blob Container.

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">[FunctionName("MyFancyFunction")]
public static async Task Run([BlobTrigger("inbound/{name}", Connection = "AzureWebJobsStorage")] Stream inboundBlob, string name)
{
    // do something here
}</pre>

As you can see, we have access to an input stream and we also get the filename. The _AzureWebJobsStorage_ configuration variable will store the connection string to the Blob Container.

#### Now, how can we _write ****_to a stream instead?

One simple option is to add a _Stream_ parameter decorated with the _[Blob]_ attribute:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public static async Task Run([BlobTrigger("inbound/{name}", Connection = "AzureWebJobsStorage")] Stream inboundBlob,
[Blob("outbound/{name}", Connection = "AzureWebJobsStorage", Access = FileAccess.Write)] Stream outboundBlob, 
string name){
    // do something here
}</pre>

The two streams will share the name, although the destination Container in this case is different. We can use several patterns for the Blob _path_, for a detailed explanation <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-expressions-patterns?WT.mc_id=DOP-MVP-5003878#trigger-file-name" target="_blank" rel="noreferrer noopener">check here</a>.

Using the _{name}_ pattern, our Function will be called with any filename, even with extensionless files. In case we want a bit more control, we can use this format instead: _{blobName}.{blobExtension}_ .

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">[FunctionName("InboundBlobEncode")]
public static async Task Run([BlobTrigger("inbound/{blobName}.{blobExtension}", Connection = "AzureWebJobsStorage")]Stream inboundBlob,
string blobName, 
string blobExtension){
    // function body here
}</pre>

We can leverage this pattern for example if we want our Function to execute only for specific extensions (eg _{blobName}.jpg_ ).

In some cases, however, we might want to generate the output filename at runtime. We could leverage the** _{rand-guid}_** expression or even **_{Datetime}_**, but in that case, we won't have real control over it. We can't even store it in a temporary variable for later reuse.

This is the situation where <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-dotnet-class-library?WT.mc_id=DOP-MVP-5003878#binding-at-runtime" target="_blank" rel="noreferrer noopener">imperative binding</a> comes to the rescue: by adding an instance of _<a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/IBinder.cs" target="_blank">IBinder </a>_as input parameter, we can generate the name of the destination Blob with our own rules and directly get a reference to it:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public static async Task Run(/*other input params*/, IBinder binder){
    var outBlobId = Guid.NewGuid();
    var outboundBlob = new BlobAttribute($"outbound/{outBlobId}", FileAccess.Write);
    using var writer = binder.Bind&lt;Stream>(outboundBlob);
    // process the stream
}</pre>

In this snippet, we're creating a new GUID and using it as Blob name. We can, later on, use it to create a message and send it to a Queue to be picked up by another process.

<div class="post-details-footer-widgets">
</div>