---
description: >
  Hi All! Today we're going to talk about how to consume a gRPC service from a Blazor client. And we're going to do it with Dungeons & Dragons!
id: 7350
title: 'Blazor&#038;Dragons! How to consume gRPC-web from Blazor &#8211; part 1: the client'
date: 2020-06-24T14:21:51-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7350
permalink: /how-to-consume-dd-rest-api-over-grpc-web-blazor-part-1-the-client/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/06/blazor-and-dragons.jpg
categories:
  - .NET
  - ASP.NET
  - Blazor
  - Microservices
  - Programming
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
  - 'D&amp;D'
---
Hi All! Today we&#8217;re going to talk about how to consume a **gRPC** service from a **Blazor** client. And we&#8217;re going to do it with <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://dnd.wizards.com/dungeons-and-dragons/what-is-dd" target="_blank">Dungeons & Dragons</a>!

People who know me, know that deep down, I&#8217;m a big nerd. I started playing D&D when I was a freshman in college and kept going for years. Eventually, I began writing my own campaigns, holding sessions as Dungeon Master and even participating in competitions. And winning.

I play <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://store.steampowered.com/app/257350/Baldurs_Gate_II_Enhanced_Edition/" target="_blank">Baldur&#8217;s Gate 2</a> at least once a year. Each time with a different class/race. Oh boy, that game is massive! 

The last game I bought on Steam? <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://store.steampowered.com/app/321800/Icewind_Dale_Enhanced_Edition/" target="_blank">Icewind Dale</a>. Of course, I played it in the past but never had the pleasure of &#8220;owning&#8221; it.

So what does all of this with **Blazor** and **gRPC**? Well, a few days ago I was looking for a fun way to study them both. And I thought: is there anything out in the interwebz that I can leverage?&nbsp; 

And the answer, of course, was yes: the **<a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://www.dnd5eapi.co/" target="_blank">D&D 5e REST API</a>**! It&#8217;s free and doesn&#8217;t require any auth so it&#8217;s a perfect way to feed some data in our app.

#### My goal? Well as I said, I just wanted to play with **Blazor** and **gRPC**. And have some fun in the meantime.

So I wrote a simple **<a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://devblogs.microsoft.com/aspnet/blazor-webassembly-3-2-0-now-available/" target="_blank">Blazor webassembly</a>** gRPC client to display an archive of D&D classes. You can click on a row and get redirected to a detail page. Easy peasy.

The data is coming from a separate application, exposing a **gRPC** service. This server is basically just a simple proxy over the D&D REST API. I deliberately decided to not add any caching or other fancy things, just to focus on the transport.

Now, due to browser limitations, we can&#8217;t really use gRPC here, but we can rely on gRPC-web instead. Let me quote <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="http://james.newtonking.com/bio" target="_blank">James Newton-King</a>:

<blockquote class="wp-block-quote">
  <p>
    It is impossible to implement the gRPC HTTP/2 spec in the browser because there is no browser API with enough fine-grained control over HTTP requests.&nbsp;<a rel="noreferrer noopener" href="https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-WEB.md" target="_blank">gRPC-Web</a>&nbsp;solves this problem by being compatible with HTTP/1.1 and HTTP/2.
  </p>
</blockquote>

For those interested, the full article <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://devblogs.microsoft.com/aspnet/grpc-web-experiment/" target="_blank">is here</a>.<figure class="wp-block-image alignwide size-large">

[<img loading="lazy" width="754" height="424" src="/assets/uploads/2020/06/image-5.png?resize=754%2C424&#038;ssl=1" alt="" class="wp-image-7355" srcset="/assets/uploads/2020/06/image-5.png?w=754&ssl=1 754w, /assets/uploads/2020/06/image-5.png?resize=300%2C169&ssl=1 300w" sizes="(max-width: 754px) 100vw, 754px" data-recalc-dims="1" />](/assets/uploads/2020/06/image-5.png?ssl=1)<figcaption>yes, before you say it, I&#8217;m not good at naming things.</figcaption></figure> 

As usual, the code is <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://github.com/mizrael/BlazorAndDragons" target="_blank">available on GitHub</a>, help yourself.

Let&#8217;s explore the client today. The first step is to add <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://github.com/mizrael/BlazorAndDragons/blob/master/BlazorAndDragons.Client/Protos/classes.proto" target="_blank">our .proto file</a>, defining the layout of our messages:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">syntax = "proto3";
import "google/protobuf/empty.proto";
option csharp_namespace = "BlazorAndDragons.Client";
package classes;
service Classes {
	rpc GetAll (google.protobuf.Empty) returns (GetAllResponse);
	rpc GetDetails(GetDetailsRequest) returns (GetDetailsResponse);
}
message GetAllResponse {
	message ClassArchiveItem{
		string id = 1;
		string name = 2;
	} 
	repeated ClassArchiveItem data = 1;
}
message GetDetailsRequest{
	string id = 1;
}
message GetDetailsResponse{
	string id=1;
	string name=2;
	int32 hitDie=3;
	repeated Proficiency proficiencies=4;
	message Proficiency{
		string name=1;
	}
}</pre>

