---
description: >
  Hi All! Welcome back to part 6 of our Blazor 2d Gamedev series. Today we'll see how we can start detecting user interaction and mouse input.
id: 7487
title: 'Blazor GameDev &#8211; part 6: mouse input'
date: 2020-07-31T10:31:42-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7487
permalink: /blazor-gamedev-part-6-mouse-input/
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
Hi All! Welcome back to part 6 of our **Blazor 2d Gamedev** series. Today we&#8217;ll see how we can start detecting user interaction and mouse input.

<a aria-label="undefined (opens in a new tab)" href="https://www.davidguida.net/blazor-gamedev-part-5-composition/" target="_blank" rel="noreferrer noopener">Last time</a> we started the _real_ refactoring towards a more reusable structure and introduced the concept of **composition** through the <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example5/Core/GameObject.cs" target="_blank" rel="noreferrer noopener">GameObject </a>class.

The goal for today&#8217;s exercise is to be able to detect when the mouse cursor is over the **Blazor** logo and stop it when the left button is clicked. 

Take your time, <a aria-label="undefined (opens in a new tab)" href="https://mizrael.github.io/BlazorCanvas/BlazorCanvas.Example5/" target="_blank" rel="noreferrer noopener">check the example</a>, I&#8217;ll wait.

Done? OK. So, the first step is to update <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example5/wwwroot/index.html" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">index.html</a> and register few callbacks:

<pre class="EnlighterJSRAW" data-enlighter-language="js" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">window.initGame = (instance) => {
    // some init code here...
    if (window.game.canvas) {
        window.game.canvas.onmousemove = (e) => {
            game.instance.invokeMethodAsync('OnMouseMove', e.clientX, e.clientY);
        };
        window.game.canvas.onmousedown = (e) => {
            game.instance.invokeMethodAsync('OnMouseDown', e.button);
        };
        window.game.canvas.onmouseup = (e) => {
            game.instance.invokeMethodAsync('OnMouseUp', e.button);
        };
    }
    // some more init code here...
};</pre>

We&#8217;ll be using the same method we use for <a aria-label="undefined (opens in a new tab)" href="https://www.davidguida.net/blazor-gamedev-part-2-canvas-initialization/" target="_blank" rel="noreferrer noopener">our render loop</a> to invoke C# methods, passing the mouse position or the id of the clicked button. Let&#8217;s add them to <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example5/Pages/Index.razor" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">Index.razor</a> :

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">[JSInvokable]
public async ValueTask OnMouseMove(int mouseX, int mouseY)
{
    InputSystem.Instance.MouseCoords.X = mouseX;
    InputSystem.Instance.MouseCoords.Y = mouseY;
}

[JSInvokable]
public async ValueTask OnMouseDown(MouseButtons button)
{
    InputSystem.Instance.SetButtonState(button, ButtonStates.Down);
}

[JSInvokable]
public async ValueTask OnMouseUp(MouseButtons button)
{
    InputSystem.Instance.SetButtonState(button, ButtonStates.Up);
}</pre>

We&#8217;re almost there. Now we have to define the <a aria-label="undefined (opens in a new tab)" rel="noreferrer noopener" target="_blank" href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example5/Core/InputSystem.cs">InputSystem class</a>. It&#8217;s &#8220;only&#8221; purpose will be to keep track of the state of our input peripherals (for now just the mouse) and expose a get operation. 

At the bare minimum should look something like this:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class InputSystem
{
    public Point MouseCoords;
    public static InputSystem Instance;
    
    public void SetButtonState(MouseButtons button, ButtonStates state) ;
    public ButtonStates GetButtonState(MouseButtons button);
}</pre>

The last step now is to update the <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example5/LogoBrain.cs" target="_blank" rel="noreferrer noopener">&#8220;brain&#8221; component</a> of the Blazor logo and handle the input:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public override async ValueTask Update(GameContext game)
{
    var isOver = _transform.BoundingBox.Contains(InputSystem.Instance.MouseCoords);

    _renderComponent.DrawBoundingBox = isOver;

     _speed = InputSystem.Instance.GetButtonState(MouseButtons.Left) == ButtonStates.Down && (isOver || _speed == 0f)
                ? 0
                : DefaultSpeed;
}</pre>

We&#8217;ll simply render a <a aria-label="undefined (opens in a new tab)" href="https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection" target="_blank" rel="noreferrer noopener">bounding box</a> if the mouse is hovering our logo and zero out the speed if we&#8217;re clicking. 

That&#8217;s all for today! <a href="https://www.davidguida.net/blazor-gamedev-part-7-animations/" target="_blank" rel="noreferrer noopener">Next time </a>we&#8217;ll see how we can display some nice animations using spritesheets. Stay tuned!

<div class="post-details-footer-widgets">
</div>