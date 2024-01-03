---
description: >
  In this series of articles we will explore how to do 2d game development with Blazor using an HTML Canvas. All the code will be available on GitHub.
id: 7394
title: 'Blazor and 2D game development - part 1: intro'
date: 2020-07-01T23:23:24-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7394
permalink: /blazor-and-2d-game-development-part-1-intro/
dsq_thread_id:
  - "8105309710"
image: /assets/uploads/2020/07/blazor-2d-game-dev.jpg
categories:
  - .NET
  - 2D
  - Blazor
  - Gamedev
  - Programming
tags:
  - 2D
  - Blazor
  - Gamedev
---
Every now and then I go back to **game development**. It's literally what brought me into this world of coding, something like 32 years ago. This time I decided to do some experiments with **Blazor** and **2D graphics**.

I don't have a precise goal in mind right now, just playing around. 

Probably this late-night fever started when I wrote about <a href="https://www.davidguida.net/how-to-consume-dd-rest-api-over-grpc-web-blazor-part-1-the-client/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">D&D, Blazor and gRPC services</a>. 

#### For those interested, <a href="https://github.com/mizrael/BlazorCanvas" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">on GitHub</a> you can find a repository with all the examples I'll be able to come up with.

For now, I decided to proceed at incremental steps and write small features, one on top of the other. As of today, this is the current list:

  1. <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/tree/master/BlazorCanvas.Example1" target="_blank" rel="noreferrer noopener">Example 1</a> shows how to initialize the 2d canvas
  2. in <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/tree/master/BlazorCanvas.Example2" target="_blank" rel="noreferrer noopener">example 2</a> we see how to render a sprite and react to the window resize event
  3. <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/tree/master/BlazorCanvas.Example3" target="_blank" rel="noreferrer noopener">Example 3</a> shows how to move a sprite on the screen
  4. Then in <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/tree/master/BlazorCanvas.Example4" target="_blank" rel="noreferrer noopener">example 4</a>, we build on top of the previous one, refactoring and cleaning up the code
  5. <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/tree/master/BlazorCanvas.Example5" target="_blank" rel="noreferrer noopener">Example 5</a> shows how to handle mouse inputs
  6. <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/tree/master/BlazorCanvas.Example6" target="_blank" rel="noreferrer noopener">Example 6</a> shows how to animate a sprite. I downloaded the spritesheets from [here](https://luizmelo.itch.io/medieval-warrior-pack-2) and combined them using [a custom tool](https://github.com/mizrael/BlazorCanvas/tree/master/tools/AnimatedSpritesProcessor)

I will try to write an article for every example, it will also serve as reminder of my train of thought and how I managed to get the code in that shape.

As I wrote previously, I don't have a precise goal at the moment. I _might_ end up with something playable, although I tend to change idea quite often on this matter. As many of us, I can get distracted quite easily by new shiny toys. Or simply by life 🙂

The <a href="https://www.davidguida.net/blazor-gamedev-part-2-canvas-initialization/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">next time</a> we'll start by initializing the Canvas and rendering some text.



<div class="post-details-footer-widgets">
</div>