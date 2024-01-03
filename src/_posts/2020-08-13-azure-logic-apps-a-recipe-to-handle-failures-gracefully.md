---
description: >
  Hi! Today we'll take a break from the Blazor Gamedev series and talk a bit about how to handle failures gracefully in Azure Logic Apps.
id: 7531
title: 'Azure Logic Apps: a recipe to handle failures gracefully'
date: 2020-08-13T21:37:10-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7531
permalink: /azure-logic-apps-a-recipe-to-handle-failures-gracefully/
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
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/08/azure-logic-apps.png
categories:
  - Azure
tags:
  - Azure
  - Cloud
  - Serverless
---
Hi All! Today I just wanted to take a break from the <a href="https://www.davidguida.net/blazor-and-2d-game-development-part-1-intro/" target="_blank" rel="noreferrer noopener">Blazor Gamedev series</a> and talk a bit about Azure. Specifically about **Logic Apps** and how to handle **failures** gracefully.

For those of you who don&#8217;t know what a **Logic App** is, I would strongly recommend to take a look at this video first:

Nice isn&#8217;t it? In a nutshell, an **Azure Logic App** allows the visual creation of fairly complex workflows and integration between different systems. It all starts with a trigger, which might be a message in a queue or an HTTP call or whatever. Then we have the possibility to drag&#8217;n&#8217;drop&#8217;n&#8217;configure all the different Action blocks that will build up our nice workflow. 

## And in case we need something more complex, we can always write a Function and include it.

Let&#8217;s do an example. Imagine you want to react to an HTTP call, fetch some data from a DB, manipulate it, and give back a 200 response. The workflow would look more or less like this:

<div class="wp-block-image">
  <figure class="aligncenter size-large"><a href="/assets/uploads/2020/08/first_run_failure-1.png?ssl=1"><img loading="lazy" width="788" height="414" src="/assets/uploads/2020/08/first_run_failure-1.png?resize=788%2C414&#038;ssl=1" alt="" class="wp-image-7533" srcset="/assets/uploads/2020/08/first_run_failure-1.png?w=1003&ssl=1 1003w, /assets/uploads/2020/08/first_run_failure-1.png?resize=300%2C158&ssl=1 300w, /assets/uploads/2020/08/first_run_failure-1.png?resize=768%2C404&ssl=1 768w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a></figure>
</div>

But wait! Something bad happened when we were trying to get the entity from the DB. Now our callers won&#8217;t get a 200 back! How can we handle this? 

The first step is to simply split the execution in two branches after the DB node:

<div class="wp-block-image">
  <figure class="aligncenter size-large"><a href="/assets/uploads/2020/08/result_with_conditional.png?ssl=1"><img loading="lazy" width="788" height="212" src="/assets/uploads/2020/08/result_with_conditional.png?resize=788%2C212&#038;ssl=1" alt="" class="wp-image-7536" srcset="/assets/uploads/2020/08/result_with_conditional.png?resize=1024%2C275&ssl=1 1024w, /assets/uploads/2020/08/result_with_conditional.png?resize=300%2C81&ssl=1 300w, /assets/uploads/2020/08/result_with_conditional.png?resize=768%2C206&ssl=1 768w, /assets/uploads/2020/08/result_with_conditional.png?resize=1536%2C413&ssl=1 1536w, /assets/uploads/2020/08/result_with_conditional.png?w=1983&ssl=1 1983w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a></figure>
</div>

And then configure the left branch to execute only when an error occurs. This can be done very easily by expanding the node, clicking on the 3 dots and clicking on &#8220;Configure run after&#8221;:<figure class="wp-block-image size-large">

<img loading="lazy" width="788" height="285" src="/assets/uploads/2020/08/configure-run-after.png?resize=788%2C285&#038;ssl=1" alt="" class="wp-image-7537" srcset="/assets/uploads/2020/08/configure-run-after.png?resize=1024%2C370&ssl=1 1024w, /assets/uploads/2020/08/configure-run-after.png?resize=300%2C108&ssl=1 300w, /assets/uploads/2020/08/configure-run-after.png?resize=768%2C277&ssl=1 768w, /assets/uploads/2020/08/configure-run-after.png?w=1232&ssl=1 1232w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /> </figure> 

Now all we have to do is select under which the conditions we want our branch to execute:

<div class="wp-block-image">
  <figure class="aligncenter size-large"><a href="/assets/uploads/2020/08/configure-run-after-2.png?ssl=1"><img loading="lazy" width="788" height="343" src="/assets/uploads/2020/08/configure-run-after-2.png?resize=788%2C343&#038;ssl=1" alt="" class="wp-image-7538" srcset="/assets/uploads/2020/08/configure-run-after-2.png?w=948&ssl=1 948w, /assets/uploads/2020/08/configure-run-after-2.png?resize=300%2C131&ssl=1 300w, /assets/uploads/2020/08/configure-run-after-2.png?resize=768%2C335&ssl=1 768w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a></figure>
</div>

That&#8217;s it, nothing else. The _Terminate_ node will allow us to select what return value we want to give the users and how the App execution will appear in the execution history (for example as &#8220;failed&#8221; or &#8220;successful&#8221;).

In case you also want some details about _why ****_the DB block failed, there&#8217;s a bit more work to do. Let&#8217;s take a look at the blocks:

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img loading="lazy" width="788" height="410" src="/assets/uploads/2020/08/scope-result.png?resize=788%2C410&#038;ssl=1" alt="" class="wp-image-7540" srcset="/assets/uploads/2020/08/scope-result.png?resize=1024%2C533&ssl=1 1024w, /assets/uploads/2020/08/scope-result.png?resize=300%2C156&ssl=1 300w, /assets/uploads/2020/08/scope-result.png?resize=768%2C400&ssl=1 768w, /assets/uploads/2020/08/scope-result.png?resize=1536%2C800&ssl=1 1536w, /assets/uploads/2020/08/scope-result.png?w=1850&ssl=1 1850w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></figure>
</div>

We can&#8217;t redirect the error result straight away to our Queue block, but we have to _extract_ from the response payload of the DB block. One way to do this is to surround it with a _Scope_ ****block and then Compose the output before redirecting to the Queue. For more details about how the Compose Action works, there&#8217;s an <a href="https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-perform-data-operations?WT.mc_id=DOP-MVP-5003878#compose-action" target="_blank" rel="noreferrer noopener">awesome page</a> in the official docs. Simply stated, it allows us to aggregate and compose (aehm&#8230;) the result from various blocks into whatever form we need.

In our case all we need is something like this:

<div class="wp-block-image">
  <figure class="aligncenter size-large"><a href="/assets/uploads/2020/08/scope-result-2.png?ssl=1"><img loading="lazy" width="788" height="253" src="/assets/uploads/2020/08/scope-result-2.png?resize=788%2C253&#038;ssl=1" alt="" class="wp-image-7542" srcset="/assets/uploads/2020/08/scope-result-2.png?resize=1024%2C329&ssl=1 1024w, /assets/uploads/2020/08/scope-result-2.png?resize=300%2C96&ssl=1 300w, /assets/uploads/2020/08/scope-result-2.png?resize=768%2C247&ssl=1 768w, /assets/uploads/2020/08/scope-result-2.png?w=1166&ssl=1 1166w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a></figure>
</div>

You might also have noticed that I changed the original flow to return a 202 immediately after the Trigger. This will allow the App to execute any long-running operation we need without keeping the caller waiting for us.

<div class="post-details-footer-widgets">
</div>