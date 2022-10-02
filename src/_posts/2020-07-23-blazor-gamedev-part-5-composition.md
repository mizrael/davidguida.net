---
description: >
  Hi All! Welcome back to part 5 of our Blazor 2d Gamedev series. Today we'll see how we can move away from procedural code using composition.
id: 7454
title: 'Blazor GameDev &#8211; part 5: composition'
date: 2020-07-23T21:22:29-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7454
permalink: /blazor-gamedev-part-5-composition/
image: /assets/uploads/2020/07/blazor-2d-game-dev.jpg
categories:
  - .NET
  - Blazor
  - Design Patterns
  - Gamedev
tags:
  - Blazor
  - design patterns
  - Gamedev
---
Hi All! Welcome back to part 5 of our **Blazor 2d Gamedev** series. Today we&#8217;ll see how we can move away from procedural code using _**composition**_.

<a aria-label="undefined (opens in a new tab)" href="https://www.davidguida.net/blazor-gamedev-part-4-moving-a-sprite/" target="_blank" rel="noreferrer noopener">Last time </a>we saw how easy it is to load a sprite and move it across the screen. The issue with this solution is that things will get awkward very quickly as soon as we start adding more and more objects to control and render.

So the goal for today&#8217;s exercise is to keep refactoring the code from <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/tree/develop/BlazorCanvas.Example3" target="_blank" rel="noreferrer noopener">Example 3</a> and create a reusable structure. <a href="https://mizrael.github.io/BlazorCanvas/BlazorCanvas.Example4/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">The output</a> on the screen will be exactly the same, but under the hood, it&#8217;s going to be much cleaner.<figure class="wp-block-image size-large">

<img loading="lazy" width="778" height="546" src="/assets/uploads/2020/07/blazor-gamedev-example3.gif?resize=778%2C546&#038;ssl=1" alt="" class="wp-image-7434" data-recalc-dims="1" /> </figure> 

#### So, <a aria-label="undefined (opens in a new tab)" href="https://en.wikipedia.org/wiki/Composition_over_inheritance" target="_blank" rel="noreferrer noopener">composition over inheritance</a>.

The classic inheritance paradigm is built on the concept of a base class that exposes &#8220;generic&#8221; functionalities. By _inheriting ****_from it, we can add more features and get different behavior based on the context. 

In game programming, usually we have a situation like this (warning, pseudo-code ahead) :

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">class GameObject{
    void Update();
    void Render();
}

class Spaceship : GameObject {}
class Player : Spaceship {}
class Enemy : Spaceship {}
class Boss : Enemy {}
class FinalBoss : Boss {}</pre>

We have a base class for all our game objects, from which we inherit to define a Spaceship. Then we&#8217;ll have to create a specific class for the Player and another one for the Enemies. From the Enemy class we create the Boss&#8230;and so on and so forth.  
Every time we need to traverse a full hierarchy of classes.

If you need more/different functionalities, you&#8217;ll need a new type. Of course, there&#8217;s more to it, but it&#8217;s enough for the sake of this article.

With _composition_ instead, we can define the behavior of an object by **attaching** components to it. Every component adds more functionalities, without the need to create a brand new class that encapsulates everything.

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">interface IComponent{}

class GameObject{ 
    List&lt;IComponent> Components; 
}

class PositionComponent : IComponent {}
class RenderComponent : IComponent {}
class PlayerBrainComponent : IComponent {}
class EnemyBrainComponent : IComponent {}</pre>

Every _Component_ is atomic and encapsulates a single piece of behavior and data. All you have to do is create it and then attach it to the GameObject. The hierarchy is pretty flat and definitely easier to follow. 

Going back to Example 4, the first step is to define our **<a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example4/Core/Components/IComponent.cs" target="_blank" rel="noreferrer noopener">IComponent</a>** interface:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public interface IComponent
{
    ValueTask Update(GameContext game);

    public GameObject Owner { get; }
}</pre>

Then we can create a **<a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example4/Core/GameObject.cs" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">GameObject</a>** class:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class GameObject
{
        public ComponentsCollection Components { get; } = new ComponentsCollection();

        public async ValueTask Update(GameContext game)
        {
            foreach (var component in this.Components)
                await component.Update(game);
        }
}</pre>

As you can see, it holds a collection of components. In our game loop, we&#8217;ll call its _Update()_ method which in turn will update the state of its components.

The next step will be to create components to hold <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example4/Core/Components/Transform.cs" target="_blank" rel="noreferrer noopener">the position</a>, handle <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example4/Core/Components/SpriteRenderComponent.cs" target="_blank" rel="noreferrer noopener">rendering</a>, and <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example4/LogoBrain.cs" target="_blank" rel="noreferrer noopener">movement logic</a> and add them to a GameObject instance. 

As usual, check the <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example4" target="_blank" rel="noreferrer noopener">rest of the code</a> in the repo for the full view and feel free to reach out to me if you feel you need more details 🙂

The <a href="https://www.davidguida.net/blazor-gamedev-part-6-mouse-input/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">next time</a> we&#8217;ll see how we can leverage this mechanism to handle mouse input.

Stay tuned!

<div class="post-details-footer-widgets">
</div>