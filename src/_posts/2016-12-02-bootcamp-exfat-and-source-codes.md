---
description: >
  Sometimes having a macbook pro with a secondary hdd and an exFAT partition might almost cause you an heart attack if you use Bootcamp.
id: 6230
title: How I almost lost all my source codes.
date: 2016-12-02T21:34:13-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6230
permalink: /bootcamp-exfat-and-source-codes/
dsq_thread_id:
  - "5350127799"
image: /assets/uploads/2016/12/recupero-dati1-890x395_c.jpg
categories:
  - Git
  - Ramblings
  - Technology
---
Now sit down my dear and listen carefully, I'll tell you a story about how I almost lost all my sources.  
A while ago, I decided to give my marvelous Macbook pro mid-2013 an upgrade. I searched online a little bit and at the end I bought an SSD drive, a <a href="http://www.corsair.com/it-it/force-series-le-240gb-sata-3-6gbs-ssd" target="_blank">Corsair Force LE 240GB</a>.&nbsp;

"But 240 is not enough!" you might say. &nbsp;"You're right". It's not enough.&nbsp;

I was not using the DVD drive at all so after a brief research, I found the right adapter and replaced it with the old 500gb Apple&nbsp;disk , leaving space for my shiny new SSD.

Everything was perfect,&nbsp;El Capitan was lightning fast, everybody was happy. But then came the day that I needed Windows. So Bootcamp joined us and new partitions started to appear.

180GB OSX Extended and 60GB NTFS on the SSD.  
450GB&nbsp;OSX Extended and 50GB exFAT on the ol' Apple&nbsp;disk.

Again, everything was perfect, El Capitan was still lightning fast, Windows 10 was running fine, everybody was happy.

I was running Windows from the SSD and&nbsp;all the programs were installed on the other drive, together with all the source codes. Yes, before you ask, I have a <a href="https://bitbucket.org/mizrael/" target="_blank">Bitbucket account</a>. Yeah, a <a href="https://github.com/mizrael/" target="_blank">Github one</a> too, but Bitbucket gives you&nbsp;private repos for free.

However, after a while, I realized that when Win10 goes to sleep mode some strange misbehavior appears, in the form of weird SMART messages when turning on MacOs.

Long story short, one day I rebooted from Win to MacOs and puff! the partition with all the sources was gone. Disappeared. An&nbsp;empty, dark and cold space.  
I almost got an heart attack.

Disk Util, Disk Warrior, mysterious command line tools, I tried everything, nothing worked. After hours of researches and curses, I fired up&nbsp;Windows and did the only thing I had left:

> chkdsk e: /f

That saved my day.

Moral of the story?&nbsp;Always backup your source codes, even the most insignificant snippets.

<div class="post-details-footer-widgets">
</div>