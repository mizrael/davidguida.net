---
description: >
  Today we'll see a simple technique to render a dynamic Component with Blazor. We will define a template and pass it to a Child Component.
id: 7785
title: How to render a dynamic Component with Blazor
date: 2020-10-21T10:45:02-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7785
permalink: /how-to-render-a-dynamic-component-with-blazor/
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
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/05/blazor.png
categories:
  - .NET
  - ASP.NET
  - Blazor
tags:
  - Blazor
---
Hi All! Today we&#8217;re going to see a simple technique to render a **dynamic Component** with **Blazor**.

Suppose you want to create a generic Component to handle lists. Something very easy like this:

<pre class="EnlighterJSRAW" data-enlighter-language="html" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">@typeparam TItem

&lt;ul>
@foreach(var item in Items){
    &lt;li>....&lt;/li>
}
&lt;/ul>

@code{
    [Parameter]
    public IEnumerable&lt;TItem> Items {get;set;}
}</pre>

The first thing to notice is that we used the <a href="https://docs.microsoft.com/en-us/aspnet/core/mvc/views/razor?view=aspnetcore-3.1&WT.mc_id=DOP-MVP-5003878#typeparam" target="_blank" rel="noreferrer noopener"><strong><em>@typeparam </em>directive</strong></a> to specify the Generic type.

But if you look carefully, you can see that we haven&#8217;t defined a way to render the items. We want this _**ListComponent**_ to be as generic as possible, so we need a way to provide the layout definition and logic somewhere else.

#### The easiest way to achieve this is to make use of the <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.components.renderfragment?view=aspnetcore-3.1&WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener"><strong><em>RenderFragment </em></strong></a>delegate. With it, we can define the rendering logic in our parent Component and pass it over to the List Component.

The parent Component will look like this:

<pre class="EnlighterJSRAW" data-enlighter-language="html" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;ListComponent Items="_items" Renderer="_customRenderer" />

@code {
	private RenderFragment&lt;Foo> _customRenderer = (model) => @&lt;span>@Foo.Bar&lt;/span>;
	private IEnumerable&lt;Foo> _items = ...;
}</pre>

And this will be our new _**ListComponent**_:

<pre class="EnlighterJSRAW" data-enlighter-language="html" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">@typeparam TItem

&lt;ul>
@foreach(var item in Items){
    &lt;li>@Renderer(item)&lt;/li>
}
&lt;/ul>

@code{
    [Parameter]
    public IEnumerable&lt;TItem> Items {get;set;}
    [Parameter]
    public RenderFragment&lt;TItem> Renderer {get;set;}
}</pre>

In the example we used the generic version of <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.components.renderfragment-1?view=aspnetcore-3.1&WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener"><strong><em>RenderFragment</em></strong></a>, super handy in contexts like this.

If you like Blazor and game programming, don&#8217;t miss my series on <a href="https://www.davidguida.net/blazor-and-2d-game-development-part-1-intro/" target="_blank" rel="noreferrer noopener">2D Gamedev</a>!

<div class="post-details-footer-widgets">
</div>