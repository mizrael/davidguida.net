---
id: 145
title: WCF + Console Application
date: 2011-05-12T15:20:36-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=145
permalink: /wcf-console-application/
categories:
  - Programming
  - WCF
---
Suppose you have a nice Console Application. Suppose you want to host a WCF service. And suppose you want to create a fancy Silverlight app that consumes this WCF service.

You&#8217;ll soon discover that something isn&#8217;t working as expected&#8230;long story short, the client app is looking for a ClientAccessPolicy.xml file. And why in the world shouldn&#8217;t we provide it?  
Here&#8217;s what you have to do:

1) Create another WCF Service, call it **CrossDomainService**

2) Add this method:

`<br />
[OperationContract]<br />
[WebGet(UriTemplate = "ClientAccessPolicy.xml")]<br />
public Message GetClientAccessPolicy()<br />
{<br />
using (var filestream = File.Open(@"ClientAccessPolicy.xml", FileMode.Open))<br />
{<br />
var buff = new byte[filestream.Length];<br />
filestream.Read(buff, 0, (int)filestream.Length);<br />
filestream.Close();<br />
var stream = new MemoryStream(buff);<br />
return Message.CreateMessage(MessageVersion.None, "", XmlReader.Create(stream));<br />
}<br />
}<br />
`  
3) Add a ClientAccessPolicy.xml file to your project (you may find thousand of examples online&#8230;look [at this](http://msdn.microsoft.com/en-us/library/cc197955%28v=vs.95%29.aspx) maybe)

4) Add this to your app.config:

`<behaviors><br />
<endpointBehaviors><br />
<behavior name="CrossDomainServiceBehavior"><br />
<webHttp/><br />
</behavior><br />
</endpointBehaviors><br />
</behaviors><br />
` `<services><br />
<service name="CrossDomainService"><br />
<endpoint address="" behaviorConfiguration="CrossDomainServiceBehavior"<br />
binding="webHttpBinding" contract="CrossDomainService" /><br />
<host><br />
<baseAddresses><br />
<add baseAddress="http://localhost:12345/" /><br />
</baseAddresses><br />
</host><br />
</service><br />
</services>`

Obviously make sure that the baseAddress has the same root as the WCF Service you want to expose at first 🙂

<div class="post-details-footer-widgets">
</div>