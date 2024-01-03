---
description: >
  Welcome back to part 13 of our Blazor 2d Gamedev series. Today we're going to see how we can react when a collision occurs.
id: 8002
title: 'Blazor Gamedev  - part 13: collision handling'
date: 2021-02-22T10:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8002
permalink: /blazor-gamedev-part-13-handling-collisions/
image: /assets/uploads/2020/07/blazor-2d-game-dev.jpg
categories:
  - .NET
  - ASP.NET
  - Blazor
  - Design Patterns
  - Gamedev
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
  - design patterns
  - Gamedev
---
Hi All! Welcome back to part 13 of our **Blazor 2d Gamedev** series. Today we're going to see how we can respond when a collision happens between two GameObjects.

<a href="https://www.davidguida.net/blazor-gamedev-part-12-collision-detection/" target="_blank" rel="noreferrer noopener">Last time</a> we saw a (somewhat) simple way to split our game world in a grid. It helped a lot, reducing the complexity of detecting collisions between entities.

### But we haven't seen how we can *respond* to a collision. Once we've detected that two (or more) GameObjects are colliding, what should we do?

The code was <a href="https://mizrael.github.io/BlazorCanvas/BlazorCanvas.Example11/" target="_blank" rel="noreferrer noopener">available</a> in Example 11, so probably some of you have found out the answer already.

The idea is as usual pretty simple: we can leverage C# delegates and events!
All we have to do is to expose a nice event on our <a target="_blank" href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example11.Core/Components/BoundingBoxComponent.cs">`BoundingBoxComponent` class</a>, something like this:

```csharp
public class BoundingBoxComponent : BaseComponent
{
    /* code omitted for brevity*/

    public event OnCollisionHandler OnCollision;
    public delegate void OnCollisionHandler(BoundingBoxComponent sender, BoundingBoxComponent collidedWith);
}
```

Now, if you remember from our last article, the `CollisionBucket` class has a `CheckCollisions()` method. 

It is looping over its internal collection of colliders (which are basically instances of `BoundingBoxComponent`) and when it detects a collision, calls the `CollideWith()` method on `BoundingBoxComponent`.

This one is simply forwarding the call to the registered event handlers:

```csharp
public class BoundingBoxComponent : BaseComponent
{
    /* code omitted for brevity*/

    public void CollideWith(BoundingBoxComponent other) => this.OnCollision?.Invoke(this, other);
}
```

At this point all we have to do is create the proper event handler for our GameObjects. For example, we can decide to disable an asteroid if it collided with anything else. We can easily do that in our class:

```csharp
public class AsteroidBrain : BaseComponent {
    private AsteroidBrain(GameObject owner) : base(owner)    {   
        _boundingBox = owner.Components.Get<BoundingBoxComponent>();
        _boundingBox.OnCollision += (sender, collidedWith) =>
        {
            this.Owner.Enabled = false;
        };
    }
}
```

We could also decide to add other logic here. For example, if we're colliding with another asteroid, we can respond by changing direction to both the GameObjects involved. The possibilities are endless!

I might be less diligent now with the next posts. I have decided to open <a href="https://www.youtube.com/channel/UC1TKz3-S7ns3xi2H0hFjjjQ" target="_blank">a YouTube channel</a>, I'll be publishing small video tutorials and doing live coding sessions. 

The <a href="/blazor-gamedev-live-coding-sessions-episode-1/" target="_blank">first one</a> is already available and there's a new one coming on Friday 22nd.

Stay tuned!