---
description: >
  In this third post of the Series we'll see how we can handle uploads of large files
id: 8014
title: 'How to handle file uploads with Blazor and Azure Blob Storage - part 3: large files'
date: 2021-06-20T00:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8014
permalink: /blazor-file-upload-azure-blob-storage-part-3/
image: /assets/uploads/2021/06/blazor-file-upload-azure-blob-storage-part-3.jpg
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
  - Azure
---

Hi All and welcome back to another episode of the Series "How to handle file uploads with **Blazor** and **Azure Blob Storage**"!

The <a href="/blazor-file-upload-azure-blob-storage-part-2/" target="_blank">last time</a> we went down the rabbit hole and wrote the server-side code responsible of storing our images in am Azure Blob Container.
The "problem" with that sample is that we are pre-loading the image in order to show a preview to the user. This prevents us from sending a `Stream` to our server and leverage the `UploadBlobAsync()`  method on the <a target="_blank" href="https://docs.microsoft.com/en-us/dotnet/api/azure.storage.blobs.blobcontainerclient?view=azure-dotnet&WT.mc_id=DOP-MVP-5003878">`BlobContainerClient`</a> instance.

### This might even be fine for small files, but what if we're dealing with really large uploads and we don't even need a preview?

And indeed, <a href="https://www.linkedin.com/feed/update/urn:li:activity:6809103751631134720?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A6809103751631134720%2C6809577517695975424%29" target="_blank">Edoardo</a> even asked me that on LinkedIn, so let's figure it out!

I've made few changes to the repository <a href="https://github.com/mizrael/BlazorImageUpload" target="_blank">on GitHub</a> and added a new box:

![Blazor file uploads](/assets/uploads/2021/06/blazor_file_upload.JPG)

As you can see, you can customize the maximum allowed size in MB, select a file and upload it. This time no preview box. But what's the difference? It's subtle and starts in the `OnSubmit()` method:

```csharp
private async Task OnSubmit()
{
    var allowedSize = (long)_formModel.MaxFileSize * 1000000;
    using var stream = _formModel.File.OpenReadStream(allowedSize);

    var command = new Commands.UploadFile(Guid.NewGuid(), stream);
    await this.Mediator.Publish(command);
}
```
It all lies in the `OpenReadStream` call: <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.components.forms.ibrowserfile.openreadstream?view=aspnetcore-5.0&WT.mc_id=DOP-MVP-5003878" target="_blank">by default</a>  the file size is capped at 500 KB, but it can be customized by passing the desired amount.

At this point all we have to do is to send the resulting `Stream` instance to the Command Handler and we're done, at least on the client.

On the server now we don't have to create a `MemoryStream` anymore, but we can call directly `UploadBlobAsync()`:

```csharp
public async Task Handle(UploadFile command, CancellationToken cancellationToken)
{
    var blobName = $"file_{command.FileId}.jpg";
    var blobContainer = await _blobFactory.CreateContainerAsync("uploaded-files", cancellationToken);
    await blobContainer.DeleteBlobIfExistsAsync(blobName, cancellationToken: cancellationToken);

    if (command.FileStream is not null)
    {
        await blobContainer.UploadBlobAsync(blobName, command.FileStream, cancellationToken);
    }
}
```

That's it!

This way you can easily handle uploads of very large files with Blazor. For those interested, if you fire up your browser's developer tools, you might also be able to see the network calls on the websocket:

![Blazor websocket calls](/assets/uploads/2021/06/blazor_file_upload_network.JPG)

Ciao!