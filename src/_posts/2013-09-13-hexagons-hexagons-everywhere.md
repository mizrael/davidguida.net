---
id: 274
title: Hexagons! Hexagons everywhere!
date: 2013-09-13T12:17:39-04:00
author: David Guida
layout: post
guid: http://davideguida.netne.net/?p=274
permalink: /hexagons-hexagons-everywhere/
dsq_thread_id:
  - "5186600839"
categories:
  - 2D
  - Graphics
  - Programming
  - XNA
---
I feel bored. Sometimes I feel so bored that I start walking around as if I were on a tiled map. And sometimes I like to switch from rectangular to hex-shaped tiles 😀

I've started working on a hex-based map renderer, just because, as I said. I'm bored.

Here're the results so far:

[<img loading="lazy" class="aligncenter size-medium wp-image-275" alt="Senza nome" src="/assets/uploads/2013/09/Senza-nome-300x220.png" width="300" height="220" />](/assets/uploads/2013/09/Senza-nome.png)

And this is the tile texture:

[<img loading="lazy" class="aligncenter size-full wp-image-276" alt="hex" src="/assets/uploads/2013/09/hex.png" width="62" height="32" />](/assets/uploads/2013/09/hex.png)

I'm using XNA 4 (yeah I know, but that's easy and I love to do everything by myself). Here's part of the rendering code:

<pre>_hexTexture = this.Content.Load&lt;Texture2D&gt;("hex");
_hexOffset = new Vector2(_hexTexture.Width * 0.75f, -_hexTexture.Height * 0.5f);
.....................

spriteBatch.Begin();
var hexPos = Vector2.Zero;
for (int y = 0; y != 10; ++y)
 {</pre>

<pre style="padding-left: 30px;">hexPos.Y = _hexTexture.Height * y * .5f;
 hexPos.X = _hexOffset.X * y;</pre>

<pre style="padding-left: 30px;">for (int x = 0; x != 10; ++x)
 {</pre>

<pre style="padding-left: 60px;">hexPos += _hexOffset;
 spriteBatch.Draw(_hexTexture, hexPos, Color.White);</pre>

<pre style="padding-left: 30px;">}
}
spriteBatch.End();

Easy huh?</pre>

<div class="post-details-footer-widgets">
</div>