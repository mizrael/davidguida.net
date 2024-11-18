---
description: >
  Are you sure you're using Dictionaries correctly? You might be surprised to know how much faster this other method can be! 
id: 8045
title: 'Are you using Dictionaries correctly?'
date: 2024-11-18T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8045
permalink: /dictionary-lookup-performance
image: /assets/uploads/2024/11/dictionary-lookup-performance.jpg
categories:  
  - .NET
  - Benchmark
  - Data structures
---

A while ago I wrote a <a href='/lookup-performance' target='_blank'>small comparison</a> between Dictionary, HashSet, SortedList and SortedDictionary when performing a lookup operation.

I have noticed however that many developers don't use the most efficient method for checking if an item exists and retrieving it.

Most of the times, you'll see something like this:

```csharp
if (myDictionary.ContainsKey(key))
{
    var value = myDictionary[key];
    // do something with value
}
```

...which is fine and does its job. But if this code is in performance-sensitive paths, there's a better and more concise way:

```csharp
if (myDictionary.TryGetValue(key, out var value)) 
{
  // do something with value
}
```

"No big deal", you might say. Well, this benchmark says otherwise:

![](https://raw.githubusercontent.com/mizrael/DictionaryLookupBenchmark/36456254d1700c927fb85cb37356a7b4aae73ce1/dictionary.jpg)

The calls to `TryGetValue` are almost 2x faster! **But why is that?**

The reason is pretty simple actually: calling `ContainsKey` and then accessing the value by key is performing the lookup twice.

As you can see, I have also included a comparison between .NET 8 and 9. The difference is not abyssal, but we can still see an improvement.

As usual, the code for the benchmark is available on <a href='https://github.com/mizrael/DictionaryLookupBenchmark/blob/main/DictionaryLookupBenchmark/DictionaryLookupBenchmark.cs' target='_blank'>GitHub</a>.

Enjoy!