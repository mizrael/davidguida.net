---
description: >
  Yeah, I'm not getting crazy. It is 100% possible to replace your WordPress theme with a Blazor Webassembly application. Find out how!
id: 7843
title: 'Write a WordPress blog with&#8230;Blazor!'
date: 2020-11-18T20:14:10-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7843
permalink: /write-a-wordpress-blog-with-blazor/
image: /assets/uploads/2020/11/blazor-wordpress.jpg
categories:
  - .NET
  - ASP.NET
  - Blazor
  - NuGet
tags:
  - Blazor
  - GitHub Pages
  - WordPress
---
Yeah, I'm not getting crazy. It is 100% possible to replace your **WordPress** theme with a **Blazor Webassembly** application.

How? Well, it's not that hard actually. It's been a while now since WordPress has started exposing a quite nice <a href="https://developer.wordpress.org/rest-api/" target="_blank" rel="noreferrer noopener">REST API</a>. The first draft was added with <a href="https://wordpress.org/support/wordpress-version/version-4-4/#for-developers" target="_blank" rel="noreferrer noopener">version 4.4</a>, but it's with <a href="https://wordpress.org/support/wordpress-version/version-4-7/#rest-api-content-endpoints" target="_blank" rel="noreferrer noopener">version 4.7</a> that it gained full momentum.

The API itself is definitely easy to use. The base endpoint looks something like "_**yoursite.com/wp-json/wp/v2**_".

#### From that you can start managing _<a href="https://wordpress.org/news/wp-json/wp/v2/posts/" target="_blank" rel="noreferrer noopener">posts</a>_, _<a href="https://wordpress.org/news/wp-json/wp/v2/users/" target="_blank" rel="noreferrer noopener">users</a>, <a href="https://wordpress.org/news/wp-json/wp/v2/users/" target="_blank" rel="noreferrer noopener">comments</a>_&#8230;well you got the idea.

This opens the door to a wide range of scenarios, for example, we could use WordPress as a <a href="https://en.wikipedia.org/wiki/Headless_content_management_system" target="_blank" rel="noreferrer noopener">headless CMS</a> and write multiple frontends based on our needs. Mobile apps, SPAs, PWAs and so on.

Just to showcase how easy it is, let's see how we can quickly write a frontend blogging app using **Blazor**.

Now, <a href="https://en.wikipedia.org/wiki/Cross-origin_resource_sharing" target="_blank" rel="noreferrer noopener">CORS </a>should be enabled by default. If it isn't, a quick search on google should give you <a href="https://www.google.com/search?q=wordpress+rest+api+enable+cors" target="_blank" rel="noreferrer noopener">the answer</a>. For the sake of the exercise, let's suppose it is, so we can safely use **Blazor** in **<a href="https://docs.microsoft.com/en-us/aspnet/core/blazor/hosting-models?view=aspnetcore-5.0&WT.mc_id=DOP-MVP-5003878#blazor-webassembly" target="_blank" rel="noreferrer noopener">Webassembly </a>**mode.

Once we've created our project, the next step is to add a reference to the <a href="https://github.com/wp-net/WordPressPCL" target="_blank" rel="noreferrer noopener">WordPressPCL </a>Nuget library. It's a handy project, that will spare us the time to write the API client ourselves.

Once it's installed, we can register the client on the Composition Root in the <a href="https://github.com/mizrael/BlazorWPBlog/blob/develop/src/BlazorWPBlog.UI/Program.cs" target="_blank" rel="noreferrer noopener">Program.cs</a> file:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">var wpApiEndpoint = builder.Configuration["WP_Endpoint"];
var client = new WordPressClient(wpApiEndpoint);
builder.Services.AddSingleton(client);</pre>

Now, we're basically done! Every time we want to, for example, read posts or anything, all we have to do is inject the <a href="https://github.com/wp-net/WordPressPCL/blob/master/WordPressPCL/WordPressClient.cs" target="_blank" rel="noreferrer noopener">WordPressClient </a>instance and use it:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">var postsQuery = new PostsQueryBuilder()
    {
        Page = 1,
        PerPage = 10,
        Order = Order.DESC,
        OrderBy = PostsOrderBy.Date
    };
var posts = await WPClient.Posts.Query(postsQuery);</pre>

I have created a <a href="https://github.com/mizrael/BlazorWPBlog" target="_blank" rel="noreferrer noopener">small repo</a> on GitHub as usual with some handy examples. I also added a <a href="https://github.com/mizrael/BlazorWPBlog/blob/develop/.github/workflows/gh-pages.yml" target="_blank" rel="noreferrer noopener">GitHub Action</a> pipeline that will deploy the code to <a href="https://mizrael.github.io/BlazorWPBlog/" target="_blank" rel="noreferrer noopener">GitHub Pages</a>, so you can see how it would look like. 

For detailed instructions on how to host a Blazor Webassembly application on GitHub Pages, you can take a look at <a href="https://www.davidguida.net/how-to-deploy-blazor-webassembly-on-github-pages-using-github-actions/" target="_blank" rel="noreferrer noopener">my previous post</a>.

See ya!

<div class="post-details-footer-widgets">
</div>