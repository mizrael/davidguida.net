---
id: 6244
title: 'Yet another "How to use SASS with WordPress" guide'
date: 2016-12-07T12:12:00-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6244
permalink: /yet-another-how-to-use-sass-with-wordpress-guide/
dsq_thread_id:
  - "5362025613"
image: /assets/uploads/2016/12/sass-plus-wordpress.png
categories:
  - Git
  - Programming
  - SASS
  - Wordpress
---
Yes, it's another one. If you lookup on Google there are are tons of articles about how to use SASS in a WordPress theme, so why writing another one?

Well, the answer is simple. Because I can. Because I am bored. Because I'm going to give you the sources with no fuss.

First of all, take a look at <a href="https://github.com/mizrael/wp_sass" target="_blank">this repo</a>.

As you can easily notice, it contains part of the standard WordPress folder structure and a bunch of other files. And trust me, I am not that kind of guy who adds files for nothing.

The main idea here is to have <a href="http://gulpjs.com/" target="_blank">Gulp</a>&nbsp;search and watch for our .scss files in the child theme folder and build the final style.css files every time something changes. Nice isn't it?

Before we start we need of course to&nbsp;install some dependencies. Fire up the Terminal and run:

> sudo npm install -g gulp

just to make sure we have Gulp installed globally (that's why you need sudo for that). Then run:

> npm install gulp gulp-sass gulp-clean gulp-autoprefixer -save-dev

&nbsp;We'll discuss about those packages later.

&nbsp;  
[<img loading="lazy" class="alignleft wp-image-6247 size-full" src="/assets/uploads/2016/12/SASS_folder_structure.png?resize=322%2C571" width="322" height="571" srcset="/assets/uploads/2016/12/SASS_folder_structure.png?w=322&ssl=1 322w, /assets/uploads/2016/12/SASS_folder_structure.png?resize=169%2C300&ssl=1 169w" sizes="(max-width: 322px) 100vw, 322px" data-recalc-dims="1" />](/assets/uploads/2016/12/SASS_folder_structure.png)I have added a "sass" folder inside "twentysixteen-child" that contains all our SASS&nbsp;files.

The style.scss file is our main entry point and as you can see <a href="https://github.com/mizrael/wp_sass/blob/master/wp-content/themes/twentysixteen-child/sass/style.scss" target="_blank">from the repo</a>, contains all the boilerplate code required by WordPress to discover the child theme.

I tend to include&nbsp;a \_base.scss file that contains&nbsp;all the basic dependencies like variables and mixins. Then in style.scss I append all the page templates, like \_home.scss in our small example.

&nbsp;

&nbsp;

&nbsp;

Now let's talk about the <a href="https://github.com/mizrael/wp_sass/blob/master/gulpfile.js" target="_blank">Gulp configuration file</a>. The first lines contain the dependencies we need in our tasks, gulp, sass, clean and autoprefixer (more on this later).

Then we have the paths we want our SASS compiler to run on. As you can see I am using the child theme path as a base concatenated to the others.

After this we can start with the tasks. The first one is responsible of removing&nbsp;all the files from the previous build (basically just one, style.css ).

Then we have the actual SASS compilation. I&nbsp;am passing to the sass() function an empty configuration object, but there are several options available, for example you may want to compress&nbsp;the result.

The "postprocess" task is responsible of every post-compilation step we may want to perform on the output css file. In our case, I am using a very useful library named <a href="https://github.com/postcss/autoprefixer" target="_blank">Autoprefixer</a>&nbsp;that adds all the vendor-specific prefixes. If you're interested, there's a nice article on CSS-tricks.com, you can read it&nbsp;<a href="https://css-tricks.com/autoprefixer/" target="_blank">here</a>.

The last bit is the "watch" task. This is interesting: basically it tells Gulp to monitor our /sass/ folder&nbsp;and every time there's a change, to run again the "build" task. That's it!

Now all you have to do, if you're using Visual Studio Code like me, is to hit cmd+shift+p &nbsp;and type "Configure Task Runner":

[<img loading="lazy" class="wp-image-6251 size-full aligncenter" src="/assets/uploads/2016/12/configure_task_tunner.png?resize=655%2C138" width="655" height="138" srcset="/assets/uploads/2016/12/configure_task_tunner.png?w=655&ssl=1 655w, /assets/uploads/2016/12/configure_task_tunner.png?resize=300%2C63&ssl=1 300w" sizes="(max-width: 655px) 100vw, 655px" data-recalc-dims="1" />](/assets/uploads/2016/12/configure_task_tunner.png)

then pick Gulp as your default Task Runner. If you take a look at the <a href="https://github.com/mizrael/wp_sass/blob/master/.vscode/tasks.json" target="_blank">tasks.json file</a> in the repo, you will notice that&nbsp;I have added some more custom configuration just to instruct VS Code to use&nbsp;the "default" task as&nbsp;main entrypoint.

That's it!

<div class="post-details-footer-widgets">
</div>