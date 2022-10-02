---
description: >
  Let's run a C# CHIP-8 emulator in a Blazor Webassembly application!
id: 8008
title: 'CHIP-8 emulation with C# and Blazor - part 2'
date: 2021-04-30T10:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8008
permalink: /chip8-emulator-csharp-net-core-blazor-part2/
image: /assets/uploads/2021/04/chip8-emulator-csharp-net-core-blazor-part2.jpg
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
  - Emulation
  - Retrogaming
  - Gamedev
---

Hi All and welcome back to the second article of the Series! <a href="/chip8-emulator-csharp-net-core-blazor-part1/" target="_blank">Last time</a> we talked a bit about CHIP-8 and saw how easy it is to write a fully functional emulator in C#.

Today we'll start from there and integrate the code in a **Blazor Webassembly** application. So we can run our *favourite* games in our browser! Isn't that awesome? Yeah!

Before we go down the rabbit hole, you might want to take a look at my <a href="/blazor-and-2d-game-development-part-1-intro/" target="_blank">previous articles</a> about Blazor and gamedev. Why? Well, simply because we're going to use an HTML Canvas to render our CHIP-8 screen. 

### So if you don't know already how to use it, <a href="/blazor-gamedev-part-2-canvas-initialization/" target="_blank">here</a> you can find a nice tutorial I've put up for you. 

Now, in our page all we need is literally this:

```html
<div id="main-canvas-container" class="canvas-container">
    <BECanvas Width="@_canvasWidth" Height="@_canvasHeight" @ref="_canvasReference"></BECanvas>
</div>
```

It's basically just the canvas definition, along with some helpful properties (width, height and the ref).

In our C# code instead, things are a little bit trickier, so let's go step by step. 
We can start by initializing the CPU and some other utilities:

```csharp
@code{
  Core.Cpu _cpu;
  Core.IRenderer _renderer;
  System.Timers.Timer _cpuTickTimer;
  bool[,] _currFrame;
  
  protected override void OnInitialized()
  {
        _renderer = new Chip8Emulator.Core.LambdaRenderer(async data => await UpdateFrame(data), async()=> await RenderFrame());
        
        _cpu = new Core.Cpu(_renderer, new Chip8Emulator.Core.DefaultSoundPlayer());
        
        _cpuTickTimer = new System.Timers.Timer();
        _cpuTickTimer.Elapsed += (s, e) =>
        {
            _cpu.Tick();
        };
    }
}
```

The `LambdaRenderer` is a nice handy <a href="https://github.com/mizrael/chip8-emulator/blob/main/Chip8Emulator.Core/LambdaRenderer.cs" target="_blank">class</a> that holds two delegates, one responsible for updating the framebuffer and another one for rendering it on screen.
We'll see the method implementations in a moment. 

The `_currFrame` array holds...well...the current frame. Just that. It's basically a matrix where each cell represents a pixel on the screen. And of course, since we're using colours, booleans are just enough.

The `Timer` instance is instead necessary in order to get full control of the CPU clock speed. This way we can completely decouple it from the Canvas update/render loop.

Speaking of which, its code is actually pretty simple:

```csharp
[JSInvokable]
public async ValueTask GameLoop(int width, int height)
{
  _canvasWidth = width;
  _canvasHeight = height;
  _renderer.Render();
}
```
Let's not forget the `[JSInvokable]` attribute, or we won't be able to see anything on the screen. Why? Well, you would know if you went through my Blazor gamedev posts!

We're also making sure to store the current canvas size, we'll need that to compute the size of our pixels.

Now let's take a look at the actual rendering code. The first thing we have to do is getting a hold of the current frame, which we can easily do in the `UpdateFrame()` method:

```csharp
private async Task UpdateFrame(bool[,] data)
{
  _currFrame = data;
}
```
This method will be called directly by our emulated CPU, as a consequence of the `0xD` opcode.

Once we have a hold on our frame, we can display it on the screen:
```csharp
private async Task RenderFrame()
{
    await _canvasContext.ClearRectAsync(0, 0, _canvasWidth, _canvasHeight);
    
    var pixelWidth = _canvasWidth / Chip8Emulator.Core.Cpu.SCREEN_WIDTH;
    var pixelHeight = _canvasHeight / Chip8Emulator.Core.Cpu.SCREEN_HEIGHT;

    for (int col = 0; col != Chip8Emulator.Core.Cpu.SCREEN_WIDTH; col++)
      for (int row = 0; row != Chip8Emulator.Core.Cpu.SCREEN_HEIGHT; row++)
      {
          if (!_currFrame[col, row])
              continue;
          await _canvasContext.FillRectAsync(col * pixelWidth, row * pixelHeight, pixelWidth, pixelHeight);
      }
}
```
Here we start by erasing the screen, then we loop over the pixels matrix and for each active one we draw a green rectangle.

And guess what, it actually works!

...also guess what, it's **incredibly** slow! So how can we do better? **Can** we actually do better? We'll find out in <a href="/chip8-emulator-csharp-net-core-blazor-part3/" target="_blank">the next article</a>!