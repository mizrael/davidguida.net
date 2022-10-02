---
description: >
  Integration Tests are a fundamental block of every project. And as such, they deserve a special treatment in the CI pipeline.
id: 6887
title: 'Handling Integration Tests in a CI pipeline &#8211; part 1'
date: 2019-11-04T09:00:11-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6887
permalink: /handling-integration-tests-in-a-ci-pipeline/
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
image: /assets/uploads/2019/11/misaligned_bridge.jpg
categories:
  - .NET
  - EntityFramework
  - Programming
  - Testing
tags:
  - .NET Core
  - testing
---
Integration Tests are a fundamental block of every project. And as such, they deserve a special treatment in the CI pipeline.

First of all, let&#8217;s make a clear distinction between **unit** and **integration** tests.

#### We <a rel="noreferrer noopener" aria-label="discussed already (opens in a new tab)" href="https://www.davidguida.net/unit-integration-end-to-end-tests-do-i-need-all-of-them/" target="_blank">discussed already</a> on this blog about this, but I would like to do a quick recap.

Unit tests are responsible of testing components in complete isolation. Dependencies have to be replaced with mocks and the whole test suite should take few seconds to run. If you have a **unit** test that takes more than 1-2 seconds, then you might want to take a deep look at the code. There are several good libraries for creating stubs and mocks available in every language. Personally I use <a href="https://nsubstitute.github.io/" target="_blank" rel="noreferrer noopener" aria-label="NSubstitute  (opens in a new tab)">NSubstitute </a>when I&#8217;m working in C#.

Integration tests instead are responsible of ensuring that the access to external systems works as expected. Database writes and reads, calls to APIs, basically every I/O operation your application is performing.

#### Now, with Docker is relatively easy to setup a developer&#8217;s machine with something very similar to the production environment. 

We can spin up databases and microservices with few config files and run the tests directly from our local machine.

But this is just the first step: once committed to the source code repository, we need to ensure that the code is always in good shape. Hence, we have to execute the tests also on whatever platform we&#8217;re using. This is one of the fundamental steps of <a href="https://en.wikipedia.org/wiki/Continuous_integration" target="_blank" rel="noreferrer noopener" aria-label="Continuous Integration (opens in a new tab)">Continuous Integration</a>.

There are several options for **Continuous Integration** available online, all with pros and cons. <a rel="noreferrer noopener" aria-label="CircleCI  (opens in a new tab)" href="https://circleci.com/" target="_blank">CircleCI </a>and <a rel="noreferrer noopener" aria-label="Travis CI (opens in a new tab)" href="https://travis-ci.org/" target="_blank">Travis CI</a> are just an example. They can connect to an existing repository and run the CI pipeline after every commit. 

<a rel="noreferrer noopener" aria-label="BitBucket  (opens in a new tab)" href="https://bitbucket.org/" target="_blank">BitBucket </a>and <a rel="noreferrer noopener" aria-label="GitHub  (opens in a new tab)" href="https://github.com/actions" target="_blank">GitHub</a> move a step further as they can also host your repositories so you can rely on just single platform.

I&#8217;ve been using <a rel="noreferrer noopener" href="https://about.gitlab.com/" target="_blank">GitLab</a> instead for the last year in my daily job. It&#8217;s quite good&#8230;although sometimes I think that Swiss-army-knives are not the answer to everything.

<a href="https://www.davidguida.net/handling-integration-tests-in-a-ci-pipeline-part-2-an-example/" target="_blank" rel="noreferrer noopener" aria-label="Next time (opens in a new tab)">Next time</a> I&#8217;m going to show a very simple **.NET Core** application with **Entity Framework 3** . We will also discuss how we can write **integration tests** that can run locally and as part of a CI pipeline.

<div class="post-details-footer-widgets">
</div>