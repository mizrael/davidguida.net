---
id: 101
title: Adventures in Com-Land
date: 2010-08-19T19:32:44-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=101
permalink: /adventures-in-com-land/
videourl:
  - ""
image: /assets/uploads/2014/08/computerprogramming_8406403-655x280.jpg
categories:
  - .NET
  - Programming
---
Using serial ports in .NET is very, very easy. You just have to know how to initialize it and you're good. Well actually you should know what to do with the incoming data, but this is another story 😀

<div>
  In C# all you have to do is to include the namespace System.IO.Ports and then do something like this:
</div>

`SerialPort comPort = new SerialPort("COM1", 19200, Parity.None, 8, StopBits.One); comPort.Open();`

Of course it's a good habit to check for exceptions (for example, if the port is already in use&#8230;well you get the point).

Then to write some data, you just have to do:

`string myMessage = ".............";<br />
comPort.Write(myMessage);`

The SerialPort class exposes two events to handle fail/win cases after a write, DataReceived and ErrorReceived.

That's all!

Obviously, don't forget to close and dispose the port at the end of your program:

`if (comPort.IsOpen)<br />
comPort.Close();<br />
comPort.Dispose();<br />
comPort = null;  `

<div class="post-details-footer-widgets">
</div>