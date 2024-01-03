---
description: >
  In this post we're going to explore a simple but effective way to write integration tests on MongoDB using .NET Core and Docker.
id: 7176
title: Write integration tests on MongoDB with .NET Core and Docker
date: 2020-05-13T01:00:00-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7176
permalink: /write-integration-tests-on-mongodb-with-net-core-and-docker/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/05/nissan-tsuru-crash-test.jpg
categories:
  - .NET
  - Docker
  - MongoDB
  - Programming
  - Testing
tags:
  - .NET Core
  - Docker
  - MongoDB
  - testing
---
Hi All! In this post, we&#8217;re going to explore a simple but effective way to write integration tests on MongoDB using .NET Core and Docker.

A while ago I wrote <a rel="noreferrer noopener" href="https://www.davidguida.net/unit-testing-mongodb-in-c-part-1-the-repository/" target="_blank">a small series</a> about Unit Testing on MongoDB. A lot has changed since then and I also received few requests to add more details.

To be fair, I am not even that happy now with those articles. I bet it&#8217;s the same feeling we&#8217;re all experiencing when we look at the code we wrote in the past.<figure class="wp-block-image">

<img src="https://i1.wp.com/i.ytimg.com/vi/XK-k12riCKg/maxresdefault.jpg?w=788&#038;ssl=1" alt="who wrote this crap?" data-recalc-dims="1" /> </figure> 

Let&#8217;s just say that when it comes to testing, we should all follow the <a rel="noreferrer noopener" href="https://www.davidguida.net/unit-integration-end-to-end-tests-do-i-need-all-of-them/" target="_blank">Test Pyramid</a>.

And when it comes to the persistence layer, I think the best way is to always &#8220;hit the metal&#8221; and check if a real DB is happy with the code we wrote.

For example, EntityFramework exposes an <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/ef/core/providers/in-memory/?tabs=dotnet-core-cli" target="_blank">In-Memory provider </a>that can be used to write tests. It&#8217;s a valuable tool, but it doesn&#8217;t guarantee that the DbContext configuration and the Entities mapping is 100% valid. 

#### For that the only thing you can do is bite the bullet, connect to a DB instance, and run few statements.

Now, I wrote already how to write integration tests <a rel="noreferrer noopener" href="https://www.davidguida.net/handling-integration-tests-in-a-ci-pipeline/" target="_blank">in a CI/CD pipeline</a>. We are going to use the exact same approach, but for MongoDB instead.

All the code is as usual <a rel="noreferrer noopener" href="https://github.com/mizrael/MongoDbIntegrationSample" target="_blank">available on GitHub</a>, feel free to take a look before moving on.

As you can see, I have added a <a rel="noreferrer noopener" href="https://github.com/mizrael/MongoDbIntegrationSample/blob/master/docker-compose.yml" target="_blank">docker-compose</a> configuration to the root. The first step before launching the test suite is to run `docker-compose up` . It will download the official MongoDB image if you don&#8217;t have it already, and spin up the DB server. 

The instance will be available on localhost, port 27097, and this is where we&#8217;re pointing our code.

Adding a Docker configuration is something that I&#8217;ve been recently doing for basically all my projects: Devs should be able to spin up all the required infrastructure with 1-2 console commands, without spending too much time wondering why things don&#8217;t work. 

This doesn&#8217;t mean we shouldn&#8217;t be **aware** of what is going on under the hood. All the opposite. But everything Ops-related should absolutely be transparent to Devs and bring little to 0 noise. 

#### Personally, I prefer to focus on writing the application code and be sure all the client&#8217;s features are implemented correctly, rather than dwelling into the labyrinths of unreachable networks and unmountable volumes and what not.

Going back to the tests, the <a rel="noreferrer noopener" href="https://github.com/mizrael/MongoDbIntegrationSample/blob/master/MongoDbIntegrationSample.Tests/Integration/Persistence/DbFixture.cs" target="_blank">XUnit Fixture</a> is basically the heart of the sample:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class DbFixture : IDisposable
    {
        public DbFixture()
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

            var connString = config.GetConnectionString("db");
            var dbName = $"test_db_{Guid.NewGuid()}";

            this.DbContextSettings = new MongoDbContextSettings(connString, dbName);
            this.DbContext = new MongoDbContext(this.DbContextSettings);
        }

        public MongoDbContextSettings DbContextSettings { get; }
        public MongoDbContext DbContext { get; }

        public void Dispose()
        {
            var client = new MongoClient(this.DbContextSettings.ConnectionString);
            client.DropDatabase(this.DbContextSettings.DatabaseName);
        }
    }</pre>

Let&#8217;s see what&#8217;s happening here:

  1. it loads the connection string from the configuration file 
  2. generates a random DB name 
  3. spins up the MongoDbContext
  4. ensures that the DB is dropped at the end of the suite

Few words on Point 2 and 4:

  * Point 2 is extremely important to ensure that every execution is isolated. We don&#8217;t want test data created for a class <a rel="noreferrer noopener" href="https://www.davidguida.net/the-perils-of-sharing-state-when-writing-tests/" target="_blank">messing with tests</a> in another file.
  * The `Dispose()` method gives guarantee for Point 4. Once a test suite is executed there&#8217;s no point keeping the DB around.

That&#8217;s all for today. With the CoVid still around, stay home, stay healthy, get some vitamins and code! 

<div class="post-details-footer-widgets">
</div>