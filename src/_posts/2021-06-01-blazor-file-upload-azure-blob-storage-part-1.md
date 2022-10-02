---
description: >
  In this first post of the Series we'll see how easy it is to handle file uploads with Blazor and Azure Blob Storage in .NET!
id: 8012
title: 'How to handle file uploads with Blazor and Azure Blob Storage - part 1: the UI'
date: 2021-06-01T00:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8012
permalink: /blazor-file-upload-azure-blob-storage-part-1/
image: /assets/uploads/2021/06/blazor-file-upload-azure-blob-storage-part-1.jpg
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
  - Azure
---
Hi All! Today we'll explore the fantastic world of file uploads using **Blazor** and **Azure Blob Storage**.

As usual, I have already created a sample application and pushed it to GitHub, <a href="https://github.com/mizrael/BlazorImageUpload" target="_blank">feel free to take a look</a>.

For this tutorial, I decided to leverage two excellent libraries: <a href="https://mudblazor.com/" target="_blank">MudBlazor</a> for the visual components and <a href="https://github.com/jbogard/MediatR" target="_blank">MediatR</a> to handle the server-side execution. I don't really think they need introduction, and they also have excellent documentation already, so I won't indulge much on their setup.

So let's get down to business! These are the main features we want for our little app:
- the user can select one image file
- the page will show a preview of the image before uploading
- images can be only `.jpg` and `.png`
- files can't be more than 1MB
- files will be stored in an Azure Blob

That's quite a lot of things, so let's start.

The core of the UI is handled by MudBlazor's <a href="https://mudblazor.com/components/fileupload" target="_blank">FileUpload component</a>. Let's take a look at our Razor page :

```html
@using System.ComponentModel.DataAnnotations
@inject ISnackbar Snackbar
@inject MediatR.IMediator Mediator

<EditForm OnSubmit="@OnSubmit" EditContext="@_editContext">
	<MudGrid>
        @if (!string.IsNullOrWhiteSpace(_formModel.PreviewUrl))
        {
            <MudItem xs="12">
                <img src="@_formModel.PreviewUrl" />
            </MudItem>
        }
        
        <MudItem xs="12">
            <InputFile id="inputImage" OnChange="OnImageChanged" hidden accept=".jpg, .jpeg, .png" />
            <MudButton HtmlTag="label"
                       Variant="Variant.Filled"
                       Color="Color.Primary"
                       StartIcon="@Icons.Filled.Image"
                       for="inputImage">
                Select Image
            </MudButton>
        </MudItem>

		<MudItem xs="12" Class="my-4">
			<MudButton ButtonType="ButtonType.Submit" Variant="Variant.Filled" Color="Color.Primary" FullWidth="true">Submit</MudButton>
		</MudItem>

		<MudItem xs="12" Class="my-4">
            <DataAnnotationsValidator />
            <ValidationSummary />
        </MudItem>
	</MudGrid>
</EditForm>
```

We are injecting few dependencies here:
- `ISnackbar` is a UI component we'll use to display an error message
- `IMediator` is our <a href="/cqrs-on-commands-and-validation/" target="_blank">bus</a>, we'll use it to send the upload command to the server

The `OnSubmit()`  method and `_editContext` will help us with the final validation and with processing the actual upload. But we have specific rules on the files, which we'll be handling with `OnImageChanged()`.  

Now let's move to the `@code` part of the page:

```csharp
@code {
    public class ImageUploadFormModel
    {
        public IBrowserFile ImageFile { get; set; }
        public string PreviewUrl { get; set; }
        [Required]
        public byte[] ImageFileData { get; set; }
    }
    
	private const int MaxImageUploadSizeMB = 1;
    private const int MaxImageUploadSize = MaxImageUploadSizeMB * 1000000; //in bytes

	private ImageUploadFormModel _formModel;
    private EditContext _editContext;
    
	protected override async Task OnInitializedAsync()
    {
        _formModel = new();
        _editContext = new(_formModel);
    }

	private async Task OnImageChanged(InputFileChangeEventArgs e) { 
		// not yet my friend...
	}
	private async Task OnSubmit() {
   		// not yet my friend...
    }
}
```
These are all the basic fields we need. We start off by declaring a Model class for our form, `ImageUploadFormModel`, which holds a pointer to the selected file and its data. We could have used a `Stream` instead of a `byte` array, we'll talk about this later. We also define the maximum file upload size, both in bytes and MB. We'll use them for the validation and the error message.
In our `OnInitializedAsync()` method we simply initialize the model and the `EditContext`, nothing more.

Let's now take a look at `OnImageChanged()`:
```csharp
private async Task OnImageChanged(InputFileChangeEventArgs e)
{
	_formModel.ImageFile = null;
    _formModel.ImageFileData = null;
    _formModel.PreviewUrl = null;

    if (e?.File is null)
        return;

    if (e.File.Size > MaxImageUploadSize)
    {
        Snackbar.Configuration.PositionClass = Defaults.Classes.Position.TopCenter;
        Snackbar.Add($"please don't exceed {MaxImageUploadSize / 1000000} MB", Severity.Error);
        return;
    }

    _formModel.ImageFile = await e.File.RequestImageFileAsync("image/jpeg", 200, 200);
    if (_formModel.ImageFile is null)
        return;

    await using var imageStream = _formModel.ImageFile.OpenReadStream();
    _formModel.ImageFileData = new byte[_formModel.ImageFile.Size];
    await imageStream.ReadAsync(_formModel.ImageFileData);

    _formModel.PreviewUrl = $"data:image/jpeg;base64,{Convert.ToBase64String(_formModel.ImageFileData)}";    
}
```
We first reset the model state and then start with the validations. We check if we actually got a file (you never know...) and then we check its size. If it's bigger than `MaxImageUploadSize`, we show a nice error message to the user and call it a day.

Otherwise, we can start building the preview image. <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.components.forms.browserfileextensions.requestimagefileasync?view=aspnetcore-5.0&WT.mc_id=DOP-MVP-5003878" target="_blank">RequestImageFileAsync()</a> is a very useful little method, executed directly into the browser's JavaScript runtime. It will **try** to convert the image to a specific format and change the size, while at the same time preserving the aspect ratio. 

### Be careful though: as the documentation states very cleary, there is no guarantee that the file will be converted, or will even be a valid image file at all, either before or after conversion.

Once we have converted the image, we read its data, store it on our Model and build the `PreviewUrl`.

Now the last part of the puzzle (at least on the UI):

```csharp
private async Task OnSubmit()
{
    if (!_editContext.Validate())    
        return;    

    var command = new Commands.UploadImage(Guid.NewGuid(), _formModel.ImageFileData);
    await this.Mediator.Publish(command);
}
```
This one's pretty easy. We simply trigger the form validation and if everything's fine, we build the Command and publish on our Bus.

That's all for the UI! The <a href="/blazor-file-upload-azure-blob-storage-part-2/" target="_blank">next time</a> we'll take a look at the server and see how we can receive the image data and store it in an Azure Blob. Ciao!