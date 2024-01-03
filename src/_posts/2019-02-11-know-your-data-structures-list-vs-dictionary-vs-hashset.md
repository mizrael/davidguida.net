---
description: >
  Does it really matter how your data is structured, as long as you're fulfilling the task at hand?Is it always important to use the right data structure?
id: 6575
title: 'Know your data structures - List vs Dictionary vs HashSet'
date: 2019-02-11T09:30:02-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6575
permalink: /know-your-data-structures-list-vs-dictionary-vs-hashset/
dsq_thread_id:
  - "7224453490"
image: /assets/uploads/2019/02/data_structures.jpeg
categories:
  - .NET
  - Programming
  - Ramblings
---
<blockquote class="wp-block-quote">
  <p>
    Are there any cases when it doesn't really matter how your data is structured, as long as you're fulfilling the task at hand? Or is it always important to use the perfect data structure for the job? Let's find out!
  </p>
</blockquote>

Those collections have quite different purposes and use cases. Specifically, Lists should be used when all you have to do is stuff like enumerating the items or accessing them randomly via index.

Lists are very similar to plain arrays. Essentially **they are** an array of items that grow once its current capacity is exceeded. It's the standard and probably the most used collection. Items can be accessed randomly via the [] operator at constant time. Adding or removing at the end costs O(1) as well, except when capacity is exceeded. Doing it in the beginning or the middle requires all the items to be shifted.

Dictionaries and HashSets instead are specialised collections intended for fast-lookup scenarios. They basically map the item with a key built using an <a rel="noreferrer noopener" aria-label="hash function (opens in a new tab)" href="https://en.wikipedia.org/wiki/Hash_function" target="_blank">hash function.</a> That key can be later on used to quickly retrieve the associated item.

They both share more or less the same asymptotic complexity for all the operations. The real difference is the fact that with a Dictionary we can create key-value pairs (with the keys being unique), while with an HashSet we're storing an unordered set of unique items.

<blockquote class="wp-block-quote">
  <p>
    It's also extremely important to note that when using HashSets, items have to properly implement <strong>GetHashCode</strong>() and <strong>Equals</strong>() .
  </p>
  
  <p>
    <br />On Dictionaries instead that is obviously needed for the <strong>Type used as key</strong>.
  </p>
</blockquote>

I wrote a very small <a rel="noreferrer noopener" href="https://github.com/mizrael/collections-lookup" target="_blank">profiling application</a> to check lookup times of List, Dictionary and Hashset. Let's do a quick recap of what these collections are. It first generates an array of Guids and uses it as source dataset while running the tests. 

The code is written in C# using .NET Core 2.2 and was executed on a Macbook Pro mid 2012. Here's is what I've got:

###### Collection creation<figure class="wp-block-image">

<a href="https://i1.wp.com/raw.githubusercontent.com/mizrael/collections-lookup/master/creation.png?ssl=1" target="_blank" rel="noreferrer noopener"><img src="https://i1.wp.com/raw.githubusercontent.com/mizrael/collections-lookup/master/creation.png?w=788&#038;ssl=1" alt="Collection creation" data-recalc-dims="1" /></a></figure> 

Lists here perform definitely better, likely because Dictionaries and HashSets have to pay the cost of creating the hash used as key for every item added.

###### Collection creation and lookup <figure class="wp-block-image">

<a href="https://i1.wp.com/raw.githubusercontent.com/mizrael/collections-lookup/master/creation_lookup.png?ssl=1" target="_blank" rel="noreferrer noopener"><img src="https://i1.wp.com/raw.githubusercontent.com/mizrael/collections-lookup/master/creation_lookup.png?w=788&#038;ssl=1" alt="Collection creation and lookup" data-recalc-dims="1" /></a></figure> 

Here things start to get interesting: the first case shows the performance of creation and a single lookup. More or less the same stats as simple creation. In the second case instead lookup is performed 1000 times, leading to a net win of Dictionary and HashSets. This is obviously due to the fact that a lookup on a List takes linear time ( O(n) ), being constant instead ( O(1) ) for the other two data structures.

###### Lookup of a single item <figure class="wp-block-image">

<a href="https://i2.wp.com/raw.githubusercontent.com/mizrael/collections-lookup/master/lookup.png?ssl=1" target="_blank" rel="noreferrer noopener"><img src="https://i2.wp.com/raw.githubusercontent.com/mizrael/collections-lookup/master/lookup.png?w=788&#038;ssl=1" alt="Lookup of a single item" data-recalc-dims="1" /></a></figure> 

<a rel="noreferrer noopener" target="_blank" href="https://github.com/mizrael/collections-lookup/raw/master/lookup.png"></a>In this case Dictionaries and HashSet win in both executions, due to the fact that the collections have been populated previously.

###### Lookup in a Where() <figure class="wp-block-image">

<a href="https://i1.wp.com/raw.githubusercontent.com/mizrael/collections-lookup/master/lookup_where.png?ssl=1" target="_blank" rel="noreferrer noopener"><img src="https://i1.wp.com/raw.githubusercontent.com/mizrael/collections-lookup/master/lookup_where.png?w=788&#038;ssl=1" alt="Lookup in a Where()" data-recalc-dims="1" /></a></figure> 

<a rel="noreferrer noopener" target="_blank" href="https://github.com/mizrael/collections-lookup/raw/master/lookup_where.png"></a>For the last example the system is looping over an existing dataset and performing a lookup for the current item. As expected, Dictionaries and HashSet perform definitely better than List.

<blockquote class="wp-block-quote">
  <p>
    It's easy to see that in almost all the cases makes no difference which data structure is used if the dataset is <strong>relatively small</strong>, less than 10000 items. The only case where the choice matters is when we have the need to cross two collections and do a search.
  </p>
</blockquote>

<div class="post-details-footer-widgets">
</div>