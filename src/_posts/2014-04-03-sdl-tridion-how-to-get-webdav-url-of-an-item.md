---
id: 425
title: 'SDL Tridion: how to get WebDAV url of an item'
date: 2014-04-03T15:40:44-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=425
permalink: /sdl-tridion-how-to-get-webdav-url-of-an-item/
dsq_thread_id:
  - "5139530507"
categories:
  - SDL Tridion
---
Suppose you have to <a title="SDL Tridion: how to reference a parameter schema" href="http://www.davidguida.net/sdl-tridion-how-to-reference-a-parameter-schema/" target="_blank">reference an item </a>and you don't want to use the id. Or maybe you just need the full path. One simple way is to edit the item, go  to the Info tab and get it's location:  
<a href="/assets/uploads/2014/04/webdav.jpg" target="_blank"><img loading="lazy" class="alignnone size-medium wp-image-426" alt="how to get WebDAV url of an item" src="/assets/uploads/2014/04/webdav-300x110.jpg?resize=300%2C110" width="300" height="110" srcset="/assets/uploads/2014/04/webdav.jpg?resize=300%2C110&ssl=1 300w, /assets/uploads/2014/04/webdav.jpg?w=791&ssl=1 791w" sizes="(max-width: 300px) 100vw, 300px" data-recalc-dims="1" /></a>

you should have something like this:

[csharp]\910 Design HTML\Building Blocks\System\Templates\Assemblies[/csharp]

just add /webdav/ at the beginning, revert the slashes and add the filename along with the extension:

[csharp]/webdav/910 Design HTML/Building Blocks/System/Templates/Assemblies/Page Revision Date.xsd[/csharp]

<div class="post-details-footer-widgets">
</div>