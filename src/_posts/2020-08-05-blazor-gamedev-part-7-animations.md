---
description: >
  Hi my fellow gamedevs!For part 7 of our Blazor 2d Gamedev series we'll step into the marvelous world of animations using spritesheets!
id: 7509
title: 'Blazor GameDev - part 7: animations'
date: 2020-08-05T22:27:47-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7509
permalink: /blazor-gamedev-part-7-animations/
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
  - "8154864493"
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
Hi my fellow gamedevs! Welcome back to part 7 of our **Blazor 2d Gamedev** series. Today we're going to step into the marvelous world of animations using spritesheets 🙂

<a href="https://www.davidguida.net/blazor-gamedev-part-6-mouse-input/" target="_blank" rel="noreferrer noopener">Last time</a> we saw how it's possible to interact with the game using the mouse. It was fun and easy, but still, all we were rendering was _just_ the Blazor logo. Nice, but not that fancy. Let's take the game to another level and render something more interesting.

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://i0.wp.com/im4.ezgif.com/tmp/ezgif-4-60e4f4d7c5a3.gif?w=788&#038;ssl=1" alt="" data-recalc-dims="1" /></figure>
</div>

Nice, isn't it? You can see it <a href="https://mizrael.github.io/BlazorCanvas/BlazorCanvas.Example6/" target="_blank" rel="noreferrer noopener">in your browser here</a>. 

Of course, like many of you, I can barely hold a pen, let alone draw something. I downloaded&nbsp;<a rel="noreferrer noopener" target="_blank" href="https://luizmelo.itch.io/medieval-warrior-pack-2">the sprites here</a>&nbsp;and&nbsp;combined&nbsp;them using&nbsp;<a rel="noreferrer noopener" target="_blank" href="https://github.com/mizrael/BlazorCanvas/tree/master//tools/AnimatedSpritesProcessor">a&nbsp;custom&nbsp;tool</a> that I wrote. This tool will take a list of sprite sheets as input and generate a single JSON file that looks like this:

<pre class="EnlighterJSRAW" data-enlighter-language="json" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">{
  "version": 1,
  "name": "warrior",
  "animations": [
      {
          "name": "Attack1",
          "imageData": "iVBORw0KGgoAAAANSUhEUgAAAAAAABJRU5ErkJggg==",
          "imageMeta": {
              "height": 150,
              "width": 600,
              "type": "png"
          },
          "frameSize": {
              "width": 150,
              "height": 150
          },
          "fps": 12
      }
    ]
}</pre>

#### The _animations_ array, as you might have guessed, contains a list of animations (eg. each single spritesheets) along with some metadata like the size of each frame, FPS, and so on. The image data is encoded as base 64.

The first step is to create a Razor component that loads this nice JSON file and builds a data structure we can later on utilize. It's basically just boring parsing boilerplate code, but if you're interested, you can <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example6/Shared/Spritesheet.razor" target="_blank" rel="noreferrer noopener">see it here</a>.

At this point, once we have our animations in memory, all we have to do is build a Component that can loop over the frames and render them:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class AnimatedSpriteRenderComponent 
{
        private int _currFrameIndex = 0;
        private int _currFramePosX = 0;
        private float _lastUpdate = 0f;

        public async ValueTask Render(GameContext game, Canvas2DContext context)
        {
            if (game.GameTime.TotalTime - _lastUpdate > 1000f / Animation.Fps)
            {
                ++_currFrameIndex;
                _lastUpdate = game.GameTime.TotalTime;
                _currFramePosX = (_currFrameIndex % Animation.FramesCount) * Animation.FrameSize.Width;
            }

            await context.DrawImageAsync(Animation.ImageRef, _currFramePosX, 0,
                Animation.FrameSize.Width, Animation.FrameSize.Height,
                _transform.Position.X, _transform.Position.Y,
                Animation.FrameSize.Width, Animation.FrameSize.Height);
        }

        public AnimationsSet.Animation Animation { get; set; }
}</pre>

Some code has been omitted for brevity, the full class <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example6/Core/Components/AnimatedSpriteRenderComponent.cs" target="_blank" rel="noreferrer noopener">is available here</a>. So what we do here is quite simple:

  1. initialize the class with some base state (eg. the current frame index and its position in the spritesheet)
  2. at every update step we check if enough time has passed and if so, we update the frame index
  3. call <a href="https://www.w3schools.com/tags/canvas_drawimage.asp" target="_blank" rel="noreferrer noopener">DrawImageAsync </a>specifying a window over the spritesheet, basically selecting only the frame we want to render.

In this super-duper renderer we're assuming that the frames are all on the same row:

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img loading="lazy" width="788" height="99" src="/assets/uploads/2020/08/image-1.png?resize=788%2C99&#038;ssl=1" alt="" class="wp-image-7514" srcset="/assets/uploads/2020/08/image-1.png?resize=1024%2C128&ssl=1 1024w, /assets/uploads/2020/08/image-1.png?resize=300%2C38&ssl=1 300w, /assets/uploads/2020/08/image-1.png?resize=768%2C96&ssl=1 768w, /assets/uploads/2020/08/image-1.png?w=1200&ssl=1 1200w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></figure>
</div>

Enough for the day. <a href="https://www.davidguida.net/blazor-gamedev-part-8-keyboard-control-animations/" target="_blank" rel="noreferrer noopener">Next time</a> we'll see how to switch between animations using the keyboard. Ciao!

<div class="post-details-footer-widgets">
</div>