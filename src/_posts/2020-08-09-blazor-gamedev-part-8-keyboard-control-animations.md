---
description: >
  Welcome back to part 8 of our Blazor 2d gamedev series. Today we'll see how to detect keyboard input to control character animations.
id: 7522
title: 'Blazor GameDev - part 8: keyboard input'
date: 2020-08-09T18:02:57-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7522
permalink: /blazor-gamedev-part-8-keyboard-control-animations/
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
  - Blazor
  - Gamedev
---
Hi everyone! Welcome back to part 8 of our **Blazor 2d Gamedev** series. Today we're going to refactor our last example, detecting keyboard input to control character animations.

<a href="https://www.davidguida.net/blazor-gamedev-part-7-animations/" target="_blank" rel="noreferrer noopener">Last time</a> we saw how to load spritesheets and introduced the **<a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example6/Core/Components/AnimatedSpriteRenderComponent.cs" target="_blank" rel="noreferrer noopener">AnimatedSpriteRenderComponent </a>**component. Let's now see how we can use the keyboard to switch between animations. The results will look more or less like this:

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img loading="lazy" width="212" height="164" src="/assets/uploads/2020/08/blazor-canvas-example7-keyboard-animation-control.gif?resize=212%2C164&#038;ssl=1" alt="" class="wp-image-7617" data-recalc-dims="1" /></figure>
</div>

You can check it out <a href="https://mizrael.github.io/BlazorCanvas/BlazorCanvas.Example7/" target="_blank" rel="noreferrer noopener">in your browser here</a>. Use left/right arrows to control the player.

So let's start. The first step, as we did in <a href="https://www.davidguida.net/blazor-gamedev-part-6-mouse-input/" target="_blank" rel="noreferrer noopener">Example 6</a>, is to update our <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example7/wwwroot/index.html" target="_blank" rel="noreferrer noopener">index.html </a>and add the listeners for keyboard events down/up:

<pre class="EnlighterJSRAW" data-enlighter-language="js" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">window.game.canvas.onkeydown = (e) => {
    game.instance.invokeMethodAsync('OnKeyDown', e.keyCode);
};
window.game.canvas.onkeyup = (e) => {
    game.instance.invokeMethodAsync('OnKeyUp', e.keyCode);
};</pre>

The callbacks will forward the payload to C# methods in our Index.razor:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">[JSInvokable]
public async ValueTask OnKeyDown(int keyCode) => InputSystem.Instance.SetKeyState((Keys)keyCode,ButtonState.States.Down);

[JSInvokable]
public async ValueTask OnKeyUp(int keyCode) => InputSystem.Instance.SetKeyState((Keys)keyCode,ButtonState.States.Up);</pre>

Then we have to update the <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example7/Core/InputSystem.cs" target="_blank" rel="noreferrer noopener">InputSystem </a>to handle keyboard input as well, same way we did for mouse:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class InputSystem
{
    public void SetKeyState(Keys key, ButtonState.States state)
    {
            var oldState = _keyboardStates[key];
            _keyboardStates[key] = new ButtonState(state, oldState.State == ButtonState.States.Down);
    }

    public ButtonState GetKeyState(Keys key) => _keyboardStates[key];
}</pre>

We're almost done. This time we're going to give our character a <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example7/CharacterBrain.cs" target="_blank" rel="noreferrer noopener">"bigger" brain:</a>

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class CharacterBrain : BaseComponent
{
    private readonly Transform _transform;
    private readonly AnimatedSpriteRenderComponent _animationComponent;
    private readonly AnimationsSet _animationsSet;

    public override async ValueTask Update(GameContext game)
    {
            var right = InputSystem.Instance.GetKeyState(Keys.Right);
            var left = InputSystem.Instance.GetKeyState(Keys.Left);

            if (right.State == ButtonState.States.Down)
            {
                _transform.Direction = Vector2.UnitX;
                _animationComponent.Animation = _animationsSet.GetAnimation("Run");
            }
            else if (left.State == ButtonState.States.Down)
            {
                _transform.Direction = -Vector2.UnitX;
                _animationComponent.Animation = _animationsSet.GetAnimation("Run");
            }
            else if (right.State == ButtonState.States.Up)
                _animationComponent.Animation = _animationsSet.GetAnimation("Idle");
            else if (left.State == ButtonState.States.Up)
                _animationComponent.Animation = _animationsSet.GetAnimation("Idle");
    }
}</pre>

Let's see what's happening here. At every update we get the current input state and if the button is pressed, we switch to the "Run" animation. Otherwise we go back to "Idle". If we're going left, we also reverse the direction.

The last step is to update our <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example7/Core/Components/AnimatedSpriteRenderComponent.cs" target="_blank" rel="noreferrer noopener">AnimatedSpriteRenderComponent </a>to be able to switch between animations:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class AnimatedSpriteRenderComponent : BaseComponent
{
	private int _currFrameIndex = 0;
	private int _currFramePosX = 0;
	private float _lastUpdate = 0f;
	
	private readonly Transform _transform;
	private AnimationsSet.Animation _animation;
	
	public async ValueTask Render(GameContext game, Canvas2DContext context)
	{
		if (null == Animation)
			return;
		
		if (game.GameTime.TotalTime - _lastUpdate > 1000f / Animation.Fps)
		{
			++_currFrameIndex;
			_lastUpdate = game.GameTime.TotalTime;
			_currFramePosX = (_currFrameIndex % Animation.FramesCount) * Animation.FrameSize.Width;
		}

		var dx = -(_transform.Direction.X-1f) * Animation.FrameSize.Width / 2f;
		await context.SetTransformAsync(_transform.Direction.X, 0, 0, 1, dx, 0);

		await context.DrawImageAsync(Animation.ImageRef, _currFramePosX, 0,
			Animation.FrameSize.Width, Animation.FrameSize.Height,
			_transform.Position.X, _transform.Position.Y,
			Animation.FrameSize.Width, Animation.FrameSize.Height);
	}

	public AnimationsSet.Animation Animation
	{
		get => _animation;
		set
		{
			if (_animation == value)
				return;
			_currFrameIndex = 0;
			_animation = value;
		}
	}
}</pre>

Not very different from the last time, just a few things to note. The call to <a href="https://www.w3schools.com/tags/canvas_settransform.asp" target="_blank" rel="noreferrer noopener">SetTransformAsync()</a> will create and set a <a href="https://en.wikipedia.org/wiki/Transformation_matrix" target="_blank" rel="noreferrer noopener">transformation matrix</a>. We will use it for now to handle the character flip left/right. Also, we also have to make sure the current frame index is brought back to 0 when we set a new Animation.

That's it for now! <a href="https://www.davidguida.net/blazor-gamedev-part-9-finite-state-machine/" target="_blank" rel="noreferrer noopener">Next time</a> we'll see how to refactor this code to a more clean structure. Bye!

<div class="post-details-footer-widgets">
</div>