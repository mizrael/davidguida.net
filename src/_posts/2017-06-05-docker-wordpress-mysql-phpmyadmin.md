---
description: >
  In this article I'll show you how to create a docker container for a Wordpress website, MySql and phpMyAdmin using docker-compose.
id: 6300
title: How to create a docker container for a WordPress website
date: 2017-06-05T10:46:16-04:00
author: David Guida
excerpt: "In this article I'll show you how to create a docker container for a Wordpress website, MySql and phpMyAdmin using docker-compose."
layout: post
guid: https://www.davidguida.net/?p=6300
permalink: /docker-wordpress-mysql-phpmyadmin/
dsq_thread_id:
  - "5881607012"
image: /assets/uploads/2017/06/dockerPress.png
categories:
  - Docker
  - Programming
  - Wordpress
---
This is my first post on Docker so please be gentle. I am going to start with something easy: how to create a Docker container to host a WordPress website.

One word before we start: **don't** do this on a production server! There are more rules and checks you have to do, this is just an introduction, good for a dev/demo environment.

So, I assume you already have **docker** and **docker-compose** installed on your system, but in case you don't, there's an excellent documentation on the <a href="https://docs.docker.com/compose/install/" target="_blank" rel="noopener noreferrer">Docker's website</a>.

The first step is to fire up the terminal, create a folder and save the contents of <a href="https://gist.github.com/mizrael/7b3f56033748ad6fa1c6a2ad63e957ef" target="_blank" rel="noopener noreferrer">this gist</a> to a file named&nbsp;**docker-compose.yml** .

Next step is to fire up&nbsp;the containers with this command:

> docker-compose up -d

the **-d** is the "detached mode", allows you to run the containers in background and keep using the terminal.

Now, if you take a look at our Compose configuration, on line 22 we have specified an host address for the mysql instance. It might be already correct, but better check.&nbsp;  
From the command line, first run

> docker ps

to get the list of running containers. You should see something like this:

<div id="attachment_6305" style="width: 798px" class="wp-caption aligncenter">
  <a href="/assets/uploads/2017/06/docker-containers-list.png?ssl=1" target="_blank" rel="noopener noreferrer"><img aria-describedby="caption-attachment-6305" loading="lazy" class="wp-image-6305 size-large" src="/assets/uploads/2017/06/docker-containers-list.png?resize=788%2C68&#038;ssl=1" alt="using docker ps to get the list of containers" width="788" height="68" srcset="/assets/uploads/2017/06/docker-containers-list.png?resize=1024%2C89&ssl=1 1024w, /assets/uploads/2017/06/docker-containers-list.png?resize=300%2C26&ssl=1 300w, /assets/uploads/2017/06/docker-containers-list.png?resize=768%2C67&ssl=1 768w, /assets/uploads/2017/06/docker-containers-list.png?resize=788%2C68&ssl=1 788w, /assets/uploads/2017/06/docker-containers-list.png?w=1095&ssl=1 1095w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a>
  
  <p id="caption-attachment-6305" class="wp-caption-text">
    using docker ps to get the list of containers
  </p>
</div>

Grab the name of the db container and run

> docker inspect&nbsp;<span class="s1">wptestfull_mysql_1</span>

You will get a big JSON object exposing the status and all the available properties of the container. At the end you should get this:

<div id="attachment_6307" style="width: 710px" class="wp-caption aligncenter">
  <a href="/assets/uploads/2017/06/docker-container-inspect-ip-address.png?ssl=1" target="_blank" rel="noopener noreferrer"><img aria-describedby="caption-attachment-6307" loading="lazy" class="wp-image-6307 size-full" src="/assets/uploads/2017/06/docker-container-inspect-ip-address.png?resize=700%2C294&#038;ssl=1" alt="using docker inspect to get the container ip address" width="700" height="294" srcset="/assets/uploads/2017/06/docker-container-inspect-ip-address.png?w=700&ssl=1 700w, /assets/uploads/2017/06/docker-container-inspect-ip-address.png?resize=300%2C126&ssl=1 300w" sizes="(max-width: 700px) 100vw, 700px" data-recalc-dims="1" /></a>
  
  <p id="caption-attachment-6307" class="wp-caption-text">
    using docker inspect to get the container ip address
  </p>
</div>

there you go, our IPAddress. Copy it into the docker-compose file and run again&nbsp;docker-compose up -d .

Now we need to create a db user. Open your browser and go to&nbsp;**http://localhost:8181/** , you will see the phpMyAdmin interface. Create the user, the db and set the allowed hosts to **%** . This way we will allow connections from every address. Again: **don't do this on production!**

Now all you have to do is to load&nbsp;**http://localhost:8080/** and setup your WordPress instance 🙂

Next time: what if we want more than one website?

<div class="post-details-footer-widgets">
</div>