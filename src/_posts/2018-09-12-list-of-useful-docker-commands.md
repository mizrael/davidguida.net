---
description: >
  Here's a short list of useful Docker commands I've been using in my experiments these days. Hope you find it useful :)
id: 6497
title: List of useful Docker commands
date: 2018-09-12T11:28:22-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6497
permalink: /list-of-useful-docker-commands/
image: /assets/uploads/2018/09/docker.jpg
categories:
  - Docker
  - Microservices
  - Programming
  - Ramblings
---
In the last few weeks I've been doing several experiments with Docker, just trying to grasp the main idea and maybe even come up with something useful.

As often happens with tools these days, there's an entire world of command line tools that you should learn. 

OR you can just be lazy as me and keep a list of the most common ones 🙂

I'll be updating this list from time to time, just to keep track of what I've used so far and be a quick reference for my sloppy memory. 

<pre class="wp-block-code"><code>docker login [HOST] # in case you need auth to pull or push images</code></pre>

<pre class="wp-block-code"><code>docker build -t [TAG]</code></pre>

<pre class="wp-block-code"><code>docker images # shows a list of the local images along with the size</code></pre>

<pre class="wp-block-code"><code>docker push [TAG]</code></pre>

<pre class="wp-block-code"><code>docker rm $(docker ps -a -q) # this will remove ALL your containers. Be careful!</code></pre>

<pre class="wp-block-code"><code>docker system prune -a # this will remove ALL your images and containers. Very useful when you run low on space, but be careful!</code></pre>

The next command will display the Docker daemon logs, extremely useful when you don't know what happened (basically me most of the time) and you're looking for an answer, even if obscure. 

It depends on the OS you're running on:

  * Ubuntu (old using upstart ) - `/var/log/upstart/docker.log`
  * Ubuntu (new using systemd ) - `sudo journalctl -fu docker.service`
  * Boot2Docker - `/var/log/docker.log`
  * Debian GNU/Linux - `/var/log/daemon.log`
  * CentOS - `/var/log/daemon.log | grep docker`
  * CoreOS - `journalctl -u docker.service`
  * Fedora - `journalctl -u docker.service`
  * Red Hat Enterprise Linux Server - `/var/log/messages | grep docker`
  * OpenSuSE - `journalctl -u docker.service`
  * OSX - `~/Library/Containers/com.docker.docker/Data/com.docker.driver.amd64-linux/log/d‌​ocker.log`
  * Windows - `Get-EventLog -LogName Application -Source Docker -After (Get-Date).AddMinutes(-5) | Sort-Object Time`, as mentioned [here](https://docs.microsoft.com/en-us/virtualization/windowscontainers/troubleshooting#finding-logs).

(thanks, <a href="https://stackoverflow.com/a/30970134/3279163" target="_blank">Scott</a>)

<div class="post-details-footer-widgets">
</div>