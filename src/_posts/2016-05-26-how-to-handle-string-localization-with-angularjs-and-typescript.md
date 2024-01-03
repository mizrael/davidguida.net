---
id: 6142
title: How to handle string localization with AngularJS and Typescript
date: 2016-05-26T10:52:17-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6142
permalink: /how-to-handle-string-localization-with-angularjs-and-typescript/
dsq_thread_id:
  - "5139530431"
image: /assets/uploads/2014/09/angularjs.png
categories:
  - AngularJS
  - Javascript
  - Programming
  - Typescript
---
As many of you may already know, most of the times we developers write something is because we feel the need to create. Not because the current project really requires it, but just because we feel the urge to write some code, patch something up. Especially when the project is reeeeally boring.

In my case I needed a quick and dirty way to localize strings in my AngularJS app. I know there are plenty of standard and non-standard ways to do this but this time I wanted a way to escape the boredom.

What I came up with is a simple Service that looks like this:

<div id="wrap_githubgist6059c148fd7f401146943746f59a45ec" style="width:100%">
</div>

(yes, I&#8217;m using Typescript)

The <a href="https://github.com/mizrael/angular-localization/blob/master/src/services/LanguageService.ts" target="_blank">implementation</a> takes care of reading a very simple JSON file containing all the available cultures and the respective labels. Something like this:

<div id="wrap_githubgist50d7ab5e63ad0771d604e284cf4470b3" style="width:100%">
</div>

The example app itself is very simple, there are just two controllers:

<a href="https://github.com/mizrael/angular-localization/blob/master/src/controllers/LanguageController.ts" target="_blank">LanguageController</a> acts as a simple wrapper over the ILanguageService, exposing the list of available cultures and allowing get/set for the current one. On the UI there&#8217;s just a dropdown with the cultures.

<a href="https://github.com/mizrael/angular-localization/blob/master/src/controllers/MainController.ts" target="_blank">MainController</a> instead takes care of requesting the labels from ILanguageService and $watch-ing it&#8217;s currentCulture property. When an update is detected (eg. something changed on LanguageController), the new labels are fetched from the service.

Easy huh?

<div class="post-details-footer-widgets">
</div>