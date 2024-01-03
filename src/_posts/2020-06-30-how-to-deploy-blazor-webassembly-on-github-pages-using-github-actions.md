---
description: >
  With Blazor webassembly you can generate a static website and deploy it on GitHub Pages through GitHub Actions. Find out how!
id: 7381
title: How to deploy Blazor Webassembly on GitHub Pages using GitHub Actions
date: 2020-06-30T13:17:33-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7381
permalink: /how-to-deploy-blazor-webassembly-on-github-pages-using-github-actions/
zakra_layout:
  - tg-site-layout--customizer
zakra_remove_content_margin:
  - "0"
zakra_transparent_header:
  - customizer
zakra_page_header:
  - "1"
zakra_logo:
  - "0"
image: /assets/uploads/2020/06/blazor-pages.jpg
categories:
  - .NET
  - ASP.NET
  - Blazor
  - Programming
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
---
I have been spending <a href="https://www.davidguida.net/how-to-consume-dd-rest-api-over-grpc-web-blazor-part-1-the-client/" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">quite some time</a> lately playing with **Blazor**. One of the nice things is that with **webassembly** you can generate a static website and have it hosted on **<a aria-label="undefined (opens in a new tab)" href="https://pages.github.com/" target="_blank" rel="noreferrer noopener">GitHub Pages</a>** for free.  
Most importantly, the whole process can be automated with **GitHub Actions** so you don&#8217;t have to worry about it.

It&#8217;s not a complicated process, all in all just a few steps. There is only one caveat: if your repository is a &#8220;standard&#8221; User or Organization repository, you can deploy to Pages only from the **master** branch.

From <a href="https://help.github.com/en/github/working-with-github-pages/about-github-pages#user--organization-pages" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">the docs</a>:

<blockquote class="wp-block-quote">
  <p>
    The default publishing source for user and organization sites is the&nbsp;<code>master</code>&nbsp;branch. If the repository for your user or organization site has a&nbsp;<code>master</code>&nbsp;branch, your site will publish automatically from that branch. You cannot choose a different publishing source for user or organization sites.
  </p>
</blockquote>

Otherwise, if your repository belongs to a <a aria-label="undefined (opens in a new tab)" href="https://github.blog/2016-09-14-a-whole-new-github-universe-announcing-new-tools-forums-and-features/#manage-your-ideas-with-projects" target="_blank" rel="noreferrer noopener">Project</a>, you can configure it to deploy from a different branch:

<blockquote class="wp-block-quote">
  <p>
    The default publishing source for a project site is the&nbsp;<code>gh-pages</code>&nbsp;branch. If the repository for your project site has a&nbsp;<code>gh-pages</code>&nbsp;branch, your site will publish automatically from that branch.
  </p>
  
  <p>
    Project sites can also be published from the&nbsp;<code>master</code>&nbsp;branch or a&nbsp;<code>/docs</code>&nbsp;folder on the&nbsp;<code>master</code>&nbsp;branch.
  </p>
</blockquote>

So what do we have to do in order to see our nice website? The core <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorOnGitHubPages/blob/development/.github/workflows/gh-pages.yml" target="_blank" rel="noreferrer noopener">it&#8217;s all here</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="yaml" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">name: gh-pages

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Setup .NET Core
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: 3.1.301
    - name: Publish with dotnet
      run: dotnet publish --configuration Release --output build
    - name: Deploy to Github Pages
      uses: JamesIves/github-pages-deploy-action@releases/v3
      with:
        ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
        BASE_BRANCH: development # The branch the action should deploy from.
        BRANCH: master # The branch the action should deploy to.
        FOLDER: build/wwwroot # The folder the action should deploy.
        SINGLE_COMMIT: true</pre>

#### This GitHub Action workflow is doing all the grunt work for us:

  * setup .NET Core
  * build the application and publish it to the&nbsp;`/build/`&nbsp;folder
  * uses&nbsp;[JamesIves/github-pages-deploy-action](https://github.com/JamesIves/github-pages-deploy-action)&nbsp;to deploy the code to the&nbsp;`master`&nbsp;branch

There are also few things to add to the application code as well. First of all, add this javascript snippet to your <a href="https://github.com/mizrael/BlazorOnGitHubPages/blob/development/BlazorOnGitHubPages/wwwroot/index.html" target="_blank" aria-label="undefined (opens in a new tab)" rel="noreferrer noopener">index.html</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="html" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;!-- Start Single Page Apps for GitHub Pages -->
    &lt;script type="text/javascript">
        // Single Page Apps for GitHub Pages
        // https://github.com/rafrex/spa-github-pages
        // Copyright (c) 2016 Rafael Pedicini, licensed under the MIT License
        // ----------------------------------------------------------------------
        // This script checks to see if a redirect is present in the query string
        // and converts it back into the correct url and adds it to the
        // browser's history using window.history.replaceState(...),
        // which won't cause the browser to attempt to load the new url.
        // When the single page app is loaded further down in this file,
        // the correct url will be waiting in the browser's history for
        // the single page app to route accordingly.
        (function (l) {
            if (l.search) {
                var q = {};
                l.search.slice(1).split('&').forEach(function (v) {
                    var a = v.split('=');
                    q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
                });
                if (q.p !== undefined) {
                    window.history.replaceState(null, null,
                        l.pathname.slice(0, -1) + (q.p || '') +
                        (q.q ? ('?' + q.q) : '') +
                        l.hash
                    );
                }
            }
        }(window.location))
    &lt;/script>
    &lt;!-- End Single Page Apps for GitHub Pages --></pre>

As you can see from the comment, this code helps to handle URLs and redirections.

You&#8217;ll also have to update the _<base>_ tag with the **repository name**:

<pre class="EnlighterJSRAW" data-enlighter-language="html" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;base href="/BlazorOnGitHubPages/" /></pre>

So if the name is _**BlazorOnGitHubPages**_, the final URL will be something like  _<https://mizrael.github.io/BlazorOnGitHubPages/>_ (which happens to be the one I&#8217;m using, feel free to try it).

The next step is to add a <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorOnGitHubPages/blob/development/BlazorOnGitHubPages/wwwroot/404.html" target="_blank" rel="noreferrer noopener">404.html</a> page and an empty <a aria-label="undefined (opens in a new tab)" href="https://github.com/mizrael/BlazorOnGitHubPages/blob/development/BlazorOnGitHubPages/wwwroot/.nojekyll" target="_blank" rel="noreferrer noopener">.nojekyll</a> file in the _/wwwroot_ folder. GitHub Pages are built using Jekyll and it does not build anything that starts with _ . Blazor, however, generates a __framework_ subfolder inside _/wwwroot_ and as you can imagine, it&#8217;s <a aria-label="undefined (opens in a new tab)" href="https://docs.microsoft.com/en-us/dotnet/architecture/blazor-for-web-forms-developers/project-structure#bootstrap-blazor" target="_blank" rel="noreferrer noopener">quite important</a>.

<div class="post-details-footer-widgets">
</div>