---
id: 6118
title: Dell Limerick Hackathon 2016
date: 2016-02-10T19:21:52-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6118
permalink: /dell-limerick-hackathon-2016/
dsq_thread_id:
  - "5147260515"
image: /assets/uploads/2016/02/WP_20160121_045.jpg
categories:
  - .NET
  - AngularJS
  - ASP.NET
  - Git
  - Javascript
  - MongoDB
  - MVC
  - Programming
  - Senza categoria
  - Software Architecture
  - Technology
  - WebAPI
---
Hi everybody!

Last January we had an Hackathon here @ Dell Limerick, the main theme was "office productivity", aka "how would you improve your and your coworker's productivity".

I was in a team with other 4 very smart guys, didn't won but all in all it was a terrific experience&#8230;two days straight of brainstorming and coding madness combined with pizza and energy drinks.

The winners came up with an interesting prototype of a chat bot running as Lync addon that can answer every type of question, from "how's the weather" to "who broke the last build?", passing from "tell me about story 1234567". I can't go too deep in the details (also, lots of natural language analysis is involved) but it was definitely a very, very interesting project and really deserved to win.

My team instead&#8230;well we produced a voting platform for ideas. In a nutshell, every user registered to the community can post his ideas (which can be divided into macro-areas) and the others can vote it using points they have received when registering. If an idea is approved, the voters will get back the points and a small bonus. If an idea is cancelled instead, they will get the points back (but no bonus).

It was a cool project to work on, we used a very simple micro-service CQRS architecture running on AngularJS, WebApi and MongoDB. Oh and everything was hosted on Azure.

After the contest, we decided to release all the sources, you can find them on my <a href="https://github.com/mizrael/UsersVoice" target="_blank">GitHub repository</a>.

Enjoy!

<div class="post-details-footer-widgets">
</div>