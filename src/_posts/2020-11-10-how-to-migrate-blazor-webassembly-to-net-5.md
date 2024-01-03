---
description: >
  Let's find out how to migrate your awesome Blazor Webassembly project to .NET 5 in few easy steps!
id: 7830
title: How to migrate Blazor Webassembly to .NET 5
date: 2020-11-10T16:04:49-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7830
permalink: /how-to-migrate-blazor-webassembly-to-net-5/
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
image: /assets/uploads/2020/11/blazor-dot-net-5.jpg
categories:
  - .NET
  - ASP.NET
  - Blazor
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
---
.NET 5 is out today! It's a big milestone and comes with <a href="https://devblogs.microsoft.com/dotnet/announcing-net-5-0/?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">a huge list</a> of improvements. I've been working a bit with **Blazor** lately, trying to brush up <a href="https://www.davidguida.net/blazor-and-2d-game-development-part-1-intro/" target="_blank" rel="noreferrer noopener">my gamedev skills</a> again. So I took the chance and decided to upgrade <a href="https://github.com/mizrael/Blazeroids" target="_blank" rel="noreferrer noopener">my little pet project</a> to the latest version 🙂

The first thing to do is to <a href="https://visualstudio.microsoft.com/downloads/?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">install or update</a> Visual Studio 2019 to version 16.8.0. For those interested, the release notes are <a href="https://docs.microsoft.com/en-us/visualstudio/releases/2019/release-notes#16.8.0" target="_blank" rel="noreferrer noopener">available here</a>. In case you're using a different IDE (or you're on Linux/Mac), you can directly download <a href="https://dotnet.microsoft.com/download/dotnet/5.0?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">the .NET 5 SDK</a> instead.

Once you've done installing, fire up your **Blazor** project and open the .csproj file. We're going to change few little things:

  1. At the very top, update the SDK from&nbsp;`<em>Microsoft.NET.Sdk.Web</em>`&nbsp;to&nbsp;`<em>Microsoft.NET.Sdk.BlazorWebAssembly</em>`

<pre class="EnlighterJSRAW" data-enlighter-language="xml" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;Project Sdk="Microsoft.NET.Sdk.BlazorWebAssembly"></pre>

2. Set the _TargetFramework_ to _net5.0_

<pre class="EnlighterJSRAW" data-enlighter-language="xml" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;PropertyGroup>
    &lt;TargetFramework>net5.0&lt;/TargetFramework>
  &lt;/PropertyGroup></pre>

3. In case you have it, remove the package reference to _<a href="https://www.nuget.org/packages/Microsoft.AspNetCore.Components.WebAssembly.Build" target="_blank" rel="noreferrer noopener">Microsoft.AspNetCore.Components.WebAssembly.Build</a>_

4. Update your Nuget dependencies

Now make sure you Clean your entire solution, otherwise the build engine won't be able to re-generate all the required files with the updated framework.

Enjoy!

<div class="post-details-footer-widgets">
</div>