---
description: >
  Hi All! Today we're going to focus on the backend and see how we can write a gRPC server that can be called from a Blazor webassembly application.
id: 7369
title: 'Blazor&#038;Dragons! How to consume gRPC-web from Blazor - part 2: the server'
date: 2020-06-26T14:56:54-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7369
permalink: /blazordragons-how-to-consume-grpc-web-from-blazor-part-2-the-server/
image: /assets/uploads/2020/06/blazor-and-dragons-2.jpg
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
Hi All! <a aria-label="undefined (opens in a new tab)" href="https://www.davidguida.net/how-to-consume-dd-rest-api-over-grpc-web-blazor-part-1-the-client/" target="_blank" rel="noreferrer noopener">Last time</a> we gave a look at the client, today we're going to focus on the backend and see how we can write a **gRPC server** that can be called from a **Blazor webassembly** application.

Did I mention how nerd I was? Yeah, probably I did. Just have a look at what I'm listening right now while writing this article:<figure class="wp-block-embed-youtube aligncenter wp-block-embed is-type-video is-provider-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio">

<div class="wp-block-embed__wrapper">
  <span class="embed-youtube" style="text-align:center; display: block;"></span>
</div></figure> 

So, the server. As I wrote last time, it is basically just a simple proxy over the <a aria-label="undefined (opens in a new tab)" href="https://www.dnd5eapi.co/" target="_blank" rel="noreferrer noopener">D&D REST API</a>. I deliberately decided to not add any caching or other fancy things, just to focus on the transport.

The first thing to do is to define the shape of our messages:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">syntax = "proto3";
import "google/protobuf/empty.proto";
option csharp_namespace = "BlazorAndDragons.Server";

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

This is basically the same thing as the <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorAndDragons/blob/master/BlazorAndDragons.Client/Protos/classes.proto" target="_blank" rel="noreferrer noopener">one on the client</a>. The only difference is the namespace: _option csharp_namespace = "BlazorAndDragons.Server";_

The next step is to create the Typed HTTP Client that will fetch the data from the D&D API:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class DnDClient : IDnDClient
{
        private readonly HttpClient _httpClient;

        public DnDClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public Task&lt;DndArchive&lt;DnDClassArchiveItem>> GetAllClassesAsync() =>
            _httpClient.GetFromJsonAsync&lt;DndArchive&lt;DnDClassArchiveItem>>("classes");

        public Task&lt;DndClass> GetClassAsync(string id) =>
            _httpClient.GetFromJsonAsync&lt;DndClass>($"classes/{id}");
}</pre>

#### Defining an interface is useful for a humongous number of reasons. TDD anyone?

All the nice cross-cutting concerns can be defined elsewhere, for example at <a href="https://github.com/mizrael/BlazorAndDragons/blob/master/BlazorAndDragons.Server/Startup.cs#L27" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">IoC registration</a>. We could decide to add improved logging, caching, circuit breaker and so on. I didn't because I'm lazy as&#8230;well, you know. 

Now that we have an HTTP Client, all we have to do is inject it into our <a href="https://github.com/mizrael/BlazorAndDragons/blob/master/BlazorAndDragons.Server/Services/ClassesService.cs" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">gRPC service</a> and use it:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class ClassesService : Classes.ClassesBase
    {
        private readonly IDnDClient _client;

        public ClassesService(IDnDClient client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
        }

        public override async Task&lt;GetAllResponse> GetAll(Empty request, ServerCallContext context)
        {
            var classes = await _client.GetAllClassesAsync();
            
            var result = new GetAllResponse();
            result.Data.AddRange(classes.Results.Select(c => new GetAllResponse.Types.ClassArchiveItem()
            {
                Id = c.Index,
                Name = c.Name
            }));

            return result;
        }
}</pre>

#### Technically speaking, we're done. That's it. Finito.

However, since we'll be calling this service from a browser, we have to deal with <a aria-label="undefined (opens in a new tab)" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" target="_blank" rel="noreferrer noopener">CORS</a>. It's not that complex, it just has to do in the right way.

The first step is to update the _ConfigureServices()_ method in Startup.cs and define the policy:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public void ConfigureServices(IServiceCollection services)
{
     services.AddCors(o => o.AddPolicy("AllowAll", builder =>
            {
                builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .WithExposedHeaders("Grpc-Status", "Grpc-Message", "Grpc-Encoding", "Grpc-Accept-Encoding");
            }));
}</pre>

In our small example we're allowing **everybody and their dog** to call our gRPC service. In a real world scenario you'll want to restrict to just a bunch of known clients.

The final step is, still in Startup.cs, to update the _Configure() ****_method and register the necessary middlewares:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
            app.UseRouting();
            app.UseCors();
            app.UseGrpcWeb();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGrpcService&lt;ClassesService>()
                    .RequireCors("AllowAll")
                    .EnableGrpcWeb();
            });
}</pre>

Don't forget that the order of the middlewares matters. A lot.

Have fun!

<div class="post-details-footer-widgets">
</div>