---
description: >
  Welcome to part 8 of our Blazor 2d Gamedev series. Today we're going to refactor our last example, cleaning up the code using a Finite State Machine.
id: 7615
title: 'Blazor GameDev - part 9: introducing the Finite State Machine'
date: 2020-08-30T21:36:20-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7615
permalink: /blazor-gamedev-part-9-finite-state-machine/
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
Hi everyone! Welcome back to part 8 of our **Blazor 2d Gamedev** series. Today we'll keep refactoring <a href="https://www.davidguida.net/blazor-gamedev-part-8-keyboard-control-animations/" target="_blank" rel="noreferrer noopener">our last example</a>, cleaning up the code using a **Finite State Machine**.

As usual, you can check out the <a href="https://mizrael.github.io/BlazorCanvas/BlazorCanvas.Example8/" target="_blank" rel="noreferrer noopener">results in your browser</a> before moving on. Use left/right arrows to move the player and the space bar to attack.

#### So, what's a **Finite State Machine**? It's a computational machine, built from a finite list of states and the list of transitions between them. 

An **FSM** can be exactly in only one of the states and can (possibly) transition into another one after receiving some particular input. This input can be state-specific or global. For more details, check out <a rel="noreferrer noopener" target="_blank" href="https://en.wikipedia.org/wiki/Finite-state_machine">the excellent article</a> on Wikipedia, it will give for sure a lot of food for thoughts.

Now, how can an **FSM** help us with our game? In a lot of ways actually. The first scenario is getting rid of all those nasty _if/else_ blocks:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public override async ValueTask Update(GameContext game)
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
}</pre>

If you remember from our last article, that's the code handling the animation switching. We're going to replace that entirely with an **FSM**.

The idea is to have a State for each possible animation of our character ("idle", "running", "attack" and so on). Then we'll define the possible transitions between them. A transition occurs when a specific condition is detected: for example, if we're _idle_ and our speed is > 0.1 then we transition to "running".

At every update cycle, the current State will loop the list of its transactions and check the conditions for each one. If one of the predicates is satisfied, the transition occurs. We might even decide to get fancy and assign a weight to the transitions: this way if multiple predicates are true, we'll pick the one with the highest weight.

Let's take a look at the code now. This is the <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example8/Core/Components/AnimationState.cs" target="_blank" rel="noreferrer noopener">AnimationState</a> <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example8/Core/Components/AnimationState.cs" target="_blank" rel="noreferrer noopener">class</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class AnimationState
{
	private readonly List&lt;Transition> _transitions;
	private readonly AnimationCollection.Animation _animation;

	public async ValueTask Update(AnimationController controller)
	{
		var transition = _transitions.FirstOrDefault(t => t.Check(controller));
		if(null != transition)
			controller.SetCurrentState(transition.To);
	}

	public void Enter(AnimatedSpriteRenderComponent animationComponent) =>
		animationComponent.Animation = _animation;
}</pre>

The Transition class instead looks more or less like this:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class Transition
{
	private readonly IEnumerable&lt;Func&lt;AnimationController, bool>> _conditions;

	public Transition(AnimationState to, IEnumerable&lt;Func&lt;AnimationController, bool>> conditions)
	{
		To = to;
		_conditions = conditions ?? Enumerable.Empty&lt;Func&lt;AnimationController, bool>>();
	}

	public bool Check(AnimationController controller)
	{
		return _conditions.Any(c => c(controller));
	}

	public AnimationState To { get; }
}</pre>

As you can see, the list of conditions is a collection of predicates, accepting as input an instance of the <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example8/Core/Components/AnimationController.cs" target="_blank" rel="noreferrer noopener">AnimationController class</a>, which represents our FSM:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class AnimationController : BaseComponent
{
	private readonly IList&lt;AnimationState> _states;
	private AnimationState _defaultState;
	private AnimationState _currentState;
	private readonly AnimatedSpriteRenderComponent _animationComponent;
	private readonly IDictionary&lt;string, float> _floatParams;
	private readonly IDictionary&lt;string, bool> _boolParams;

	public AnimationController(GameObject owner) : base(owner)
	{
		_states = new List&lt;AnimationState>();
		_animationComponent = owner.Components.Get&lt;AnimatedSpriteRenderComponent>() ??
							  throw new ComponentNotFoundException&lt;AnimatedSpriteRenderComponent>();

		_floatParams = new Dictionary&lt;string, float>();
		_boolParams = new Dictionary&lt;string, bool>();
	}


	public void AddState(AnimationState state)
	{
		if (!_states.Any())
			_defaultState = state;
		_states.Add(state);
	}

	public override async ValueTask Update(GameContext game)
	{
		if (null == _currentState)
		{
			_currentState = _defaultState;
			_currentState.Enter(_animationComponent);
		}

		await _currentState.Update(this);
	}

	public void SetCurrentState(AnimationState state)
	{
		_currentState = state;
		_currentState?.Enter(_animationComponent);
	}

	public float GetFloat(string name) => _floatParams[name];

	public void SetFloat(string name, float value)
	{
		if(!_floatParams.ContainsKey(name))
			_floatParams.Add(name, 0f);
		_floatParams[name] = value;
	}

	public void SetBool(string name, in bool value)
	{
		if (!_boolParams.ContainsKey(name))
			_boolParams.Add(name, false);
		_boolParams[name] = value;
	}

	public bool GetBool(string name) => _boolParams[name];
}</pre>

The _AnimationController_ holds the list of States, plus some _custom parameters_. We can use those to store some relevant information about the current state of the player. Later on, we can leverage them when creating the transition predicates:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">var animationController = new AnimationController(warrior);
animationController.SetFloat("speed", 0f);

var idle = new AnimationState(animationCollection.GetAnimation("Idle"));
animationController.AddState(idle);

var run = new AnimationState(animationCollection.GetAnimation("Run"));
animationController.AddState(run);

idle.AddTransition(run,new Func&lt;AnimationController, bool>[]
{
	ctrl => ctrl.GetFloat("speed") > .1f
});

run.AddTransition(idle, new Func&lt;AnimationController, bool>[]
{
	ctrl => ctrl.GetFloat("speed") &lt; .1f
});</pre>

That's all for today. <a href="https://www.davidguida.net/blazor-gamedev-part-10-the-scene-graph/" target="_blank" rel="noreferrer noopener">Next time</a> we'll see what a Scene Graph is and how we can use it to handle our Game Objects.

<div class="post-details-footer-widgets">
</div>