---
description: >
  Let's see how we can ensure thread-safety when adding data to our in-memory cache.
id: 8034
title: 'Thread-safety on MemoryCache'
date: 2023-09-21T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8034
permalink: /2023-09-21-thread-safety-memorycache
image: /assets/uploads/2023/09/thread-safety-memorycache.jpg
categories:  
  - .NET
  
---

I have been using the <a href='https://learn.microsoft.com/en-us/aspnet/core/performance/caching/memory?view=aspnetcore-7.0' target='_blank'>in-memory cache library</a> in a pet project lately and I stumbled on an interesting problem. Are we 100% sure that this class is completely thread safe?

Let me clarify a bit. Most of the times, we use a cache as first layer *before* turning to the actual persistence mechanism (let it be a database, file, network call, whatever).

### This basically means that on a cache miss, we want to load the data from the original source and store it back in the cache *atomically*.

Most of the caching libraries implement some kind of `GetOrAdd` method, like <a href='https://learn.microsoft.com/en-us/dotnet/api/system.collections.concurrent.concurrentdictionary-2.getoradd?view=net-7.0' target='_blank'>the one</a> on `ConcurrentDictionary` in .NET.

And indeed, `IMemoryCache` offers two flavors of that, with one being async too.

Here's an extract <a href='https://github.com/dotnet/runtime/blob/9c8ff4c1c12c488da660739333e36eb55afe9c56/src/libraries/Microsoft.Extensions.Caching.Abstractions/src/MemoryCacheExtensions.cs#L168C30-L168C41' target='_blank'>of the code</a>:

```
public static TItem? GetOrCreate<TItem>(this IMemoryCache cache, object key, Func<ICacheEntry, TItem> factory)
{
    if (!cache.TryGetValue(key, out object? result))
    {
        using ICacheEntry entry = cache.CreateEntry(key);

        result = factory(entry);
        entry.Value = result;
    }

    return (TItem?)result;
}

public static async Task<TItem?> GetOrCreateAsync<TItem>(this IMemoryCache cache, object key, Func<ICacheEntry, Task<TItem>> factory)
{
    if (!cache.TryGetValue(key, out object? result))
    {
        using ICacheEntry entry = cache.CreateEntry(key);

        result = await factory(entry).ConfigureAwait(false);
        entry.Value = result;
    }

    return (TItem?)result;
}
```
See a problem here?

### These calls are not atomic.

We want to avoid multiple threads asking for the data for a given key and on a cache-miss pulling it from the original datasource, causing unnecessary overhead.

Here's a simple solution for that:

```
class FooProvider
{
    private readonly SemaphoreSlim _lock = new(1, 1);
    private readonly IMemoryCache _cache;

    public async ValueTask<Foo> GetFooAsync(string key)
    {
        var entry = _cache.Get<Foo>(key);
        if (entry is not null)
            return entry;

        _lock.Wait(cancellationToken);
        try
        {
            entry = _cache.Get<Foo>(key);
            if (entry is null)
            {
                entry = await CreateFooAsync();
                _cache.Set(key, entry, TimeSpan.FromSeconds(30));
            }
        }
        finally
        {
            _lock.Release();
        }
    }
}
```

The class is basically first checking if there's data in the cache. If it's missing, it will use a shared lock, re-check if there's data (another thread might have entered it before), and if not, will call the async factory.

I could have solved this with a `Lazy<>` instead of a lock. That <a href='/are-design-patterns-dead-singleton' target='_blank'>would have worked</a>, however under certain circumstances it might happen that the underlying factory method (in our case `CreateFooAsync`) can get called multiple times.

Beware that the shared lock will block other readers, even if they are trying to pull data for another key. A solution would be to keep a `ConcurrentDictionary<string, SemaphoreSlim>`, for example.