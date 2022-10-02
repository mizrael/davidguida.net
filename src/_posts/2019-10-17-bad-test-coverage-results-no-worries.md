---
description: >
  Having bad results in your test coverage is always a bad sign. But are you sure it's all your fault? Check this article to find out!
id: 6854
title: Bad test coverage results? No worries!
date: 2019-10-17T12:00:56-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6854
permalink: /bad-test-coverage-results-no-worries/
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
image: /assets/uploads/2019/10/test_coverage.jpg
categories:
  - .NET
  - Programming
  - Testing
tags:
  - .NET Core
  - programming
  - testing
---
Yesterday I stumbled upon an “interesting” bug in the code coverage tool. In case you’re generating it (and I **strongly encourage** you to), please make sure you’re satisfied with the results.

At work by policy we have to ensure at least 70% of test coverage. However in one of my projects I was getting way worse results, in some cases even 0%.

I&#8217;m pretty paranoid about testing, and when possible I tend to follow TDD along with the <a href="https://martinfowler.com/articles/practical-test-pyramid.html" target="_blank" rel="noreferrer noopener" aria-label="Test Pyramid (opens in a new tab)">Test Pyramid</a>.

Long story short, I found out that if you have long running tests (eg. single tests taking more than 10 seconds to complete) **AND** you’re using .NET Core, the **dotnet test** command might terminate its execution **before** the report files get written. This will lead to bad results, in some cases even 0% ( which happened to me).

But fear not! The solution is at hand and relatively easy to implement. Just follow the steps outlined here: <a href="https://github.com/tonerdo/coverlet/issues/573#issuecomment-536593477" target="_blank" rel="noreferrer noopener" aria-label="https://github.com/tonerdo/coverlet/issues/573#issuecomment-536593477 (opens in a new tab)">https://github.com/tonerdo/coverlet/issues/573#issuecomment-536593477</a>

In my case I managed to move from a very sad 25% to a shiny 78%. In one case I even got 90%!

Interesting enough, generating the coverage report [directly from Visual Studio Enterprise](https://docs.microsoft.com/en-us/visualstudio/test/using-code-coverage-to-determine-how-much-code-is-being-tested?view=vs-2019) leads to even better results. 

For more details you can take a look here:

  * <a rel="noreferrer noopener" aria-label="https://github.com/tonerdo/coverlet/issues/575 (opens in a new tab)" href="https://github.com/tonerdo/coverlet/issues/575" target="_blank">https://github.com/tonerdo/coverlet/issues/575</a>
  * <a rel="noreferrer noopener" aria-label="https://github.com/tonerdo/coverlet#vstest-integration (opens in a new tab)" href="https://github.com/tonerdo/coverlet#vstest-integration" target="_blank">https://github.com/tonerdo/coverlet#vstest-integration</a>
  * <https://github.com/tonerdo/coverlet/blob/master/Documentation/Troubleshooting.md#collectors-integration> 

Oh and don&#8217;t forget that if you have NDepend, you can import the coverage results and have a very pretty report. <figure class="wp-block-image">

<img src="https://i2.wp.com/www.ndepend.com/Doc/Treemap/TreemapColor.png?w=788&#038;ssl=1" alt="" data-recalc-dims="1" /> <figcaption>courtesy of NDepend</figcaption></figure> 

They also have <a rel="noreferrer noopener" aria-label=" (opens in a new tab)" href="https://www.ndepend.com/docs/code-coverage" target="_blank">an excellent tutorial</a> on the website that will guide you through all the steps.



<div class="post-details-footer-widgets">
</div>