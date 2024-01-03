---
description: >
  In this article we'll take a look at a practical example of integration tests with EntityFramework and how we can run them in a CI pipeline.
id: 6913
title: 'Handling Integration Tests in a CI pipeline &#8211; part 2: an example'
date: 2019-11-06T16:02:05-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6913
permalink: /handling-integration-tests-in-a-ci-pipeline-part-2-an-example/
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
image: /assets/uploads/2019/11/puzzle.jpg
categories:
  - .NET
  - EntityFramework
  - Git
  - Programming
  - Testing
tags:
  - .NET Core
  - testing
---
Today we&#8217;re going to take a look at a concrete example of how we can handle integration tests in a CI pipeline.

<a rel="noreferrer noopener" aria-label="Last time (opens in a new tab)" href="https://www.davidguida.net/handling-integration-tests-in-a-ci-pipeline/" target="_blank">Last time</a> I gave few options of possible platforms. I am working with [Gitlab](https://about.gitlab.com/) in my daily job so the code today will be focusing on it. But the concepts can be applied basically everywhere.

All the sources are [available as usual](https://github.com/mizrael/CICDIntegrationTests) on GitHub.

The solution is not extremely interesting, there are just 2 projects: **Users** and **Users.Tests**.

The **Users** project exposes a basic [User](https://github.com/mizrael/CICDIntegrationTests/blob/master/Users/Models/User.cs) model, an **EntityFramework** Db Context and a <a rel="noreferrer noopener" aria-label="Repository (opens in a new tab)" href="https://github.com/mizrael/CICDIntegrationTests/blob/master/Users/Persistence/UsersRepository.cs" target="_blank">Repository</a>. I have added few tests for this last class in the **Users.Tests** project, specifically in the <a href="https://github.com/mizrael/CICDIntegrationTests/blob/master/Users.Tests/Integration/UsersRepositoryTests.cs" target="_blank" rel="noreferrer noopener" aria-label="UsersRepositoryTests  (opens in a new tab)">UsersRepositoryTests </a>class.

The tests themselves are pretty basic, just making sure the FindById() method of the repository returns a proper value with valid or bad input.

The <a rel="noreferrer noopener" aria-label="DbFixture  (opens in a new tab)" href="https://github.com/mizrael/CICDIntegrationTests/blob/master/Users.Tests/Integration/DbFixture.cs" target="_blank">DbFixture </a>class is basically the core of the project: it is responsible of reading the configuration from a file and acting as Factory for the Db Context.

#### The important parts are **how** it reads the config and **how** it builds the connection string. Let&#8217;s take a look.

The project has 2 config files, **appsettings.json** and **appsettings.CI.json** . The first one is used as default and holds the connection string that can be used on your localhost.

On the CI environment instead we will be using the other one as it defines the specific connection string we can use there.

We know if we&#8217;re running on CI or somewhere else by reading the default environment variable **ASPNETCORE_ENVIRONMENT** . Building the configuration then is a piece of cake thanks to the ConfigurationBuilder class:

<pre class="wp-block-preformatted">var builder = new ConfigurationBuilder();
builder.AddJsonFile("appsettings.json");

this.EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? string.Empty;
if (!string.IsNullOrWhiteSpace(this.EnvironmentName))
    builder.AddJsonFile($"appsettings.{this.EnvironmentName}.json", true);

var config = builder.Build();</pre>

#### For more details about configurations in .NET Core, make sure to read [this article](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?WT.mc_id=DOP-MVP-5003878&view=aspnetcore-3.0) on the Microsoft website.

Now take a look at the connection string in the config file. It is used as a &#8220;template&#8221; to build the final one like this:

<pre class="wp-block-preformatted">var connString = config.GetConnectionString("db");
this.ConnectionString = string.Format(connString, Guid.NewGuid());</pre>

This trick allows us to have a different db name for every test class using the Fixture. We can even push this further and have distinct db names for every test by moving the code to the BuildDbContext() method.

Make sure to read <a href="https://xunit.net/docs/shared-context" target="_blank" rel="noreferrer noopener" aria-label="the article  (opens in a new tab)">the article </a>on the XUnit website for more details about fixtures.

Now that we&#8217;ve defined the integration tests, let&#8217;s take a look at the CI pipeline. In the [.gitlab-ci.yml](https://github.com/mizrael/CICDIntegrationTests/blob/master/.gitlab-ci.yml) file you can find two jobs, &#8220;**build_project**&#8221; and &#8220;**run\_integration\_tests**&#8220;.

On the very first line I&#8217;ve specified the base image that will be used by all the jobs in the pipeline. This is relative to my Docker registry so feel free to update it to whatever suits your needs.

The **build_project** job is very simple, it just restores the Nuget dependencies and the runs **dotnet build**.

The second job is also simple, but with a little twist: by leveraging the &#8220;**<a rel="noreferrer noopener" aria-label=" (opens in a new tab)" href="https://docs.gitlab.com/ee/ci/services/" target="_blank">services</a>**&#8221; keyword, we can add additional Docker images that will be executed along the primary one. We will be using this to spin up the MSSQL instance.

In the &#8220;**variables**&#8221; section we also define the credentials for the sa account. We can safely use it as it will be only relative to the db container and won&#8217;t affect anything else.

If everything is correct, after every commit you should see something like this:<figure class="wp-block-image">

<img loading="lazy" width="677" height="484" src="/assets/uploads/2019/11/pipeline.png?resize=677%2C484&#038;ssl=1" alt="" class="wp-image-6917" srcset="/assets/uploads/2019/11/pipeline.png?w=677&ssl=1 677w, /assets/uploads/2019/11/pipeline.png?resize=300%2C214&ssl=1 300w" sizes="(max-width: 677px) 100vw, 677px" data-recalc-dims="1" /> </figure> 



<div class="post-details-footer-widgets">
</div>