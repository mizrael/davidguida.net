---
description: >
  In part 10 of our Blazor 2d GameDev series we'll talk about an extremely important tool for handling entities relatioships: the Scene Graph.
id: 7737
title: 'Blazor GameDev - part 10: the Scene Graph'
date: 2020-09-25T15:23:15-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7737
permalink: /blazor-gamedev-part-10-the-scene-graph/
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
  - 2D
  - Blazor
  - Gamedev
tags:
  - .NET Core
  - 2D
  - Blazor
  - Gamedev
---
Hi All! Here we go with part 10 of our **Blazor 2d GameDev** series. Today we're going to talk about an extremely important tool that can greatly improve game entities management: the **Scene Graph**.

This is an example, just to give you an idea of what is going to be the result:

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img loading="lazy" width="450" height="180" src="/assets/uploads/2020/09/blazor-2d-gamedev-scene-graph.gif?resize=450%2C180&#038;ssl=1" alt="" class="wp-image-7739" data-recalc-dims="1" /></figure>
</div>

You can also check it <a rel="noreferrer noopener" href="https://mizrael.github.io/BlazorCanvas/BlazorCanvas.Example9/" target="_blank">in your browser </a>before moving on.

In <a href="https://www.davidguida.net/blazor-gamedev-part-9-finite-state-machine/" target="_blank" rel="noreferrer noopener">our last episode,</a> we introduced Finite State Machines. They greatly help cleaning up the mess of procedural code that very often may arise when writing a game. But still, we are adding all our Game Objects to the Game without any kind of relationship. What if we want to model a Solar System? 

#### Or, more formally: what if we want to represent parent-child relationships, with the state of the parent influencing the state of its children.

There's a long list of different applications we can have for a Scene Graph, for example handling collisions. Imagine a first-person shooter game: when a bullet is fired against an enemy, there's no need to check for collisions on an arm if the bullet didn't collide with the whole body bounding box.

Let's start by defining a very simple <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example9/Core/SceneGraph.cs" target="_blank" rel="noreferrer noopener">SceneGraph class</a>, something like this:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class SceneGraph
{
	public SceneGraph()
	{
		Root = new GameObject();
	}

	public async ValueTask Update(GameContext game)
	{
		if (null == Root)
			return;
		await Root.Update(game);
	}
	
	public GameObject Root { get; }
}</pre>

The Root node is a simple empty GameObject, that will act as a "global container" of all our entities. This will be just a starting point for a simple game. It is missing a lot of functionalities (eg. multiple roots, search, removal), but will work for now. Also, keep in mind that in a game you already have the general structure of the entity tree. A different case would be in an editor, but let's leave it for another time.

The next thing we have to do is update the <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example9/Core/GameObject.cs" target="_blank" rel="noreferrer noopener">GameObject class </a>and add parent/child relationship:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class GameObject 
{
	private readonly IList&lt;GameObject> _children;

	public GameObject()
	{
		_children = new List&lt;GameObject>();
	}
	
	public IEnumerable&lt;GameObject> Children => _children;
	public GameObject Parent { get; private set; }

	public void AddChild(GameObject child)
	{
		if (!this.Equals(child.Parent))
			child.Parent?._children.Remove(child);

		child.Parent = this;
		_children.Add(child);
	}
}</pre>

We'll also need to make few changes to its _Update()_ method:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public async ValueTask Update(GameContext game)
{
	foreach (var component in this.Components)
		await component.Update(game);

	foreach (var child in _children)
		await child.Update(game);
}</pre>

The idea is to first update all the Components and then move to the Children collection. The flow is basically a <a href="https://en.wikipedia.org/wiki/Depth-first_search#Vertex_orderings" target="_blank" rel="noreferrer noopener">preorder DFS</a>, which is fine most of the time. Another option would be using a <a href="https://en.wikipedia.org/wiki/Breadth-first_search" target="_blank" rel="noreferrer noopener">BFS</a>, but that would make the code a bit more complex to follow. 

Now in our initialization code all we have to do now is instantiating the **Scene Graph** instance and start adding nodes to it:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">var sceneGraph = new SceneGraph();

var player = new GameObject();
var sceneGraph.Root.AddChild(player);

var enemies = new GameObject();
var enemy1 = new GameObject();
enemies.AddChild(enemy1);
var enemy2 = new GameObject();
enemies.AddChild(enemy2);
var sceneGraph.Root.AddChild(enemies);</pre>

Now, in our Solar system game, we want the planets to rotate around the sun and satellites to do the same around planets instead. Using a **Scene Graph** this becomes extremely easy by updating the <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example9/Core/Components/TransformComponent.cs" target="_blank" rel="noreferrer noopener">TransformComponent class</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class TransformComponent : BaseComponent
{
	private Transform _local = Transform.Identity();
	private Transform _world = Transform.Identity();

	public override async ValueTask Update(GameContext game)
	{
		_world.Clone(ref _local);
		
		if (null != Owner.Parent && Owner.Parent.Components.TryGet&lt;TransformComponent>(out var parentTransform))
			_world.Position = _local.Position + parentTransform.World.Position;
	}

	public Transform Local => _local;
	public Transform World => _world;
}</pre>

We basically inherit the parent's _world_ position and simply use it as offset to the _local_ position of the current Game Object.

That's all for today! <a href="https://www.davidguida.net/blazor-gamedev-part-11-improved-assets-loading/" target="_blank" rel="noreferrer noopener">Next time</a> will see how to improve the asset loading code.

Ciao! 

<div class="post-details-footer-widgets">
</div>