---
description: >
  I decided to take a walk down memory lane, precisely back to '74, with my first 8080 emulator in C# and .NET Core. Let's shoot some Space Invaders!
id: 6774
title: 'Back to the &#8217;74 with a 8080 emulator &#8211; part 1'
date: 2019-09-24T10:47:45-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6774
permalink: /back-to-the-74-with-a-8080-emulator-part-1/
image: /assets/uploads/2019/09/8080_emulator.jpg
categories:
  - .NET
  - Programming
tags:
  - .NET Core
  - programming
---
I decided to take a walk down memory lane, precisely back to &#8217;74. I named my horse 8080, like <a rel="noreferrer noopener" aria-label="the planet (opens in a new tab)" href="https://en.wikipedia.org/wiki/List_of_minor_planets:_8001%E2%80%939000#080" target="_blank">the planet</a> .

#### Well, actually it&#8217;s not a horse but an emulator, my first emulator ever 🙂

It all started when I saw <a rel="noreferrer noopener" aria-label="this article (opens in a new tab)" href="https://www.hanselman.com/blog/EmulatingAPlayStation1PSXEntirelyWithCAndNET.aspx" target="_blank">this article</a> on Scott Hanselmann&#8217;s blog, about this very smart guy who&#8217;s trying to emulate a PSX with C# and .NET.

I never wrote an emulator before and honestly, I had no clue how these things work. A PSX might be a little out of my league right now so I started digging a bit, looking for something very simple.

Apparently, the **<a href="https://en.wikipedia.org/wiki/Intel_8080" target="_blank" rel="noreferrer noopener" aria-label=" (opens in a new tab)">Intel 8080</a>** is the perfect learning platform.<figure class="wp-block-image is-resized">

<a href="https://en.wikipedia.org/wiki/Intel_8080" target="_blank" rel="noreferrer noopener"><img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/KL_Intel_i8080_Black_Background.jpg/800px-KL_Intel_i8080_Black_Background.jpg" alt="the Intel 8080 processor, image courtesy of Wikipedia" width="640" height="332" /></a><figcaption>the Intel 8080 processor, image courtesy of Wikipedia</figcaption></figure> 

The 8080 architecture is relatively simple, 8-bit for basically everything, running at 2MHz.

#### It had a widespread use since its early days, but in 1978 it became the pivot of one of the first arcade, <a rel="noreferrer noopener" aria-label="Space Invaders (opens in a new tab)" href="https://en.wikipedia.org/wiki/Space_Invaders" target="_blank">Space Invaders</a>!

I guess everyone knows **Space Invaders**, so probably no introduction is needed.

On GitHub there&#8217;s a lot of **8080** emulators, mainly in C, but there&#8217;s also something in C# or <a rel="noreferrer noopener" aria-label="Rust  (opens in a new tab)" href="https://github.com/XAMPPRocky/i8080" target="_blank">Rust </a>as well.

I&#8217;m coding mainly in C# these days, and honestly for my first tentative, I didn&#8217;t wanted to move to another programming language. My goal was to get a decent understanding of how emulators are coded. Also, bringing back from the ol&#8217; college days binary/hex math and bitwise operations is always a good idea.

Obviously I didn&#8217;t wanted to just clone an existing emulator. So I started looking online for references about the **8080** and **Space Invaders** in general and eventually I found <a rel="noreferrer noopener" aria-label="this website (opens in a new tab)" href="http://www.emulator101.com/" target="_blank">this website</a>.It&#8217;s full of resources and complete tutorials about the 8080 emulation. It helped **a lot** . 

So after a week of tinkering and debugging, I managed to write an initial prototype. As of now is not rendering anything, just processing the first **45k instructions** and displaying the CPU state.

How am I testing it? Well, internet is full of crazy people. Apparently someone wrote <a rel="noreferrer noopener" aria-label="another 8080 in javascript (opens in a new tab)" href="https://bluishcoder.co.nz/js8080/" target="_blank">another 8080 in javascript</a>, but this is more like a debugging tool. I used this one to assert that I was implementing the OPs correctly and the CPU was always in the right state.

All the code is <a rel="noreferrer noopener" aria-label="available as usual (opens in a new tab)" href="https://github.com/mizrael/8080-emulator-net" target="_blank">available as usual</a> on Github. I&#8217;m not focusing on clean code right now. And (dear God forgive me) I&#8217;m not doing TDD. 

I&#8217;ll make sure to refactor it once I get to see some **real** results on the screen, for now I just want to make sure all the <a href="http://www.emulator101.com/finishing-the-cpu-emulator.html" target="_blank" rel="noreferrer noopener" aria-label="50 Space Invaders ops (opens in a new tab)">50 Space Invaders ops</a> are implemented correctly.

Next step is to render something 🙂

<div class="post-details-footer-widgets">
</div>