---
description: >
  #hashtags just landed on #Barfer! Yeah, exactly: now you can barf adding your favourite #hashes and you can even use them to filter #barfs!
id: 6384
title: '#hashtags just landed on #Barfer!'
date: 2017-11-18T22:30:36-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6384
permalink: /hashtags-just-landed-barfer/
dsq_thread_id:
  - "6293518051"
image: /assets/uploads/2017/11/Hashtags.png
categories:
  - Azure
  - Barfer
  - Git
  - Javascript
  - Microservices
  - MongoDB
  - NodeJS
  - Programming
  - Projects
  - Software Architecture
  - Typescript
---
Yeah I know, I blogged yesterday. I probably have too much spare time these days (my wife is abroad for a while) and <a href="https://barfer.azurewebsites.net/" target="_blank" rel="noopener">Barfer</a> has become some kind of obsession.

You don't know what&nbsp;<a href="https://barfer.azurewebsites.net/" target="_blank" rel="noopener">Barfer</a> is? Well go immediately check my <a href="https://www.davidguida.net/im-becoming-barfer/" target="_blank" rel="noopener">last article</a>. Don't worry, I'll wait here.

So the new shiny things are #hashtags! Yeah, exactly: now you can barf adding your favourite #hashes and&nbsp;you can even use them to filter #barfs!

The implementation is for now very simple, just a string array containing the tags, as you can see from the Barf interface defined <a href="https://github.com/mizrael/barfer/blob/master/src/common/infrastructure/entities.ts" target="_blank" rel="noopener">here</a>.

The command handle responsible for storing the Barf uses a regex to parse the text and extract all the tags (apart from checking for xss but that's another story).

On the UI then before getting rendered every Barf goes through the same regex but this time the #tag is replaced with a link to the archive.

Quick&dirty.

Next thing in line would be adding some analytics to them but that would require a definitely bigger community 😀

I also went through some small refactoring and cleaning of the frontend code, although I will probably move to an SPA sooner or later. Thing is, I'm still not sure if using React, Angular or Vue so in the meantime I'm focusing on the backend.

There are so many features I would like to add that to be honest I prefer to not focus on the frontend for now. Maybe I'll start looking for somebody who helps me on that.

One thing I'm quite happy for now but I plan to rework is CI/CD. Well for now I'm working alone on this so probably I can't really talk about&nbsp;**integration**. But whatever.  
As I wrote already, I'm using <a href="https://travis-ci.org/" target="_blank" rel="noopener">Travis CI</a> and I'm very happy with the platform. Even though I'm still on the free tier, the features are awesome and flexibility is huge.&nbsp; I'll probably write a blog post on this in the next few days.

In the meanwhile, #happy #barfing!&nbsp;

<div class="post-details-footer-widgets">
</div>