---
description: >
  Welcome back to part 4 of our Blazor 2d Gamedev series.Today we're going to refactor the code of part 3 and start moving the sprite across the screen.
id: 7429
title: 'Blazor GameDev - part 4: moving a sprite'
date: 2020-07-14T16:37:12-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7429
permalink: /blazor-gamedev-part-4-moving-a-sprite/
image: /assets/uploads/2020/07/blazor-2d-game-dev.jpg
categories:
  - .NET
  - ASP.NET
  - Blazor
  - Gamedev
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
  - Gamedev
---
Hi All! Welcome back to part 4 of our **Blazor 2d Gamedev** series. Today we're going to refactor the code of <a aria-label="undefined (opens in a new tab)" href="https://www.davidguida.net/blazor-gamedev-part-3-sprite-rendering/" target="_blank" rel="noreferrer noopener">part 3</a> and start moving the sprite across the screen.

The final result will be something like this:<figure class="wp-block-image size-large">

[<img loading="lazy" width="778" height="546" src="/assets/uploads/2020/07/blazor-gamedev-example3.gif?resize=778%2C546&#038;ssl=1" alt="" class="wp-image-7434" data-recalc-dims="1" />](/assets/uploads/2020/07/blazor-gamedev-example3.gif?ssl=1)</figure> 

<a aria-label="undefined (opens in a new tab)" href="https://mizrael.github.io/BlazorCanvas/BlazorCanvas.Example3/" target="_blank" rel="noreferrer noopener">Example 3</a> and 4 will render exactly the same thing but in <a aria-label="undefined (opens in a new tab)" href="https://mizrael.github.io/BlazorCanvas/BlazorCanvas.Example4/" target="_blank" rel="noreferrer noopener">Example 4</a> we'll start refactoring a bit the code and move away from the procedural style. But let's do one step at a time. For now, we're going to focus on Example 3.

So, the first thing that we want to do is to start storing the basic information of our Sprite somewhere:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class Sprite
{
        public Size Size { get; set; }
        public ElementReference SpriteSheet { get; set; }
}</pre>

The next step will be to keep track of **where** our Sprite instance is (_position_), **what it is looking at** (_direction_) and how fast it is moving (_speed_). For now, we're going to store all this info in our <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example3/Pages/Index.razor" target="_blank" rel="noreferrer noopener">Index.razor</a> :

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">Point _spritePosition = Point.Empty;
Point _spriteDirection = new Point(1, 1);
float _spriteSpeed = 0.25f;

[JSInvokable]
public async ValueTask GameLoop(float timeStamp, int screenWidth, int screenHeight)
{
        _gameTime.TotalTime = timeStamp;

        await Update(screenWidth, screenHeight);
        await Render(screenWidth, screenHeight);
}

private async ValueTask Update(int screenWidth, int screenHeight)
{
        if (_spritePosition.X + _sprite.Size.Width >= screenWidth || _spritePosition.X &lt; 0)
            _spriteDirection.X = -_spriteDirection.X;

        if (_spritePosition.Y +  _sprite.Size.Height >= screenHeight || _spritePosition.Y &lt; 0)
            _spriteDirection.Y = -_spriteDirection.Y;

        _spritePosition.X += (int)(_spriteDirection.X * _spriteSpeed * _gameTime.ElapsedTime);
        _spritePosition.Y += (int)(_spriteDirection.Y * _spriteSpeed * _gameTime.ElapsedTime);
}</pre>

As you may have noticed, I have decided to split our _GameLoop()_ function into two separate methods, _Update()_ and _Render()_. 

#### Eventually, we're going to use separate data structures to hold our entities, but we'll see this in another post.

The logic in _Update()_ is pretty straightforward: every time we hit the screen bounds, we just invert the direction. Easy peasy.

The last step is of course our _Render()_ method:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">private async ValueTask Render(int width, int height)
{
        await _context.ClearRectAsync(0, 0, width, height);
        await _context.DrawImageAsync(_sprite.SpriteSheet, _spritePosition.X, _spritePosition.Y, _sprite.Size.Width,  _sprite.Size.Height);
}</pre>

This is quite similar to how we were rendering the sprite last time, the only difference is that here we're providing the proper position to _DrawImageAsync()_.

That's all for now. <a href="https://www.davidguida.net/blazor-gamedev-part-5-composition/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">Next time</a> we're going to introduce our new best friend: the GameObject!

<div class="post-details-footer-widgets">
</div>