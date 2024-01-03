---
description: >
  So your team has decided to use Pair Programming. You've never practiced it and honestly it's kinda scaring you. So what is it? Let's find out.
id: 6701
title: The truth about Pair Programming that you have always wanted to ask
date: 2019-05-15T15:10:57-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6701
permalink: /the-truth-about-pair-programming-that-you-have-always-wanted-to-ask/
image: /assets/uploads/2019/05/pair-programming-e1557925613970.jpg
categories:
  - Programming
tags:
  - programming
---
So your team has decided to use Pair Programming. You&#8217;ve never practiced it and honestly it&#8217;s kinda scaring you.

Of course you have questions but seeing that the rest of the team feels quite comfortable, you don&#8217;t ask.

First rule: never forget that people lie.

So what&#8217;s Pair Programming anyway? Nothing to be scared of, even thought it comes with some nasty implications. 

#### It basically means coding with someone else sitting next to you. That&#8217;s it? That&#8217;s it.

It&#8217;s an Agile coding practice introduced by the <a rel="noreferrer noopener" aria-label="Extreme Programming  (opens in a new tab)" href="http://www.extremeprogramming.org/" target="_blank">Extreme Programming </a>folks.

Now, the idea is that the pair is going to **talk**. A lot. Talk about the design, architecture, tests, whatever. Talk about &#8220;oh look, you misplaced a semicolon&#8221; or &#8220;I think we need to add more test coverage here&#8221; or maybe &#8220;I suppose a Decorator would be better in this case&#8221;.

After a while (usually 30 minutes, sometimes more), keyboard and mouse are handled to the other person and the loop begins anew.

Why would someone do this? There are several reasons, here&#8217;s a short list:

  * **Quality**: two people working on the same Task will probably put more effort and attention to what they&#8217;re writing
  * **Knowledge sharing**: do you have a new team member? Pair with him and explain the code base. You&#8217;re not familiar with some part of the system? Pair with someone who is.
  * **Analysis**: in case you don&#8217;t have a clear idea of the final design, pair with someone and have an hands-on brainstorming/coding session. Use TDD as much as possible in this case and you&#8217;ll get the best result ever.

Now, it may seem all fun and games but of course Pair Programming comes with a cost.

For example I know teams that are using it on a **daily basis, for every task.** Honestly, I wouldn&#8217;t recommend that. I mean, it&#8217;s an excellent tool but from time to time we always need a break. We can&#8217;t work constantly with someone else sitting next to us. It requires too much discipline. 

Or maybe you just don&#8217;t like the other person. Or maybe you don&#8217;t share the same idea of hygiene as the other party involved. Who knows.

It is always useful to spend some time alone on a project, try new stuff, experiment a little bit. It surely helps coming up with new ideas. 

Another story is when both parties have a good understanding of the system at hand and of the final design of the code. In this case it might become just a waste of time. 

#### If the analysis has been done already by an architect/dev lead and both people have been working on the system for a while there&#8217;s **almost** no point pairing. 

I said &#8220;almost&#8221; because we&#8217;re humans after all and we tend to add entropy to systems. Entropy in the form of bugs. In this case, as I previously wrote, TDD is always, always encouraged.

<div class="post-details-footer-widgets">
</div>