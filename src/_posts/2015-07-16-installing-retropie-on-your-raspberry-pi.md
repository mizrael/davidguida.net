---
id: 6051
title: Installing RetroPie on your Raspberry Pi
date: 2015-07-16T11:29:32-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6051
permalink: /installing-retropie-on-your-raspberry-pi/
videourl:
  - ""
dsq_thread_id:
  - "5176369163"
image: /assets/uploads/2015/07/raspberrypi.jpg
categories:
  - Electronics
  - Gaming
  - Ramblings
  - Raspberry Pi
  - Technology
---
I have an &#8220;old&#8221; Raspberry Pi model A collecting dust on my desk.

&#8220;What can I do with you?&#8221;, I asked him one day.  
&#8220;I want to be beautiful&#8221;, he answered.  
&#8220;You will be my precious&#8230;&#8221;

And this is how I started working on what will (one day, eventually) became a wonderful home-made arcade cabinet 😀

First thing I have done is installing the software, so after some googling I found this nice linux distro called &#8220;<a href="http://blog.petrockblock.com/retropie/" target="_blank">RetroPie</a>&#8221; . In order to have it up and running, as it&#8217;s usual in the linux world, there are some steps that need to be followed&#8230;..

Assuming you have <a href="http://blog.petrockblock.com/retropie/retropie-downloads/" target="_blank">downloaded the RetroPie img</a> and copied it on a SD, the first step is expanding the filesystem to the entire SD:

<pre><code class="prettyprint lang-bash prettyprinted">sudo raspi-config</code></pre>

you need to reboot after that:

<pre><code class="prettyprint lang-bash prettyprinted">sudo reboot</code></pre>

then make sure everything is updated:

<pre><code class="prettyprint lang-bash prettyprinted">&lt;span class="pln">sudo apt&lt;/span>&lt;span class="pun">-&lt;/span>&lt;span class="pln">get update
sudo apt&lt;/span>&lt;span class="pun">-&lt;/span>&lt;span class="pln">get upgrade
sudo rpi&lt;/span>&lt;span class="pun">-&lt;/span>&lt;span class="pln">update
&lt;/span></code></pre>

next step is to run the Retropie setup, so go to the _/home/pi/RetroPie-Setup/_ folder and run

<pre><code class="prettyprint lang-bash prettyprinted">sudo ./retropie_setup.sh</code></pre>

at this point you may choose to install the binaries or the sources. I guess it all depends on how much time you have at disposal 😀

now you&#8217;re almost done, all you have to do is copying the rom files to the SD and start playing! There&#8217;s a <a href="https://github.com/RetroPie/RetroPie-Setup/wiki/How-to-get-ROMs-on-the-SD-card" target="_blank">nice guide</a> about it, just pick the method you like most 🙂

<div class="post-details-footer-widgets">
</div>