---
id: 502
title: 'Unity: Using an FSM to control your GameObjects'
date: 2014-08-01T15:16:36-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=502
permalink: /unity-using-an-fsm-to-control-your-gameobjects/
dsq_thread_id:
  - "5156892593"
image: /assets/uploads/2014/04/logo-titled-672x297.png
categories:
  - .NET
  - 2D
  - Gaming
  - Graphics
  - Programming
  - Unity
---
Thanks to my good friend <a href="http://www.oldschoolpixels.com/" target="_blank">Maurizio</a>, who's been helping me removing the dust from my memory, today I'll show you how to use a simple FSM to control your GameObjects 🙂

First, if you don't know what an FSM is, please read <a title="Finite-state machine" href="http://en.wikipedia.org/wiki/Finite-state_machine" target="_blank">this</a>, and maybe <a title="State" href="http://gameprogrammingpatterns.com/state.html" target="_blank">this too</a>.

Done? Good. Now take a look at this (use arrows and spacebar for jumping).

[unity src="513&#8243;]

See? It's just Mario walking on a small platform. He can jump (obviously, he's Mario) and can fall from the borders.

There are tons of ways to implement this and one of them is using an FSM.

The Player  and the bricks have only a BoxCollider2D, no Physics components. On the Player I have added a Script component that acts as a controller (<a title="PlayerController.cs" href="https://github.com/mizrael/State-Machine/blob/master/PlayerController.cs" target="_blank">code</a> is on GitHub).

The idea is to let the controller initialize the <a title="FSM" href="https://github.com/mizrael/State-Machine/blob/master/AI/StateMachine.cs" target="_blank">FSM</a> adding the needed <a title="States" href="https://github.com/mizrael/State-Machine/blob/master/AI/State.cs" target="_blank">States</a> and define for each state the <a title="Transitions" href="https://github.com/mizrael/State-Machine/blob/master/AI/StateTransition.cs" target="_blank">Transitions</a> (basically destination State and condition ).

For this demo I have implemented three States: <a href="https://github.com/mizrael/State-Machine/blob/master/AI/States/PlayerDefaultState.cs" target="_blank">Default</a>, <a href="https://github.com/mizrael/State-Machine/blob/master/AI/States/PlayerJumpState.cs" target="_blank">Jumping</a> and <a href="https://github.com/mizrael/State-Machine/blob/master/AI/States/PlayerFallingState.cs" target="_blank">Falling</a>. The transitions are simple:

[<img loading="lazy" class="alignnone size-large wp-image-511" src="/assets/uploads/2014/08/FSM-Transitions-1024x574.jpg?resize=474%2C265" alt="FSM Transitions" width="474" height="265" srcset="/assets/uploads/2014/08/FSM-Transitions.jpg?resize=1024%2C574&ssl=1 1024w, /assets/uploads/2014/08/FSM-Transitions.jpg?resize=300%2C168&ssl=1 300w, /assets/uploads/2014/08/FSM-Transitions.jpg?w=1454&ssl=1 1454w" sizes="(max-width: 474px) 100vw, 474px" data-recalc-dims="1" />](/assets/uploads/2014/08/FSM-Transitions.jpg)

  * Default -> Jump: on "spacebar" pressed
  * Default -> Falling: if no collision occurs on -Y
  * Jump -> Falling: after 0.5 seconds
  * Falling -> Default: if a collision occurs on -Y

The states themselves are pretty simple:

  * Default: checks  for input on the horizontal axis and moves the player
  * Jump: adds an impulse to the Y of the player
  * Falling: applies gravity to the player transform

<div class="post-details-footer-widgets">
</div>