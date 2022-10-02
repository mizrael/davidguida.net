---
description: >
  Hi All! Welcome to part 3 of the Blazor 2d Gamedev series. Today we're going to see how to render a sprite and handle the window resize event.
id: 7415
title: 'Blazor GameDev &#8211; part 3: sprite rendering'
date: 2020-07-09T15:39:14-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7415
permalink: /blazor-gamedev-part-3-sprite-rendering/
image: /assets/uploads/2020/07/blazor-2d-game-dev.jpg
categories:
  - .NET
  - ASP.NET
  - Blazor
  - Gamedev
  - Programming
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
---
Hi All! Welcome to part 3 of the Blazor 2d Gamedev series. Today we&#8217;re going to see how to render a sprite and handle the window resize event.

<a href="https://www.davidguida.net/blazor-gamedev-part-2-canvas-initialization/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">Last time</a> we saw how easy it is to initialize the HTML Canvas and render some text. Now we&#8217;re going to expand that code and add the new functionalities. 

All the sources are available in the <a href="https://github.com/mizrael/BlazorCanvas/tree/develop/BlazorCanvas.Example2" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">Example 2 folder</a> on GitHub. There&#8217;s a demo online as well, <a href="https://mizrael.github.io/BlazorCanvas/BlazorCanvas.Example2/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">available here</a>.

The first thing to do is to update our <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example2/wwwroot/index.html" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">index.html</a> and add the code to handle window resizing:

<pre class="EnlighterJSRAW" data-enlighter-language="js" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">function gameLoop(timeStamp) {
     window.requestAnimationFrame(gameLoop);
    game.instance.invokeMethodAsync('GameLoop', timeStamp, 
        game.canvas.width, game.canvas.height);
}

function onResize() {
    if (!window.game.canvas)
        return;

    game.canvas.width = window.innerWidth;
    game.canvas.height = window.innerHeight;
}

window.initGame = (instance) => {
     var canvasContainer = document.getElementById('canvasContainer'),
    canvases = canvasContainer.getElementsByTagName('canvas') || [];
    window.game = {
                instance: instance,
                canvas: canvases.length ? canvases[0] : null
    };
            
    window.addEventListener("resize", onResize);
    onResize();

    window.requestAnimationFrame(gameLoop);
};</pre>

Few things going on here:

  1. we&#8217;re attaching a handler to the window _resize_ event
  2. in _onResize()_ we store the new window size
  3. we&#8217;ve updated the call to _GameLoop()_ to receive the new size

The next step is to update the Razor page. First we have to add the image to render:#

<pre class="EnlighterJSRAW" data-enlighter-language="html" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;img @ref="_spritesheet" hidden src="assets/blazor.png" /></pre>

The _hidden_ attribute is necessary to&#8230;well&#8230;hide the image, otherwise will be displayed right before the canvas.

Lastly, we have to update our GameLoop() function and render the sprite:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">@code
{
    ElementReference _spritesheet;

    [JSInvokable]
    public async ValueTask GameLoop(float timeStamp, int width, int height)
    {
        await _context.ClearRectAsync(0, 0, width, height);
        
        await _context.DrawImageAsync(_spritesheet, 0, 0, width/2, height/2);
    }
}</pre>

Since we now know the exact window size (and our canvas is set to fill 100%), we can pass the right parameters to _ClearRectAsync()_ . Then we can call _<a aria-label="undefined (opens in a new tab)" href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage" target="_blank" rel="noreferrer noopener">DrawImageAsync()</a>_ passing the sprite reference, position and size. 

<div class="wp-block-image">
  <figure class="aligncenter size-large"><a href="/assets/uploads/2020/07/image-1.png?ssl=1"><img loading="lazy" width="788" height="572" src="/assets/uploads/2020/07/image-1.png?resize=788%2C572&#038;ssl=1" alt="" class="wp-image-7423" srcset="/assets/uploads/2020/07/image-1.png?resize=1024%2C743&ssl=1 1024w, /assets/uploads/2020/07/image-1.png?resize=300%2C218&ssl=1 300w, /assets/uploads/2020/07/image-1.png?resize=768%2C557&ssl=1 768w, /assets/uploads/2020/07/image-1.png?resize=788%2C571&ssl=1 788w, /assets/uploads/2020/07/image-1.png?w=1106&ssl=1 1106w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a></figure>
</div>

Et voila! 

The <a href="https://www.davidguida.net/blazor-gamedev-part-4-moving-a-sprite/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">next time</a> we&#8217;ll see how to move this sprite on the screen. Bye!

<div class="post-details-footer-widgets">
</div>