Not much to say here. We have two methods, one returning all the available classes (and taking no parameter: thank you _<a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Empty" target="_blank">google.protobuf.Empty</a>_ ). The other one instead returns the class details given the id.

Notice how I&#8217;ve leveraged the _repeated_ keyword to define arrays of complex objects.

Now, an extremely important step is to make sure our .proto definition is properly referenced in <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://github.com/mizrael/BlazorAndDragons/blob/master/BlazorAndDragons.Client/BlazorAndDragons.Client.csproj" target="_blank">our .csproj file</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;ItemGroup>
    &lt;Protobuf Include="Protos\classes.proto" GrpcServices="Client" />
&lt;/ItemGroup></pre>

That _GrpcServices=&#8221;Client&#8221;_ will basically tell Visual Studio to generate the client proxy classes for us. Quite handy indeed.

Now we have to plug the client in our DI container in our <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://github.com/mizrael/BlazorAndDragons/blob/master/BlazorAndDragons.Client/Program.cs" target="_blank">Program.cs</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">var builder = WebAssemblyHostBuilder.CreateDefault(args);           
builder.Services.AddSingleton(sp =>
{
    var config = sp.GetRequiredService&lt;IConfiguration>();
    var serverUrl = config["ServerUrl"];
    var channel = GrpcChannel.ForAddress(serverUrl, new GrpcChannelOptions
                {
                    HttpHandler = new GrpcWebHandler(GrpcWebMode.GrpcWeb, new HttpClientHandler())
                });
    var client = new Classes.ClassesClient(channel);
    return client;
 });</pre>

As you can see, I&#8217;m using _GrpcWebMode.GrpcWeb_ here. I&#8217;m not doing any streaming, just unary calls so no need to use _GrpcWebMode.GrpcWebText_. This gives me the benefit of smaller messages:<figure class="wp-block-image alignwide size-large">

<img loading="lazy" width="1175" height="142" src="/assets/uploads/2020/06/image-6.png?fit=788%2C95&ssl=1" alt="" class="wp-image-7359" srcset="/assets/uploads/2020/06/image-6.png?w=1175&ssl=1 1175w, /assets/uploads/2020/06/image-6.png?resize=300%2C36&ssl=1 300w, /assets/uploads/2020/06/image-6.png?resize=1024%2C124&ssl=1 1024w, /assets/uploads/2020/06/image-6.png?resize=768%2C93&ssl=1 768w, /assets/uploads/2020/06/image-6.png?resize=788%2C95&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" /> <figcaption>_GrpcWebMode.GrpcWeb_</figcaption></figure> <figure class="wp-block-image alignwide size-large">[<img loading="lazy" width="1179" height="174" src="/assets/uploads/2020/06/image-7.png?fit=788%2C116&ssl=1" alt="" class="wp-image-7360" srcset="/assets/uploads/2020/06/image-7.png?w=1179&ssl=1 1179w, /assets/uploads/2020/06/image-7.png?resize=300%2C44&ssl=1 300w, /assets/uploads/2020/06/image-7.png?resize=1024%2C151&ssl=1 1024w, /assets/uploads/2020/06/image-7.png?resize=768%2C113&ssl=1 768w, /assets/uploads/2020/06/image-7.png?resize=788%2C116&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" />](/assets/uploads/2020/06/image-7.png?ssl=1)<figcaption>_GrpcWebMode.GrpcWebText_</figcaption></figure> 

For those interested, <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/aspnet/core/grpc/client?view=aspnetcore-3.1#make-grpc-calls" target="_blank">here&#8217;s a nice article</a> explaining the difference between unary and streamed calls. 

Now the last step: let&#8217;s call our service! That&#8217;s actually the <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://github.com/mizrael/BlazorAndDragons/blob/master/BlazorAndDragons.Client/Pages/Index.razor" target="_blank">easy part</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">@page "/"
@using Google.Protobuf.WellKnownTypes
@inject Classes.ClassesClient Client
&lt;h1>Classes&lt;/h1>
@if (_classes == null)
{
    &lt;p>&lt;em>Loading...&lt;/em>&lt;/p>
}
else
{
    &lt;table class="table">
        &lt;thead>
            &lt;tr>
                &lt;th>Name&lt;/th>
            &lt;/tr>
        &lt;/thead>
        &lt;tbody>
            @foreach (var item in _classes)
            {
                &lt;tr>
                    &lt;td>&lt;a href="/class/@item.Id">@item.Name&lt;/a>&lt;/td>
                &lt;/tr>
            }
        &lt;/tbody>
    &lt;/table>
}
@code {
    private GetAllResponse.Types.ClassArchiveItem[] _classes;
    protected override async Task OnInitializedAsync()
    {
        var results = await this.Client.GetAllAsync(new Empty());
        this._classes = results?.Data?.ToArray();
    }
}</pre>

As you can see, the **Client** is injected and invoked during page initialization. Stop. No strings attached. Told you t&#8217;was easy.

<a href="https://www.davidguida.net/blazordragons-how-to-consume-grpc-web-from-blazor-part-2-the-server/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">Next time</a> we&#8217;ll take a look at our server instead. Thanks for reading!

<div class="post-details-footer-widgets">
</div>