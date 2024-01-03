---
description: >
  I leveraged MonoGame and some nasty old-style tricks to finally render some pixels on the screen with my 8080 Space Invaders emulator.
id: 6788
title: 'Back to the &#8217;74 with a 8080 emulator &#8211; part 2: rendering'
date: 2019-09-26T09:30:01-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6788
permalink: /back-to-the-74-with-a-8080-emulator-part-2-rendering/
image: /assets/uploads/2019/09/8080_emulator_part_2.png
categories:
  - .NET
  - Programming
tags:
  - .NET Core
  - programming
---
And finally I got something working! Took me a bit of searching and head scratching, but at the end I managed to get some pixels on the screen 🙂

<div class="wp-block-image">
  <figure class="aligncenter"><img src="https://i2.wp.com/raw.githubusercontent.com/mizrael/8080-emulator-net/master/screenshots/space_invaders1.png?w=788&#038;ssl=1" alt="" data-recalc-dims="1" /><figcaption>finally!</figcaption></figure>
</div>

If you remember <a rel="noreferrer noopener" aria-label="my last post (opens in a new tab)" href="https://www.davidguida.net/back-to-the-74-with-a-8080-emulator-part-1/" target="_blank">my last post</a>, we discussed a bit about emulators and why I started this project. The Intel 8080 is a quite easy platform to emulate and honestly, also a very interesting programming exercise.

#### I managed to quickly implement the first 50 opcodes, which cover more or less 45k instructions of the original <a rel="noreferrer noopener" aria-label="Space Invaders (opens in a new tab)" href="http://computerarcheology.com/Arcade/SpaceInvaders/Code.html" target="_blank">Space Invaders</a>.

But just looking at registers dump in the console is not very appealing, at least <a href="https://matrix.fandom.com/wiki/Link" target="_blank" rel="noreferrer noopener" aria-label="not for me (opens in a new tab)">not for me</a>. So once I made sure the implementation was running fine, I started working on the rendering part.

Now, Space Invaders has an interesting mechanism for displaying pixels on the screen. The video hardware generates 2 interrupts at a fixed time, each at 60Hz. This means that each interrupt occurs 60 times per second, which is approximately 16ms.

When an interrupt occurs, normally the current Program Counter is PUSHed into the stack and then is replaced with a low memory location. This location most of the times contains a CALL (or RST) to some routine. After that the Program Counter is reset to its initial value stored in the stack.

As I previously wrote, there are 2 video interrupts, each one handling half of the screen. This was done at the time to achieve smoother animations: when one of these interrupt occurs, half of the framebuffer gets updated, while the other one can be safely rendered. 

#### As you can imagine, updating the entire framebuffer and rendering it at the same time would have caused lots of performance problems plus other issues I guess.

For this project I&#8217;m using <a rel="noreferrer noopener" aria-label="MonoGame (opens in a new tab)" href="http://www.monogame.net/" target="_blank">MonoGame</a> to handle the grunt work for window creation and 2d rendering. I used XNA a lot during its glory days so the setup for me was a no-brainer.

<a rel="noreferrer noopener" aria-label="Code for now (opens in a new tab)" href="https://github.com/mizrael/8080-emulator-net/blob/c22813ebed94da7a73706976cc69cb516a243992/emu8080.Game/Game1.cs" target="_blank">Code for now</a> is very easy and doesn&#8217;t fully handle all the cases. If the interrupts are enabled (via the 0xfb EI opcode), it is triggering the two interrupts every 16ms in the Update() method. 

Once the CPU has completed its job, the framebuffer is copied to a texture and rendered on the screen. I&#8217;m not handling the half-screen update discussed before, and I&#8217;m not sure if I&#8217;m going to ever implement it.

There&#8217;s still a lot to do of course, but the results are encouraging 🙂

<div class="post-details-footer-widgets">
</div>