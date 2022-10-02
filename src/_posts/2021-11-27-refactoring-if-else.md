---
id: 8018
title: Data-driven refactoring of a big IF-ELSE block 
description: >
  In this article we'll see how we can refactor a big IF-ELSE block into a data-driven approach
date: 2021-11-27T00:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8018
permalink: /refactoring-if-else/
image: /assets/uploads/2021/11/refactoring-if-else.jpg
tags:
  - .NET Core
  - C#
  - Design Patterns
---

Few days ago I was invited to an online coding session, hosted by <a href="https://twitter.com/BelloneDavide" target="_blank">Davide Bellone</a>. Believe it or not, I'm a bit shy when it comes to live sessions and the idea kind of scared me at the beginning. But everybody and their dog is doing it nowadays so I wanted to give it a try :)

It all started from this tweet:

<div class="center w100">
  <blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">I need help with a refactoring problem.<br><br>I have a list of 20 if-else statements like<br><br>if(value.StartsWith(&quot;foo&quot;)){}<br>else if (value.StartsWith(&quot;bar&quot;){}<br>else if (value.StartsWith(&quot;baz&quot;){}<br><br>How can I refactor that huge if-else?</p>&mdash; Davide Bellone 🌊 🗡 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1456611920165982208?ref_src=twsrc%5Etfw">November 5, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

We had few exchanges with few other folks, and then Davide suggested to host a coding session on Twitch and bring out our ideas.

<div class="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/9Ou-fvdxxDM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

I joined the party a bit late and (as usual) I was running out of time so I had to code in a rush.

### Overall was a very nice experience, would totally do it again. I came totally unprepared and to be fair I've found it to be a very good learning exercise. 

At the end I was not completely satisfied with my solution, also because I was not able to add some proper tests. So I took some time and few days later I pushed more changes to <a href='https://github.com/code4it-dev/RefactoringIfElse' target='_blank'>the repo</a>.

So what was the problem? Say you have a class like this:

```csharp
public class Foo : BaseFoo
{
    public override string DoSomething(string path)
    {
        if (path.StartsWith("/tarantino/movies"))
        {
            _apiAccess.UpdateItem("Kill Bill");
            return "Kill Bill";
        }
        else if (path.StartsWith("/tolkien/books"))
        {
            var item = _dbRepository.Get("LOTR");
            _apiAccess.UpdateItem(item);
            return item;
        }
        else if (path.StartsWith("/foofighters/songs"))
        {
            var item = _dbRepository.Get("The pretender");
            _apiAccess.UpdateItem(item);
            _dbRepository.Add(item);
            return item;
        }
        else return string.Empty;
    }
}
```

### Nobody loves long chains of if/else statements and neither should you. 

During the session, we took turns and refactored this code with three different approaches. The first two solutions used <a href="https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern" target='_blank'>Chain of Responsibility</a>, and a mixture of Factory and <a href="https://en.wikipedia.org/wiki/Strategy_pattern" target="_blank">Strategy</a>. 

Mine was similar to the Factory one, but with a twist: I loaded the configuration from a file, shifting the setup to a data-driven approach.

Why? A bunch of reasons actually. Flexibility, as it's definitely easier to change a config file rather than source code. Also, config files could *and should* be <a href="https://devops.com/the-pros-and-cons-of-configuration-as-code/" target="_blank">treated as code</a> and stored in a repository.

The first step is to extract each branch into a "worker" or "handler" class, sharing a common interface:

```csharp
public interface IHandler
{
    string Handle(); 
}
```

And so we have a `SongHandler`, a `MovieHandler` and a `BookHandler`. Good. 

Now we need a <a href="https://github.com/code4it-dev/RefactoringIfElse/blob/master/RefactoringIfElse/Concrete/DataDriven/HandlerFactory.cs" target="_blank">Factory</a> that can create the proper handler for us.

And at this point our `Foo` class can be transformed into something like this:

```csharp
public class FooDataDriven : BaseFoo
{
    private readonly IHandlerFactory _factory;

    public FooDataDriven(IHandlerFactory factory)
    {
        _factory = factory;
    }

    public override string DoSomething(string path)
    {
        var handler = _factory.CreateHandler(path);
        return (handler != null) ?
            handler.Handle():
            string.Empty;
    }
}
```
We inject the factory and use it to instantiate the proper handler for the given input. If no handler is found, we return some default value. Much better isn't it? 
### No long chain of IFs, lower <a href="https://en.wikipedia.org/wiki/Cyclomatic_complexity" target="_blank">cyclomatic complexity</a> and definitely much more testable.

We could stop here, but let's push the bar a little higher. All we need is to add another Factory that would load the config from a file and build our `FooDataDriven` instance:

```csharp
public class FooDataDrivenFileFactory
{
    private readonly IDbRepository _dbRepository;
    private readonly IApiAccess _apiAccess;

    public FooDataDrivenFileFactory(IDbRepository dbRepository, IApiAccess apiAccess)
    {
        _dbRepository = dbRepository;
        _apiAccess = apiAccess;
    }

    public FooDataDriven Create(string filePath)
    {
        var jsonData = File.ReadAllText(filePath);
        var nodes = JsonSerializer.Deserialize<ConfigNode[]>(jsonData);

        var creators = new List<HandlerCreator>();
        foreach(var node in nodes)
        {
            Lazy<IHandler> handler;
            switch (node.type)
            {
                case "book":
                    handler = new Lazy<IHandler>(() => new BookHandler(_dbRepository, _apiAccess, node.value));
                    break;
                case "song":
                    handler = new Lazy<IHandler>(() => new SongHandler(_dbRepository, _apiAccess, node.value)); 
                    break;
                case "movie":
                    handler = new Lazy<IHandler>(() => new MovieHandler(_apiAccess, node.value)); 
                    break;
                default:
                    throw new ArgumentException($"invalid node type: {node.type}");
            }
            creators.Add(new HandlerCreator(path => path.StartsWith(node.filter), path => handler.Value));
        }

        var factory = new HandlerFactory(creators);
        return new FooDataDriven(factory);
    }

    private record ConfigNode(string filter, string value, string type);
}
```
