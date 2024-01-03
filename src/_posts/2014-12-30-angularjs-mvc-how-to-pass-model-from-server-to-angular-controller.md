---
id: 593
title: 'AngularJS + MVC : how to pass model from server to Angular controller'
date: 2014-12-30T22:42:29-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=593
permalink: /angularjs-mvc-how-to-pass-model-from-server-to-angular-controller/
videourl:
  - ""
dsq_thread_id:
  - "5139811496"
image: /assets/uploads/2014/09/angularjs.png
categories:
  - .NET
  - AngularJS
  - ASP.NET
  - Javascript
  - MVC
  - Programming
---
Here&#8217;s a quick tip on how to pass a complex model from server side to an AngularJS controller.  
The idea is to serialize the model to json (I am using the majestic <a title="Json.NET" href="https://www.nuget.org/packages/Newtonsoft.Json/" target="_blank">Newtonsoft </a>library for that), store it into a javascript variable and then <a title="AngularJS providers" href="https://docs.angularjs.org/guide/providers" target="_blank">create a provider</a> with it on the AngularJS application that will be injected in the controller.

Here&#8217;s the controller code:

[csharp]

myApp.controller(&#8216;myController&#8217;, [&#8216;$scope&#8217;, &#8216;viewModel&#8217;,  
   function ($scope,  viewModel) {  
        $scope.viewModel = viewModel;  
   }]  
);

[/csharp]

and here&#8217;s the MVC View

[csharp]  
<div ng-controller="myController"> &#8230;. </div>  
<script type="text/javascript">  
var model = @Html.Raw(Newtonsoft.Json.JsonConvert.SerializeObject(this.Model));  
myApp.value("viewModel", model);  
</script>  
[/csharp]

<div class="post-details-footer-widgets">
</div>