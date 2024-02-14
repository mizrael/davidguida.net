---
description: > 
  Which .NET class has better lookup performance, Dictionary, HashSet, SortedList or SortedDictionary? The answer is not so simple!
id: 8039
title: 'Comparing lookup performance in .NET'
date: 2024-02-14T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8039
permalink: /lookup-performance
image: /assets/uploads/2024/02/lookup-performance.jpg
categories:  
  - .NET
  - Ramblings
  - Data structures
---

First article of the year! I've been busy preparing for <a href='https://confoo.ca/en/speaker/david-guida' target='_blank'>Confoo</a> here in Montreal, so I haven't had much time lately for focusing on my blog, unfortunately.

Today I just wanted to showcase (<a href='/know-your-data-structures-list-vs-dictionary-vs-hashset' target='_blank'/>again</a>) how important it is to know your data structures. This time, I wrote a small benchmark measuring lookup performance between `Dictionary`, `SortedList`, `SortedDictionary` and `HashSet`.

These classes offer more or less the same interface but are clearly solving different problems. When it's necessary to store and perform lookups in large volumes, it's good to know how they're behaving.

You can find the code along with the results <a href='https://github.com/mizrael/DictionaryLookupBenchmark' target='_blank'>on GitHub</a>.

### As we can see, `Dictionary` is the clear winner, but it depends on the use case. If, like here, we're only interested into lookups, then `Dictionary` is the right approach. Or `HashSet` if you don't need to store key/value pairs.

In case instead the order of keys is important, the `Sorted___` classes are the way to go.

The reason for this big gap in the results is due to the different data structures used internally:

- `SortedDictionary` is a binary search tree with _O(log n)_ retrieval
- `SortedList` is a wrapper over an array of key/value pairs with _O(log n)_ retrieval

Both `Dictionary` and `HashSet` instead exhibit constant lookup complexity ( _O(1)_ ), therefore leading to better overall performance.
