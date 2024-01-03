---
id: 6475
title: A static website is better.
date: 2018-05-28T09:30:34-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6475
permalink: /static-website-is-better/
dsq_thread_id:
  - "6696073558"
image: /assets/uploads/2018/05/statics-e1527461448620.jpeg
categories:
  - Azure
  - NodeJS
  - Programming
  - Statifier
  - Typescript
---
Yes, you read that right: a static website is better.

Now take a deep breath and follow me. To read this post you've politely asked your browser to fetch data from a url. This has triggered a chain of servers up to the one hosting this blog which has identified the right php script to execute and returned a somewhat well-formatted html string in output. At this point your nice browser can start rendering the page, while at the same time performing some other requests to download images, styles, scripts and so on.

Phew.

That's a lot of steps.

Some of them cannot be avoided (you have to download something sooner or later), but for sure we can try to make the life of our servers easier by reducing the workload. Maybe by optimizing the database calls. Or maybe by simply serving static html files and nothing else.

At this point some of you might argue that we're not in the early '90s. I agree, even though I really love grunge music.&nbsp;

But&#8230;think of those websites that have little to none dynamic content. Maybe not even a contact form. Something very similar to this blog. What's the ultimate way to speedup a website like this?

I can see some of you mouthing "use a cache". Yes, I can use a cache. Of course I do. But caching <a href="https://www.martinfowler.com/bliki/TwoHardThings.html" target="_blank" rel="noopener">is difficult</a>.

Also, what if I want to completely avoid exposing my admin panel url? I'm a paranoid maniac, absolutely afraid of hackers and don't want <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener">to be pwned</a>. And I'm also too lazy to do nasty tricks like ip whitelisting or VPNs.

So what's the solution? I said it already: use plain old html files. Make everything static and easier.

Ok, that won't be a silver bullet but bear with me: I'm talking about a very specific niche of websites, with content that doesn't change by user and with little to no forms. These should be static already but you know better than me that installing WordPress is incredibly easy and cheap.

So this is why I've started working on <a href="https://github.com/mizrael/statifier" target="_blank" rel="noopener">Statifier</a>! For now it is a simple NodeJs tool that will crawl your website, download pages and assets and perform some very simple string replacements. Nothing else.

But it works. With some hiccups, but it works. Still doubting? Take a <a href="https://testdg.azurewebsites.net/" target="_blank" rel="noopener">look here</a>, you won't be disappointed.

Yes, I could have used an existing tool like&nbsp;<a href="https://getgrav.org/" target="_blank" rel="noopener">Grav</a> or even better, <a href="https://jekyllrb.com/" target="_blank" rel="noopener">Jekyll</a>, but why give up on the amazing WP admin panel?

&nbsp;

<div class="post-details-footer-widgets">
</div>