---
id: 5992
title: Behold! DynamicConfig is here!
date: 2015-05-28T20:57:08-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=5992
permalink: /behold-dynamicconfig-is-here/
videourl:
  - ""
image: /assets/uploads/2015/05/octobiwan.jpg
categories:
  - .NET
  - Git
  - Programming
---
A couple of days ago while working on <a href="https://www.videum.com" target="_blank">Videum </a>( as usual ) I was in need of a simple configuration mechanism, something that would allow me to use plain text files. Maybe with JSON data but without the need of accessing values with dictionary-like syntax like [&#8220;key_name&#8221;] and so on.

I googled a little bit and found <a href="https://www.nuget.org/packages/JsonConfig/" target="_blank">JsonConfig</a> on NuGet. Very nice, but I wanted more. First, I like my JSON data parsed by <a href="http://www.newtonsoft.com/json" target="_blank">Json.NET</a>  so I had to fork the library and refactor. But then I decided that I needed other features so in the end I started writing another library instead 😀

Directly from the README:

> DynamicConfig is a very simple to use configuration library based on the C# 4.0 dynamic feature. It allows loading from file (or parsing) multiple configurations that can be later accessed via dynamic typing, no custom classes or casts are required.

Nice, huh?

Of course at the moment it exposes just basic functionalities, but I&#8217;m planning to add other features for example writing to config files, support for appSettings and so on.

And <a href="https://github.com/mizrael/DynamicConfig" target="_blank">here&#8217;s the link</a> to GitHub, enjoy!

<div class="post-details-footer-widgets">
</div>