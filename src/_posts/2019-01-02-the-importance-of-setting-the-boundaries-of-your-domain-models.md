---
id: 6544
title: The importance of setting the boundaries (of your domain models)
description: a very quick introduction about DDD Bounded Contexts and Aggregates
date: 2019-01-02T17:12:30-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6544
permalink: /the-importance-of-setting-the-boundaries-of-your-domain-models/
image: /assets/uploads/2019/01/aggregates.jpg
categories:
  - Programming
  - Ramblings
  - Software Architecture
tags:
  - Aggregates
  - DDD
---
First article of the year! I really wanted to start writing this few weeks ago, but honestly I wasn't inspired enough.  
Now that I've spent a good portion of the Christmas break reading blogs, books and watching courses on Pluralsight, I still don't feel inspired enough. 

I guess it's due to how I spent the other portion (eating, sleeping and playing with my kids, mostly), which left me basically without any energy at all. 

But as they say, the first step is always the hardest, no?

Lately I've been putting some effort into improving my <a rel="noreferrer noopener" aria-label="DDD (opens in a new tab)" href="https://en.wikipedia.org/wiki/Domain-driven_design" target="_blank">DDD</a> techniques. For those of you who are still living under a rock, please consider taking a copy of the marvelous <a rel="noreferrer noopener" aria-label="blue book by Eric Evans (opens in a new tab)" href="https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215" target="_blank">blue book by Eric Evans</a>.

I still am in the middle of the learning process, even though I probably started this path years ago. Might be a sign of <a rel="noreferrer noopener" aria-label="impostorism (opens in a new tab)" href="https://en.wikipedia.org/wiki/Impostor_syndrome" target="_blank">impostorism</a>. Or it might be the fact that in this job, as in many other jobs, you <a rel="noreferrer noopener" aria-label="never stop learning (opens in a new tab)" href="https://www.codingame.com/blog/true-programmers-never-stop-learning/" target="_blank">never stop learning</a>.

Not going to discuss about DDD now, or what the benefits are. I shall leave this for another post.

This is going to be just a very quick introduction about boundaries and aggregates instead. What's an aggregate? An example should make things easier.

We can consider an Order our aggregate and Order Lines compose its internal state. 

I said "internal" for a reason: the Order is the "entry-point". We can't have Order Lines without an Order that contains them and obviously an Order without Order Lines is pretty useless.

At the same time, you can't access Order Lines from the outside world without going through the Order. 

Clear? Definitely not rocket science.

Why "aggregate" ? Well, because you're combining things together and building up a structure that mimics your current domain. The Order and the Order Lines are entities and value objects that will eventually form the Aggregate. 

I'll talk more about the distinction between Entities and Value Objects in another post, for now just take that for granted (or lookup on Google!).

For now just think that eventually your system will be a composition of multiple Aggregates acting and interacting together, and the quality of their interaction will be a representation of how good you know your Domain. Communication is the key here!

At this point I would say that the trick is to find the right balance and being able to identify the right boundaries for your Aggregates. Why? Simply because of <a href="https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm" target="_blank" rel="noreferrer noopener" aria-label="divide-et-impera (opens in a new tab)">divide-et-impera</a>. 

Our domain might be complex from the beginning, or become extremely complex over time. Everybody has seen this happening at some point. So take a deep breath, talk to your Domain Expert &#x2122; and identify what are the edges and the sets of your entities. That's it. Compartmentalize. 

There's a lot more to write on this, and I definitely will. When? That's **definitely** a good question! A lot is going on in my life these days and weeks and I have the sensation that 2019 is going to be a crucial year for everyone here.

Ciao!

<div class="post-details-footer-widgets">
</div>