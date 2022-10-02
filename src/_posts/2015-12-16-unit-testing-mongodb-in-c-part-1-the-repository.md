---
id: 6095
title: 'Unit testing MongoDB in C# part 1: the repository'
date: 2015-12-16T23:42:14-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6095
permalink: /unit-testing-mongodb-in-c-part-1-the-repository/
dsq_thread_id:
  - "5140195130"
image: /assets/uploads/2014/12/mongodb_logo.png
categories:
  - .NET
  - MongoDB
  - Programming
  - Software Architecture
  - Testing
---
Ok folks, this time I&#8217;ll talk/brag a little bit about the fabulous C# MongoDB driver and how you can write some testable code with it.

If you have come across this post, probably you already know what unit tests and TDD are so you can go directly to the code.

For those of you that have lived under a rock for the last 15 years or so, <a href="http://martinfowler.com/bliki/UnitTest.html" target="_blank">here are the words</a> of a very wise man.

Take your time, I will be here.

&nbsp;

&nbsp;

&nbsp;

Interesting concept, isn&#8217;t it?

Just because I like adding links to my posts, the amazing uncle Bob <a href="http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd" target="_blank">has a nice list of</a> the &#8220;three rules&#8221; of TDD.

Although there might be cases where TDD <a href="http://chrismdp.com/2015/03/why-games-coders-dont-use-tdd-and-why-it-matters/" target="_blank">is not advisable</a>, or where is <a href="https://blog.8thlight.com/uncle-bob/2014/04/30/When-tdd-does-not-work.html" target="_blank">basically useless</a>, it&#8217;s an essential tool that every developer needs to have at his disposal&#8230; so let&#8217;s get started!

The basic idea is to have an interface for everything. Yes, simple as that. [DI](http://www.martinfowler.com/articles/injection.html) at it&#8217;s finest, kids! Always remember to separate your concerns, avoiding  huge monolithic classes that do too much. Divide et impera.

We can start with this:

<div style="tab-size: 8" id="gist29052011" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-irepository-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-irepository-cs-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-irepository-cs-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-k">interface</span> <span class="pl-en">IRepository</span><<span class="pl-en">TEntity</span>>
                </td>
              </tr>
              
              <tr>
                <td id="file-irepository-cs-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-irepository-cs-LC2" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-irepository-cs-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-irepository-cs-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">string</span> <span class="pl-smi">CollectionName</span> { <span class="pl-k">get</span>; }
                </td>
              </tr>
              
              <tr>
                <td id="file-irepository-cs-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-irepository-cs-LC4" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-irepository-cs-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-irepository-cs-LC5" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-en">Task</span><<span class="pl-k">long</span>> <span class="pl-en">CountAsync</span>(<span class="pl-en">FilterDefinition</span><<span class="pl-en">TEntity</span>> <span class="pl-smi">filter</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-irepository-cs-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-irepository-cs-LC6" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-en">IFindFluent</span><<span class="pl-en">TEntity</span>, <span class="pl-en">TEntity</span>> <span class="pl-en">Find</span>(<span class="pl-en">FilterDefinition</span><<span class="pl-en">TEntity</span>> <span class="pl-smi">filter</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-irepository-cs-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-irepository-cs-LC7" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-en">IFindFluent</span><<span class="pl-en">TEntity</span>, <span class="pl-en">TEntity</span>> <span class="pl-en">Find</span>(<span class="pl-en">Expression</span><<span class="pl-en">Func</span><<span class="pl-en">TEntity</span>, <span class="pl-k">bool</span>>> <span class="pl-smi">filter</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-irepository-cs-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-irepository-cs-LC8" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-en">Task</span><<span class="pl-en">TEntity</span>> <span class="pl-en">FindOneAndReplaceAsync</span>(<span class="pl-en">FilterDefinition</span><<span class="pl-en">TEntity</span>> <span class="pl-smi">filter</span>, <span class="pl-en">TEntity</span> <span class="pl-smi">replacement</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-irepository-cs-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-irepository-cs-LC9" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-en">Task</span><<span class="pl-en">TEntity</span>> <span class="pl-en">FindOneAndReplaceAsync</span>(<span class="pl-en">Expression</span><<span class="pl-en">Func</span><<span class="pl-en">TEntity</span>, <span class="pl-k">bool</span>>> <span class="pl-smi">filter</span>, <span class="pl-en">TEntity</span> <span class="pl-smi">replacement</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-irepository-cs-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-irepository-cs-LC10" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/7e75d7f14cb2971997fa/raw/6e37b0cb6047a4573c9188eeb1cbdc7a64276981/IRepository.cs" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/7e75d7f14cb2971997fa#file-irepository-cs">IRepository.cs</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

Small and easy. Just basic read and update operations, nothing else. You can find a [sample implementation here](https://gist.github.com/mizrael/47b601b0a09d4b6f03f6), as you can see it&#8217;s a simple wrapper over the MongoDB driver, nothing else, but having the interface allows you to hide all the implementation details AND to eventually mock everything in your tests.

Enough for now, the new Star Wars movie is waiting for me !

<a href="http://www.davidguida.net/unit-testing-mongodb-in-c-part-2-the-database-context/" target="_blank">Next time </a>we&#8217;ll talk about factories and how to create a simple database context.

<div class="post-details-footer-widgets">
</div>