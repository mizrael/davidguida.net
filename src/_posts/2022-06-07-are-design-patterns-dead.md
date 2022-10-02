---
description: >
  In this article I'll talk about Design Patterns and why nobody loves them anymore.
id: 8023
title: 'Are Design Patterns dead?'
date: 2022-06-07T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8023
permalink: /are-design-patterns-dead
image: /assets/uploads/2022/06/are-design-patterns-dead.jpg
categories:  
  - Design Patterns
  - Software Architecture
  - Ramblings
---

**TLDR:** No, of course they're not dead. It's just that people are lazy.

### Slightly longer version:

I've been thinking a lot lately about writing a new post. Fantasizing, perhaps, is a better word for it. But every time I could not find the right topic, and of course I didn't want to write something just for the sake of it.

One of my first goals for this blog has always been to write about things I've encountered in my daily (or nightly) programming sessions. Over the years, it also slowly evolved into topics that I might have discussed with coworkers and friends, albeit still related to software development.

### For some mysterious reason, however, my creativity simply seems to have vanished roughly <a href='https://www.linkedin.com/feed/update/urn:li:activity:6814733419621187584/' target='_blank'>one year ago</a>. 
Go figure.

There is one thing I noticed quite often when talking to other software engineers, even those not so junior anymore, and even from FAANG.

Most of them have a pretty decent understanding of data structures and basic algorithms (yeah, thanks leetcode), but definitely lack a good grasp on Design Patterns and Refactoring techniques.

They might know the basic ones, like Singleton or Factory for example, but struggle a lot when trying to identify *when* it's time to apply a particular pattern. And of course, they have no idea when it's ok to *bend* the pattern instead, and not apply it dogmatically.

### And trust me, one of the worst things that can happen when writing a piece of software, is having a misplaced sense of security that you're using the right patterns. 

Sadly we usually figure it out only when it's too late, and refactoring the code is not cost-effective anymore.

And why does it happen, would you ask? Well, in most cases these people join a FAANG right after college, probably as interns, and either remain there forever and ever or perhaps jump to another Big Player. 

They'll probably start working on legacy code, or on a PoC that "magically" became an MVP and even more magically turned into a live product.

### They will soon have the feeling to have finally *landed*. Nothing is a mystery anymore.

But in reality, if they don't work shoulder-to-shoulder with seasoned engineers and do regular knowledge transfer sessions, brown bag or learning days, it's extremely unlikely that they'll push further.

Or they might have joined a startup, where all you care about is pushing the product to market as quickly as possible, so it's fine to *take some shortcuts*.

Some others instead might have found their spot at a random Company and they're perfectly happy there. Perhaps they simply enjoy the environment and the work/life balance. So why push further? And to be honest, I absolutely agree with that: there's no price to somebody's personal time.

Actually, I've seen this happening to me as well. I used to spend a **considerable** amount of time going through technical books, blogs and meetups. Then 
this trend slowly changed, as Life started paying its toll. But that's another story.

Now, I'm absolutely not saying that *every* engineer is like that. There's a huge network of people with the right attitude and passion. And probably if you're reading this post, you're among them.

So where do I want to go with this? Well, it's easily said: I'll write more about Design Patterns. It's a topic I love, and I'll try to come up with real-world examples so that should be easier to understand when a particular pattern should be used over another.

I blogged already about <a href='/di-friendly-factory-pattern/' target='_blank'>the Factory Pattern</a> with an interesting twist, so I won't be discussing that again, at least for a while now.

The <a href='/is-dependency-injection-dead-part-1' target='_blank'>next time</a> I'll probably start by writing about Dependency Injection, then we'll see :)