---
id: 6170
title: Building an Angular 2 + Typescript application template
date: 2016-08-25T15:59:28-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6170
permalink: /building-an-angular-2-typescript-application-template/
dsq_thread_id:
  - "5146071453"
image: /assets/uploads/2016/08/angular2_typescript.png
categories:
  - AngularJS
  - Git
  - Javascript
  - Programming
  - Typescript
---
<a href="http://www.davidguida.net/how-to-setup-your-environment-to-write-typescript-client-applications/" target="_blank">Last time</a> I showed you a way to create a Typescript application template. Now we can use that as a starting point for an Angular 2 application.

As usual, I have created a <a href="https://github.com/mizrael/angularjs2-typescript" target="_blank">GitHub repo</a> with the necessary sources and the list of steps to perform. At the end of the process, we'll get our friendly web server showing a nice "lorem ipsum" coming from an <a href="http://learnangular2.com/components/" target="_blank">Angular2 Component</a> .

Also in this case the core of the system is <a href="https://github.com/mizrael/angularjs2-typescript/blob/master/gulpfile.js" target="_blank">gulpfile.js</a> which exposes a bunch of tasks:

  1. &#8216;clean' : as the name may suggest, this task is used to clear the www folder from all the external libraries, the transpiled .js files and sourcemaps
  2. &#8216;libs': this will copy the depencencies to a specific folder
  3. &#8216;build': this will execute &#8216;clean' and &#8216;libs' and then transpile the .ts files
  4. &#8216;default': will execute &#8216;build', fire up the webserver and watch the .ts files for changes

Worth of mention is also the <a href="https://github.com/mizrael/angularjs2-typescript/blob/master/www/index.html" target="_blank">index.html</a> which contains the SystemJs initialization code.

Enjoy!

<div class="post-details-footer-widgets">
</div>