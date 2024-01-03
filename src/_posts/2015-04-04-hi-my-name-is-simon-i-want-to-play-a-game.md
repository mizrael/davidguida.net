---
id: 647
title: Hi my name is Simon. I want to play a game.
date: 2015-04-04T21:33:38-04:00
author: David Guida
excerpt: Ever wondered how to build the Simon game with Arduino? No? Well, I did.
layout: post
guid: http://www.davidguida.net/?p=647
permalink: /hi-my-name-is-simon-i-want-to-play-a-game/
videourl:
  - ""
dsq_thread_id:
  - "5369191722"
image: /assets/uploads/2015/04/arduinorx_by_zuggamasta-d34m2lr.jpg
categories:
  - Arduino
  - Electronics
  - Gaming
  - Programming
---
Who&#8217;s Simon? Nobody? My God, are you living under a rock?  
Simon is an elecronic game created in the late &#8217;70 where you basically had to push some buttons in a specific sequence that gets longer and longer. Still nobody? Ok, here&#8217;s the <a href="http://en.wikipedia.org/wiki/Simon_%28game%29" title="Simon" target="_blank">wiki</a>.

Why this introduction? Because Simon is a game, and I love games. Also, Simon is an ELECTRONIC game, I am learning electronics and probably there&#8217;s no better way to learn something than using funny examples as exercises 🙂 

After a couple of hours of experiments and tests this is what came out:  


As you can see I&#8217;m using an Arduino board to do all the heavy lifting and just some LEDs, resistors and pushbuttons. My goal was to keep the number of components to the bare minimum (but I&#8217;m pretty sure there are better ways&#8230;)

Talking about code, I have used a very very simple State Machine (something like <a href="http://www.davidguida.net/unity-using-an-fsm-to-control-your-gameobjects/" title="Unity: Using an FSM to control your GameObjects" target="_blank">this one</a>, but much simpler) with four states:  
1) build a random sequence of LEDs  
2) show the sequence to the user  
3) wait for input and check for error  
4) show the result and reset

Warning: may be addictive, do not play for more than 1 hour.

<div class="post-details-footer-widgets">
</div>