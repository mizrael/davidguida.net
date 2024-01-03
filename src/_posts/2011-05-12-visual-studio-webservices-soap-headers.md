---
id: 149
title: Visual Studio + Webservices + SOAP Headers
date: 2011-05-12T15:25:36-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=149
permalink: /visual-studio-webservices-soap-headers/
dsq_thread_id:
  - "5451690462"
categories:
  - ASP.NET
  - Programming
  - Webservices
---
<div>
  <p>
    Suppose you have to consume a Webservice that requires you to provide a custom header. If you generate automatically the proxy with Visual Studio, you'll soon discover that there's no way to add an header or to access the SOAP request.<br /> Ok, here's what you have to do:
  </p>
  
  <p>
    1) download the <a href="http://www.microsoft.com/downloads/en/details.aspx?FamilyID=018a09fd-3a74-43c5-8ec1-8d789091255d">Web Services Enhancements 3.0</a> and reference microsoft.web.services3.dll in your project
  </p>
  
  <p>
    2) change the base class of your proxy from <code>&lt;strong>System.Web.Services.Protocols.SoapHttpClientProtocol&lt;/strong> </code>to <code>&lt;strong>Microsoft.Web.Services3.WebServicesClientProtocol&lt;/strong></code>
  </p>
  
  <p>
    3) Use the newly exposed <a href="http://msdn.microsoft.com/en-us/library/microsoft.web.services3.soapcontext.aspx">SoapContext </a>property to add your custom headers and/or security tokens
  </p>
  
  <p>
    Just keep in mind that if you ask Visual Studio to generate again the proxy, you'll loose the changes&#8230;
  </p>
</div>

<div class="post-details-footer-widgets">
</div>