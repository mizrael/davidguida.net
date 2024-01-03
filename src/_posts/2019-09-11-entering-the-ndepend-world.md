---
description: >
  I started using NDepend, the famous static code analysis tool for .NET after its creator, Patrick Smacchia, contacted me and offered a pro license.
id: 6758
title: Entering the NDepend world
date: 2019-09-11T17:22:49-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6758
permalink: /entering-the-ndepend-world/
image: /assets/uploads/2019/09/NDepend.png
categories:
  - .NET
  - ASP.NET
  - Programming
  - Software Architecture
tags:
  - .NET Core
  - programming
---
Today something unexpected happened. I got contacted by <a rel="noreferrer noopener" aria-label="Patrick Smacchia (opens in a new tab)" href="https://www.linkedin.com/in/patrick-smacchia-b0123110/" target="_blank">Patrick Smacchia</a>, the creator of <a href="https://www.ndepend.com/" target="_blank" rel="noreferrer noopener" aria-label=" (opens in a new tab)">NDepend</a>. He somehow found me online and offered a pro license 😀

I have never used **NDepend** so obviously I was very curious. In my daily job at Dell we obviously make an extensive use of <a rel="noreferrer noopener" aria-label="static code analysis  (opens in a new tab)" href="https://en.wikipedia.org/wiki/Static_program_analysis" target="_blank"><strong>static code analysis </strong></a>tools as part of our build pipelines. We also run them a bunch of times on our machine, but that's not a mandatory step.

#### These tools are getting exceptionally good and they provide an enormous value on every codebase. Period. 

They can easily assist spotting nasty issues that could even get past test pipelines. Moreover, some cases they can give **very good refactoring suggestions**, helping out cleaning the code.

So, going back to **NDepend**, it's one of the best .NET analysis tools on the market. Check out the website for the <a href="https://www.ndepend.com/features/" target="_blank" rel="noreferrer noopener" aria-label="list of features (opens in a new tab)">list of features</a>, the list is definitely impressive. 

The installation was pretty straightforward, no issues at all. Just follow the steps shown in the <a rel="noreferrer noopener" aria-label=" Getting Started (opens in a new tab)" href="https://www.ndepend.com/docs/getting-started-with-ndepend" target="_blank">Getting Started</a> section.

I installed the VS2019 integration and then loaded one of the projects I'm working on these days. It contains 4 class libraries and the relative test projects. Launched the **NDepend** analysis, filtered out the tests (with the **"-test"** filter) and waited few seconds for the process to complete.<figure class="wp-block-image">

<a href="https://www.davidguida.net/?attachment_id=6760" target="_blank" rel="noreferrer noopener"><img loading="lazy" width="2226" height="1271" src="/assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?fit=788%2C450&ssl=1" alt="NDepend dashboard" class="wp-image-6760" srcset="/assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?w=2226&ssl=1 2226w, /assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?resize=300%2C171&ssl=1 300w, /assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?resize=768%2C439&ssl=1 768w, /assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?resize=1024%2C585&ssl=1 1024w, /assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?resize=788%2C450&ssl=1 788w, /assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?w=1576&ssl=1 1576w" sizes="(max-width: 788px) 100vw, 788px" /></a></figure> 

Now, I have to admit that big dashboards scare me. I'm not particularly good at reading stats and making immediately sense out of them. Usually takes me some time to get used to the results format. 

But in this case almost everything was clear…also the results were quite nice and that definitely cheered me up 😀

All in all, I'm quite happy with **NDepend** . After less than 30 minutes I was already updating my codebase and committing changes based on the suggestions.

Of course I just scratched the surface, there are tons of features that I need to explore. I haven't even used the Coverage tool yet.

I think I'm definitely going to add it to my daily routine. I'll blog more in the next days as soon as I get more "intimate" with it 🙂

<div class="post-details-footer-widgets">
</div>