---
description: >
  In this second post of the Series we'll see how we can receive a file from a Blazor application and store it in an Azure Blob in .NET!
id: 8013
title: 'How to handle file uploads with Blazor and Azure Blob Storage - part 2: the Server'
date: 2021-06-10T00:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8013
permalink: /blazor-file-upload-azure-blob-storage-part-2/
image: /assets/uploads/2021/06/blazor-file-upload-azure-blob-storage-part-2.jpg
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
  - Azure
---

Hi All and welcome back to the fantastic world of file uploads using **Blazor** and **Azure Blob Storage**!
The <a href="/blazor-file-upload-azure-blob-storage-part-1/" target="_blank">last time</a> we created a Blazor application using the <a href="https://mudblazor.com/" target="_blank">MudBlazor</a> Components library. We also injected an instance of <a href="https://github.com/jbogard/MediatR" target="_blank">IMediator</a>, which we'll be using today to send and process the `UploadImage` command.

So, let's take exactly where we left off last time, the `OnSubmit()` method:

```csharp
private async Task OnSubmit()
{
    if (!_editContext.Validate())    
        return;    

    var command = new Commands.UploadImage(Guid.NewGuid(), _formModel.ImageFileData);
    await this.Mediator.Publish(command);
}
```
Easy-peasy. We first validate the form and if everything is fine, we build the command and send it on the Bus instance.

The Command class looks like this:

```csharp
public record UploadImage(Guid ImageId, byte[] ImageData) : INotification;
```
We'll be using `ImageId` to generate the final blob name, but feel free to use any other convention.

Then, as you have noticed, the `ImageData` property in this case is a `byte` array. We might have used a `Stream` also, which would have improved the performance. But if you remember from the last episode, we're reading the whole file to generate the thumbnail, so we already have the data in memory. 
In case you don't need the preview, you can update that to `Stream` and leverage the Azure SDK to process it.

Let's now take a look at the Command Handler:

```csharp
public class UploadImageHandler : INotificationHandler<UploadImage>
{
    private readonly IBlobFactory _blobFactory;

    public UploadImageHandler(IBlobFactory blobFactory)
    {
        _blobFactory = blobFactory ?? throw new ArgumentNullException(nameof(blobFactory));
    }

    public async Task Handle(UploadImage command, CancellationToken cancellationToken)
    {
        var blobName = $"image_{command.ImageId}.jpg";
        var blobContainer = await _blobFactory.CreateContainerAsync("uploaded-images", cancellationToken);
        await blobContainer.DeleteBlobIfExistsAsync(blobName, cancellationToken: cancellationToken);

        if (command.ImageData is not null)
        {
            using var ms = new System.IO.MemoryStream(command.ImageData);
            await blobContainer.UploadBlobAsync(blobName, ms, cancellationToken);
        }
    }
}
```

Few things going on here. First of all we build the blob name using the `ImageId` property. Then we get a `BlobContainer` through the `IBlobFactory` instance (more on this later) and check if there's already a file with the same name. If there is, we delete it and proceed with the upload through `UploadBlobAsync`.

The `IBlobFactory` implementation simply takes care of ensuring that the requested `BlobContainer` exists so that we don't have to worry about it:

```csharp
public class BlobFactory : IBlobFactory
{
    private readonly string _connectionString;

    public BlobFactory(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<BlobContainerClient> CreateContainerAsync(string containerName, CancellationToken cancellationToken = default)
    {
        var container = new BlobContainerClient(_connectionString, containerName);
        await container.CreateIfNotExistsAsync(cancellationToken: cancellationToken);
        return container;
    }
}
```

That's it for today! And don't forget to take a look at the full repository <a href="https://github.com/mizrael/BlazorImageUpload" target="_blank">on GitHub</a>. 
The <a href="/blazor-file-upload-azure-blob-storage-part-3/" target="_blank">next time</a> we'll see instead how we can also deal with large files.
Ciao!