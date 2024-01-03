---
description: >
  Do you know what a cellular automaton is? Then let's find it out and how we can quickly implement Conway's Game of Life using Blazor and .NET Core!
id: 7204
title: 'Conway's Game of Life with Blazor'
date: 2020-05-18T01:00:00-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7204
permalink: /conways-game-of-life-with-blazor/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/05/Conway-game-of-life-blazor.png
categories:
  - .NET
  - Blazor
  - Programming
tags:
  - .NET
  - .NET Core
  - Blazor
---
Hi All! In this article, we're going to see an easy way to implement <a rel="noreferrer noopener" href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">Conway's Game of Life</a> using <a rel="noreferrer noopener" href="https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor" target="_blank"><strong>Blazor</strong></a>.

I've been spending some time these days working with Blazor. It's quite an interesting technology, and definitely an excellent alternative to Angular or React or WhateverFancyLibraryJs kids are using these days. 

Blazor's has a lot of nice features and there are few good reasons why could be a good technology to adapt:

  * model classes can be shared between client and server. No need to write them twice
  * very low learning curve (if you know already .NET and possibly a bit of Razor)
  * it's an open source project, there's a big community and the documentation is growing as we speak

I'm using it for one of my personal night-time projects and frankly, I'm quite happy. It's easy to use, performances are good and there's a nice support for DI, which makes code a lot cleaner.

Moreover, the fact that I can keep my entire codebase in C#, makes me way more comfortable and speeds up the development.

#### Anyways, a few days ago I learned (a bit late, yes) that **John Conway** passed away from COVID-19 complications. 

For those who don't know, Conway was one of the most famous mathematicians, active in fields like number theory and combinatorial game theory. 

He was also the inventor of a lot of funny math riddles, like the <a rel="noreferrer noopener" href="https://wordplay.blogs.nytimes.com/2015/08/10/feiveson-1/" target="_blank">Wizard's age puzzle</a>, and the famous cellular automaton **Game of Life**. 

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Gospers_glider_gun.gif" alt="" /><figcaption>Game of Life - courtesy of Wikipedia</figcaption></figure>
</div>

It's an interesting simulation, with incredibly simple rules. Straight from Wikipedia:

<pre class="wp-block-preformatted">Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

- Any live cell with fewer than two live neighbours dies, as if by underpopulation.
- Any live cell with two or three live neighbours lives on to the next generation.
- Any live cell with more than three live neighbours dies, as if by overpopulation.
- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</pre>

It's not super complex to code and it's a good exercise for those interested in 2D graphics. It's actually one of the first things I coded for Windows Phone, replying to an <a rel="noreferrer noopener" href="http://www.shawnhargreaves.com/blog/is-spritebatch-turing-complete.html" target="_blank">article by Shawn Hargreaves</a> in 2012 (phew!).

The code is as usual available on <a rel="noreferrer noopener" href="https://github.com/mizrael/ConwayBlazor" target="_blank">GitHub</a>. The gist of it is in the <a rel="noreferrer noopener" href="https://github.com/mizrael/ConwayBlazor/blob/master/ConwayBlazor/Models/World.cs" target="_blank">World</a> class.

The idea is to initialize two grids of booleans and swap them at each iteration. The current grid holds the state that will be used for rendering. Each update step will loop over the cells and compute the new state based on its neighbours. This will then set as the new value in the corresponding cell of the other grid.

And voilà, our simulation is complete!

<div class="post-details-footer-widgets">
</div>