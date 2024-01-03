---
description: >
  Welcome back to part 12 of our Blazor 2d Gamedev series. Today we're going to see how we can handle collision detection in an efficient way.
id: 7981
title: 'Blazor Gamedev  - part 12: collision detection'
date: 2021-02-07T19:17:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7981
permalink: /blazor-gamedev-part-12-collision-detection/
image: /assets/uploads/2021/02/Blazor-Gamedev-part-12_-collision-detection.jpg
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
Hi All! Welcome back to part 12 of our **Blazor 2d Gamedev** series. Today we're going to see how we can handle **collision detection** in an efficient way.

<a href="https://www.davidguida.net/blazor-gamedev-part-11-improved-assets-loading/" target="_blank" rel="noreferrer noopener">Last time</a> we improved our assets loading code, adding a JSON structure holding the list of each asset in our game.

I've made a lot of changes to the codebase, and I'll probably write more about them in the next posts, but today we'll focus on **collision detection**.

Today's example is already <a href="https://mizrael.github.io/BlazorCanvas/BlazorCanvas.Example11/" target="_blank" rel="noreferrer noopener">available here</a>, take your time to check it. You should see something like this:

<div class="wp-block-image">
  <figure class="aligncenter size-large"><a href="/assets/uploads/2021/02/blazorcanvas-example-11-collision-detection.gif?ssl=1"><img loading="lazy" width="394" height="216" src="/assets/uploads/2021/02/blazorcanvas-example-11-collision-detection.gif?resize=394%2C216&#038;ssl=1" alt="" class="wp-image-7984" data-recalc-dims="1" /></a></figure>
</div>

You can move the spaceship with the arrow keys and if you happen to hit an asteroid, both of you will disappear.

The main idea is that when two bounding boxes intersect, their _GameObjects_ are colliding. Easy peasy.

When we have just a few entities in our game this is fairly easy, we could simply use two nested loops and check each pair, leading to an <a href="https://en.wikipedia.org/wiki/Big_O_notation" target="_blank" rel="noreferrer noopener">O(n^2) complexity</a>.<figure class="wp-block-image">

<img src="https://i2.wp.com/i.stack.imgur.com/ZEmZ6.png?w=788&#038;ssl=1" alt="" data-recalc-dims="1" /> </figure> 

Unfortunately, this approach doesn't scale very well when the number of entities increases drastically. 

##### Imagine what would happen if we have more asteroids or we start shooting and we have to deal with each bullet.

So what we can do? Well, one alternative (and there are many) is to use a <a href="https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm" target="_blank" rel="noreferrer noopener">divide-et-impera </a>approach. We'll have two main steps, B_uild_ and _Check_.

When _building_ we start by dividing the screen into a regular grid. 

```csharp
void BuildBuckets()
{
    var rows = _game.Display.Size.Height / _bucketSize.Height;
    var cols = _game.Display.Size.Width / _bucketSize.Width;
    _buckets = new CollisionBucket[rows, cols];

    for (int row = 0; row &lt; rows; row++)
    for (int col = 0; col &lt; cols; col++)
    {
        var bounds = new Rectangle(
            col * _bucketSize.Width,
            row * _bucketSize.Height,
            _bucketSize.Width, 
            _bucketSize.Height);
        _buckets[row, col] = new CollisionBucket(bounds);
    }
    
    var colliders = FindAllColliders();
    foreach (var collider in colliders)
    {
        RefreshColliderBuckets(collider);
    }
}
```

Each cell represents a "bucket", containing the bounding boxes of our entities:

```csharp
class CollisionBucket
{   
    public HashSet&lt;BoundingBoxComponent> Colliders { get; } = new();
   
    public Rectangle Bounds { get; init; }
}
```

The _FindAllColliders()_ method is a <a href="https://en.wikipedia.org/wiki/Depth-first_search" target="_blank" rel="noreferrer noopener">simple DFS</a> on the <a href="https://www.davidguida.net/blazor-gamedev-part-10-the-scene-graph/" target="_blank" rel="noreferrer noopener">SceneGraph</a>, returning all the _GameObjects_ with a Bounding Box. 

Entities can belong to multiple buckets (they might be crossing cells or have a bigger bounding box):

```csharp
void RefreshColliderBuckets(BoundingBoxComponent collider)
{
    if (!_bucketsByCollider.ContainsKey(collider.Owner.Id))
        _bucketsByCollider[collider.Owner.Id] = new List&lt;CollisionBucket>();

    foreach (var bucket in _bucketsByCollider[collider.Owner.Id])
        bucket.Remove(collider);

    _bucketsByCollider[collider.Owner.Id].Clear();

    var rows = _buckets.GetLength(0);
    var cols = _buckets.GetLength(1);
    var startX = (int) (cols * ((float) collider.Bounds.Left / _game.Display.Size.Width));
    var startY = (int) (rows * ((float) collider.Bounds.Top / _game.Display.Size.Height));

    var endX = (int) (cols * ((float) collider.Bounds.Right / _game.Display.Size.Width));
    var endY = (int) (rows * ((float) collider.Bounds.Bottom / _game.Display.Size.Height));

    for (int row = startY; row &lt;= endY; row++)
    for (int col = startX; col &lt;= endX; col++)
    {
        if (!_buckets[row, col].Bounds.IntersectsWith(collider.Bounds))
            continue;
        
        _bucketsByCollider[collider.Owner.Id].Add(_buckets[row, col]);
        _buckets[row, col].Add(collider);
    }
}
```

We start by clearing the list of buckets for the entity. Then we compute the indices of the bounding boxes containing the vertexes of the bounding box. This way we can avoid looping over the entire grid, but only on a small window.

At this point we can loop over the cells, check if they actually contain the bounding box and if so, we assign the entity to it.

Now, every time an entity moves we update the entity's buckets list by calling _RefreshColliderBuckets_() on it. Then we can check for collisions **only** with the active entities in the same bucket:

```csharp
void CheckCollisions(BoundingBoxComponent bbox)
{
    var buckets = _bucketsByCollider[bbox.Owner.Id];
    foreach (var bucket in buckets)
    {
        bucket.CheckCollisions(bbox);
    }
}

class CollisionBucket
{   
    public void CheckCollisions(BoundingBoxComponent bbox)
    {
        foreach (var collider in _colliders)
        {
            if (collider.Owner == bbox.Owner || 
                !collider.Owner.Enabled ||
                !bbox.Bounds.IntersectsWith(collider.Bounds))
                continue;

            collider.CollideWith(bbox);
            bbox.CollideWith(collider);
        }
    }
}
```

That's it! The sources are in the <a href="https://github.com/mizrael/BlazorCanvas" target="_blank" rel="noreferrer noopener">same repository </a>as usual. 

In <a href="/blazor-gamedev-part-13-handling-collisions/" target="_blank">the next article</a> we'll see how we can respond when a collision happens between two GameObjects.

Have fun!
