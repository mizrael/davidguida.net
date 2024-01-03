---
description: >
  Here we go with another update on my tiny 8080 emulator! This time I managed to get it running on my Macbook. Still a long road ahead but how satisfying!
id: 7024
title: 'Back to the &#8217;74 with a 8080 emulator &#8211; part 3: running on OSX'
date: 2020-02-05T08:45:00-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7024
permalink: /back-to-the-74-with-a-8080-emulator-part-3-running-on-osx/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
categories:
  - .NET
  - Programming
tags:
  - dotnetcore
  - programming
---
This is probably going to be one of my shortest posts. Just a quick update on the 8080 emulator <a rel="noreferrer noopener" aria-label="I started writing  (opens in a new tab)" href="https://www.davidguida.net/back-to-the-74-with-a-8080-emulator-part-1/" target="_blank">I started writing </a>a while ago. 

When I started the project I was working on a Windows machine. These days however I went back to my lovely Macbook pro. I still prefer using Visual Studio on Windows for &#8220;enterprise&#8221; coding, but I have to admit that VS Code is definitely a nice alternative.  
And no, I don&#8217;t like VS for Mac, so don&#8217;t even ask.

Of course the code was not running at the first attempt so I had to make some minor adjustments. First of all I ported it to .NET Core 3 as 2.2 was feeling too stone-agey.

Then I had to face some dependency issues with System.Drawing on OSX, which eventually were solved by just running \`_brew install mono-libgdiplus_\` . Easy-peasy. 

As Scott Hanselman wrote <a rel="noreferrer noopener" aria-label="a while ago (opens in a new tab)" href="https://www.hanselman.com/blog/HowDoYouUseSystemDrawingInNETCore.aspx" target="_blank">a while ago</a>, there&#8217;s a bunch of other .NET Core drawing libraries out there, so I should probably get rid of System.Drawing at some point in time.

The emulator is still unfinished, there&#8217;s a bunch of instructions that I still have to finalize. Of course I plan to keep spending time on this, it has been an extremely interesting learning exercise. 

Also the code so far is definitely &#8220;not clean&#8221; as I would like, there&#8217;s a lot of room for improvement. Once stabilized, I&#8217;ll do a &#8220;refactoring cleanup&#8221; and try to come up with a better design.

Till then&#8230; stay tuned!

<div class="post-details-footer-widgets">
</div>