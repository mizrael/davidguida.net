---
description: >
  "Building Resilient Systems Made Easy" contains some useful patterns and gotchas that will help you write more robust applications. Check it out now!
id: 8044
title: 'Building Resilient Systems Made Easy'
date: 2024-11-08T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8044
permalink: /building-resilient-systems-made-easy
image: /assets/uploads/2024/11/building-resilient-systems-made-easy.jpg
categories:  
  - Software Architecture
  - Design Patterns
  - Booklet
  
---

### Disclaimer
> This article contains a snippet from my booklet: <a href='https://payhip.com/b/21Vo6' target='_blank'>Building Resilient Systems Made Easy</a>

Let’s start by taking a look at the formal definition of the word “Resiliency”. The Merriam-Webster dictionary formalizes it like this:

1: the capability of a strained body to recover its size and shape after deformation caused especially by compressive stress

2: an ability to recover from or adjust easily to misfortune or change

“Resiliency” and “resilience” are synonyms and often used interchangeably, with the latter being more common and preferred in academic environments. Both describe the same concept: the capacity to recover quickly from difficulties or adapt to change.

When it comes to building software, resilience is the ability of a system to endure disruptions, recover from issues, and continuously evolve to maintain stability despite changes in its environment. A resilient system is dependable and predictable, capable of recovering effectively after setbacks.

Resilience is universally valued. Whether applied to individuals, machinery, or digital systems, the necessity for resilience is unquestionable.

From a technological standpoint, resilience involves ensuring our programs do not crash. Systems should handle errors gracefully, avoiding catastrophic failures that might bewilder users or, in severe cases, endanger them. Hardware resilience is equally crucial; consider whether a single machine outage is tolerable or if investment in redundant power supplies and networking is necessary to mitigate failure risks.

The advent of cloud computing has altered the landscape. Managing individual machines may no longer be under direct control. Instead, the focus shifts to selecting appropriate cloud services that fulfill specific requirements.

### Why does it matter?

In 2019, British Airways suffered a major failure of their IT systems due to a significant defect in one of their applications. The bug caused more than 100 flights to be dropped and caused a huge disruption of services in the Heathrow and Gatwick airports.

In 2023, a Google data center in Paris had an incident described as “a multi-cluster failure which led to an emergency shutdown of multiple zones.” Apparently the issue was caused by a water leakage in a cooling system that brought to a fire incident in one of the rooms.

Even big companies can and will have incidents like these. What matters though is their ability to quickly investigate and recover from them.

Bottom line? Don’t stress too much. Plan for resiliency, do your best, and be prepared for Murphy’s law.

> Don't miss the rest of the chapter! <a href='https://store.davidguida.net/b/21Vo6' target='_blank'>Building Resilient Systems Made Easy</a> is available now!
