---
description: >
  Hi All! Welcome to part 2 of the Blazor 2d Gamedev series. Today we're going to see how to initialize the canvas and start rendering something.
id: 7404
title: 'Blazor GameDev &#8211; part 2: canvas initialization'
date: 2020-07-06T13:54:02-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7404
permalink: /blazor-gamedev-part-2-canvas-initialization/
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
  - "8112678031"
image: /assets/uploads/2020/07/blazor-2d-game-dev.jpg
categories:
  - .NET
  - ASP.NET
  - Blazor
  - Gamedev
tags:
  - Blazor
  - Gamedev
---
Hi All! Welcome to part 2 of the Blazor 2d Gamedev series. Today we&#8217;re going to see how to initialize the canvas and start rendering something.

<a href="https://www.davidguida.net/blazor-and-2d-game-development-part-1-intro/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">Last time</a> I&#8217;ve introduced the <a href="https://github.com/mizrael/BlazorCanvas" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">GitHub repo</a>, so if you haven&#8217;t already, feel free to take a quick look at the code of the various examples.

I also managed to deploy all of them to GitHub Pages, using the steps I&#8217;ve outlined in <a aria-label="undefined (opens in a new tab)" href="https://www.davidguida.net/how-to-deploy-blazor-webassembly-on-github-pages-using-github-actions/" target="_blank" rel="noreferrer noopener">another post</a>. 

#### So, for our first example, we&#8217;ll start with something easy and gradually build from it.

Step one is to add a reference to **<a aria-label="undefined (opens in a new tab)" href="https://github.com/BlazorExtensions/Canvas" target="_blank" rel="noreferrer noopener">Blazor.Extensions.Canvas</a>** . It&#8217;s a nice NuGet library that wraps the HTML 5 Canvas api for us.

Then we have to add a canvas element in our <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example1/Pages/Index.razor" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">Razor page</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="html" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;div id="theCanvas" style="position: fixed; opacity: 1; background-color: black; width: 100%; height: 100%">
    &lt;BECanvas Width="300" Height="400" @ref="_canvasReference">&lt;/BECanvas>
&lt;/div></pre>

Notice the _reference_, we&#8217;re going to need it later. When the page initialization is complete, we have to inform the HTML canvas and do some other setup. We can do it by leveraging the <a href="https://docs.microsoft.com/en-us/aspnet/core/blazor/call-javascript-from-dotnet?WT.mc_id=DOP-MVP-5003878&view=aspnetcore-3.1" target="_blank" rel="noreferrer noopener">JsRuntime </a>and run a plain JS function we&#8217;ve exposed in our <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example1/wwwroot/index.html" target="_blank">index.html</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">protected override async Task OnInitializedAsync()
{
        await JsRuntime.InvokeAsync&lt;object>("initGame", DotNetObjectReference.Create(this));

        await base.OnInitializedAsync();
}</pre>

The function name is **_initGame_**, we&#8217;ll use it to subscribe to some useful events on the _window_ ****and the canvas objects. More on this in the next posts.

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;script src="_content/Blazor.Extensions.Canvas/blazor.extensions.canvas.js">&lt;/script>
&lt;script>
    function gameLoop(timeStamp) {
        window.requestAnimationFrame(gameLoop);
        theInstance.invokeMethodAsync('GameLoop', timeStamp);
    }

    window.initGame = (instance) => {
        window.theInstance = instance;
        window.requestAnimationFrame(gameLoop);
    };
&lt;/script></pre>

For now, the &#8220;only&#8221; thing we do is leverage _[window.requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)_ to begin the render loop. The idea is quite simple: on every call to _requestAnimationFrame()_ we&#8217;ll invoke a C# function this time and update the canvas&#8217; status. Ideally, we should get 60fps, but of course, this might change based on how complex our system becomes.

The C# function has to be public and decorated with the _<a href="https://docs.microsoft.com/en-us/aspnet/core/blazor/call-dotnet-from-javascript?WT.mc_id=DOP-MVP-5003878&view=aspnetcore-3.1" target="_blank" rel="noreferrer noopener">JSInvokable</a>_ attribute. We will use it to update our state and render the current frame:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">[JSInvokable]
public async ValueTask GameLoop(float timeStamp)
{
    // update & render
}</pre>

Also, don&#8217;t forget to include the _blazor.extensions.canvas.js_ script, otherwise our Canvas wrapper won&#8217;t work.

The next step is to use the reference to the Canvas element to generate the wrapper. We have to do it in _OnAfterRenderAsync()_ in order to be sure that all the required HTML elements are in place:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">protected override async Task OnAfterRenderAsync(bool firstRender)
{
        if (firstRender)
        {
            _outputCanvasContext = await _canvasReference.CreateCanvas2DAsync();
            await _outputCanvasContext.SetTextBaselineAsync(TextBaseline.Top);
        }
}</pre>

That&#8217;s enough for today. Our render loop will be extremely simple this time, we&#8217;ll be just rendering the current application time:<figure class="wp-block-image size-large">

<img loading="lazy" width="652" height="240" src="/assets/uploads/2020/07/image.png?resize=652%2C240&#038;ssl=1" alt="" class="wp-image-7408" srcset="/assets/uploads/2020/07/image.png?w=652&ssl=1 652w, /assets/uploads/2020/07/image.png?resize=300%2C110&ssl=1 300w" sizes="(max-width: 652px) 100vw, 652px" data-recalc-dims="1" /> </figure> 

<a href="https://www.davidguida.net/blazor-gamedev-part-3-sprite-rendering/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">Next time</a> we&#8217;ll see how to handle window resizing and how to render a sprite. Don&#8217;t forget to check the full code, it&#8217;s <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/tree/develop/BlazorCanvas.Example1" target="_blank" rel="noreferrer noopener">available here</a> !

<div class="post-details-footer-widgets">
</div>