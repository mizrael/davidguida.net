---
description: >
  Last week I was invited as speaker at the monthly DevDay Salerno to talk about Feature Gating. Seems that the topic captured some interest so I thought it was a good idea to write a little about it here. So what is Feature Gating ?
id: 6426
title: 'Feature Gating part 1 : what is it?'
date: 2018-02-26T12:22:39-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6426
permalink: /feature-gating-part-1-what-is-it/
image: /assets/uploads/2018/02/feature_gating-e1519643864384.jpg
categories:
  - Programming
  - Software Architecture
---
Last week I was invited as speaker at the monthly <a href="https://www.meetup.com/en-AU/devday-salerno/" target="_blank" rel="noopener">DevDay Salerno</a> to talk about **Feature Gating**. The recording will be soon available on YouTube (even though it will be in italian, sorry).

Seems that the topic captured some interest so I thought it was a good idea to write a little about it here.&nbsp;

In this **series of articles** we will

  * discover what Feature Gating is
  * what strategy can we use to persist our data
  * some design patterns
  * how Feature Gating can help us and why should we be using it
  * how to fight the infamous tech debt

So let&#8217;s start!

As I wrote already in <a href="https://www.davidguida.net/devday-salerno-lets-talk-about-feature-gating/" target="_blank" rel="noopener">my last post</a>,&nbsp;Feature Gating is an interesting and easy tool to leverage when you want more flexibility during production deployment. It helps&nbsp;controlling and shipping new features faster allowing practices like&nbsp;<a href="https://martinfowler.com/bliki/CanaryRelease.html" target="_blank" rel="noopener">canary releases</a> and&nbsp;<a href="https://en.wikipedia.org/wiki/A/B_testing" target="_blank" rel="noopener">A/B testing</a>.

But what&#8217;s the heart of it? An **IF block**. Nothing else.&nbsp;

Suppose you&#8217;re asked to rewrite a functionality, the first thing you would probably do is commenting the old code and replace it with a new function. Something like this:

```js
function compute_stuff(){
  /*...*/
  old_tested_reliable_and_lovely_function();
  /*...*/
}
```

which becomes

```js
function compute_stuff(){
  /*...*/
  //old_tested_reliable_and_lovely_function();
  new_amazing_shiny_never_used_function();
  /*...*/
}
```

Then (probably, **hopefully**) you update your tests and deploy to production. And right after you discover that maybe

  * the code is not exactly doing what it&#8217;s supposed to do
  * performances are lower than expected
  * a bug slipped through
  * whatever

So how can you control this without updating the code and deploying again? Let&#8217;s see a very simple solution:

```js
function compute_stuff(){
  /*...*/
  if(checkFeatureIsOn("foo_feature")){
      new_amazing_shiny_never_used_function();
  }else{
      old_tested_reliable_and_lovely_function();
  }
  /*...*/
}
```

We introduced another actor, this &#8220;checkFeatureIsOn&#8221; function. It will take the name of the feature and return a **boolean** **flag** indicating whether or not use the new codepath.

<a href="https://www.davidguida.net/feature-gating-part-2-how-can-we-store-the-flags/" target="_blank" rel="noopener">In the next article</a> we will explore how would you store all the flags. Stay tuned!
