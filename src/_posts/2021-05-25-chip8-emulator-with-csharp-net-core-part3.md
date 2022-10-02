---
description: >
  In this post we'll continue our C# Blazor Webassembly CHIP-8 emulator and optimize the rendering code.
id: 8011
title: 'CHIP-8 emulation with C# and Blazor - part 3'
date: 2021-05-25T10:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8011
permalink: /chip8-emulator-csharp-net-core-blazor-part3/
image: /assets/uploads/2021/05/chip8-emulator-csharp-net-core-blazor-part3.jpg
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
  - Emulation
  - Retrogaming
  - Gamedev
---
Hi All and welcome back to the third article of our CHIP-8 Emulation Series! <a  href="/chip8-emulator-csharp-net-core-blazor-part2/"  target="_blank">Last time</a> we started writing a functional CHIP-8 emulator using **Blazor Webassembly**.

We saw how we can hook up the rendering using an HTML Canvas in Blazor, but we quickly realized that it was not exactly super fast.

The main reason behind it is that we're updating the Canvas data at each call to `RenderFrame()`. And that's expensive. 
### What if we can do it in the `UpdateFrame()` method instead? Well, turns out we can, more or less.

We are going to use a "double-buffering" technique, and for it we'll create 2 separate Canvases, one "on-screen" and another one "off-screen". 
The latter will hold the actual frame, and will be updated at each call to `UpdateFrame()`. If you remember from our last article, this method will be called directly by our emulated CPU, each time it receives the `0xD` opcode. This does happen with a way lower frequency than our screen refresh (eg. `RenderFrame()`), allowing us to achieve an higher frame-rate.

Let's take a look at the code:

```html
<div id="main-canvas-container" class="canvas-container">
    <BECanvas Width="@_canvasWidth" Height="@_canvasHeight" @ref="_canvasReference"></BECanvas>
</div>

<div class="canvas-container">
    <BECanvas Width="@_canvasWidth" Height="@_canvasHeight" @ref="_offscreenCanvasReference"></BECanvas>
</div>
```
We'll start off by defining the two canvases. We'll also use CSS to make sure that only `main-canvas-container` is visible on the screen.

Now let's work a bit on our `UpdateFrame()` method :

```csharp
private async Task UpdateFrame(bool[,] data){
    _currFrame = data;

    var spriteWidth = _canvasWidth / Chip8Emulator.Core.Cpu.SCREEN_WIDTH;
    var spriteHeight = _canvasHeight / Chip8Emulator.Core.Cpu.SCREEN_HEIGHT;
	
	await _offscreenCanvasContext.ClearRectAsync(0, 0, _canvasWidth, _canvasHeight);
    await _offscreenCanvasContext.BeginBatchAsync();
    await _offscreenCanvasContext.SetFillStyleAsync("green");

    for (int col = 0; col != Chip8Emulator.Core.Cpu.SCREEN_WIDTH; col++)
        for (int row = 0; row != Chip8Emulator.Core.Cpu.SCREEN_HEIGHT; row++)
        {
            if (!_currFrame[col, row])
                continue;
            await _offscreenCanvasContext.FillRectAsync(col * spriteWidth, row* spriteHeight, spriteWidth, spriteHeight);
        }

    await _offscreenCanvasContext.EndBatchAsync();
}
```
As you might have noticed, it's more or less the same code we had in our previous implementation of `RenderFrame()`, but this time we're running the commands on `_offscreenCanvasContext`instead.

At this point, `RenderFrame()` is way more simple:

```csharp
private async Task RenderFrame()
{
    await _outputCanvasContext.ClearRectAsync(0, 0, _canvasWidth, _canvasHeight);
    await _outputCanvasContext.DrawImageAsync(_offscreenCanvasContext.Canvas, 0, 0);
}
```

As you can see, it's reduced to a simple call to `DrawImageAsync()`, using the pre-built image data from `_offscreenCanvasContext`.

That's all for today! And if you haven't done it yet, don't forget to take a look at <a href="https://github.com/mizrael/chip8-emulator" target="_blank">the GitHub repository</a> and the <a href="https://mizrael.github.io/chip8-emulator/" target="_blank">the demo</a>!

