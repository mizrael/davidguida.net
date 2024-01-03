---
id: 142
title: Mutual SSL + ASP.net + IIS7
date: 2011-05-09T15:19:06-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=142
permalink: /mutual-ssl-asp-net-iis7/
dsq_thread_id:
  - "5263804922"
categories:
  - ASP.NET
  - Programming
---
This was very, very, **VERY** nasty. Took me 1 entire week (even with the support of our ITs).

As usual, at the end we discovered it wasn't that hard anyway&#8230;. from an IT point of view, all you have to do is:

  1. Get an SSL certificate with client/server extended usage
  2. Install it on IIS7 on your website
  3. Give the access to the certificate to the current website AppPool user using **[winhttpcertcfg](http://www.microsoft.com/downloads/en/details.aspx?familyid=c42e27ac-3409-40e9-8667-c748e422833f&displaylang=en) : winhttpcertcfg.exe -g -c LOCAL\_MACHINEMY -s "[MY\_CERTIFICATE\_CN]" -a "[APP\_POOL_USER]"**

From a developer point of view instead, you just create a normal webservice, then load the certificate from the X509Store and add it to the **ClientCertificates** collection on the webserver proxy.

This is part of the code I use to get the certificate from the store:

`public static X509Certificate2 LoadCertificateFromStore(string commonName)<br />
{<br />
X509Certificate2 retVal = null;<br />
var store = new X509Store(StoreLocation.LocalMachine);<br />
store.Open(OpenFlags.ReadOnly);<br />
var certColl = store.Certificates.Find(X509FindType.FindBySubjectName, commonName, true);`

if (null != certColl && 0 != certColl.Count)  
retVal = certColl[0];  
if(null == retVal)  
{  
foreach (var cert in store.Certificates)  
{  
if (cert.Subject.ToLower().Contains(commonName))  
{  
retVal = cert;  
break;  
}  
}  
}  
store.Close();  
return retVal;  
}

<div class="post-details-footer-widgets">
</div>