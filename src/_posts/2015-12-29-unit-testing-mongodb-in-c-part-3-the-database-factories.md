---
description: >
  In the third article of the series, we discuss about how to use the Factory Pattern to create a valid instance of the Repository
id: 6110
title: 'Unit testing MongoDB in C# part 3: the database factories'
date: 2015-12-29T12:18:23-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6110
permalink: /unit-testing-mongodb-in-c-part-3-the-database-factories/
dsq_thread_id:
  - "5140654238"
image: /assets/uploads/2014/12/mongodb_logo.png
categories:
  - .NET
  - MongoDB
  - Programming
  - Software Architecture
  - Testing
---
Welcome to the third article of the series!

<a href="http://www.davidguida.net/unit-testing-mongodb-in-c-part-2-the-database-context/" target="_blank">Last time</a> I was talking&nbsp;about the database context and at&nbsp;how I injected a Factory to create the repositories. Of course we could have injected every single repository in the cTor, but this way adding a new collection to the database would&nbsp;force too many changes.

Injecting just the factory instead allows us to create internally all the repositories we need, add new ones easily and of course makes our life easier when it comes to testing.

Let's take a look at our Repository Factory interface:

<div style="tab-size: 8" id="gist29436836" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-irepositoryfactory-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-irepositoryfactory-cs-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-irepositoryfactory-cs-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-k">interface</span> <span class="pl-en">IRepositoryFactory</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-irepositoryfactory-cs-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-irepositoryfactory-cs-LC2" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-irepositoryfactory-cs-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-irepositoryfactory-cs-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-en">IRepository</span><<span class="pl-en">TEntity</span>> <span class="pl-en">Create</span><<span class="pl-en">TEntity</span>>(<span class="pl-en">RepositoryOptions</span> <span class="pl-smi">options</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-irepositoryfactory-cs-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-irepositoryfactory-cs-LC4" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/9ed040b8fe7fe1aa921c/raw/814d4f4e99a54c5eaf7e39dd0811557f0917a791/IRepositoryFactory.cs" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/9ed040b8fe7fe1aa921c#file-irepositoryfactory-cs">IRepositoryFactory.cs</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

as you can see, that's very standard and easy. The implementation also is pretty straightforward:

<div style="tab-size: 8" id="gist29437022" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-repositoryfactory-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-repositoryfactory-cs-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-repositoryfactory-cs-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-k">class</span> <span class="pl-en">RepositoryFactory</span> : <span class="pl-en">IRepositoryFactory</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-repositoryfactory-cs-LC2" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-repositoryfactory-cs-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">private</span> <span class="pl-k">readonly</span> <span class="pl-en">IMongoDatabaseFactory</span> <span class="pl-smi">_dbFactory</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-repositoryfactory-cs-LC4" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-repositoryfactory-cs-LC5" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-en">RepositoryFactory</span>(<span class="pl-en">IMongoDatabaseFactory</span> <span class="pl-smi">dbFactory</span>)
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-repositoryfactory-cs-LC6" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-repositoryfactory-cs-LC7" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">if</span> (<span class="pl-smi">dbFactory</span> <span class="pl-k">==</span> <span class="pl-c1">null</span>)
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-repositoryfactory-cs-LC8" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">throw</span> <span class="pl-k">new</span> <span class="pl-en">ArgumentNullException</span>(<span class="pl-s"><span class="pl-pds">"</span>dbFactory<span class="pl-pds">"</span></span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-repositoryfactory-cs-LC9" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">_dbFactory</span> <span class="pl-k">=</span> <span class="pl-smi">dbFactory</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-repositoryfactory-cs-LC10" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L11" class="blob-num js-line-number" data-line-number="11">
                </td>
                
                <td id="file-repositoryfactory-cs-LC11" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L12" class="blob-num js-line-number" data-line-number="12">
                </td>
                
                <td id="file-repositoryfactory-cs-LC12" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-en">IRepository</span><<span class="pl-en">TEntity</span>> <span class="pl-en">Create</span><<span class="pl-en">TEntity</span>>(<span class="pl-en">RepositoryOptions</span> <span class="pl-smi">options</span>)
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L13" class="blob-num js-line-number" data-line-number="13">
                </td>
                
                <td id="file-repositoryfactory-cs-LC13" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L14" class="blob-num js-line-number" data-line-number="14">
                </td>
                
                <td id="file-repositoryfactory-cs-LC14" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">if</span> (<span class="pl-smi">options</span> <span class="pl-k">==</span> <span class="pl-c1">null</span>) <span class="pl-k">throw</span> <span class="pl-k">new</span> <span class="pl-en">ArgumentNullException</span>(<span class="pl-s"><span class="pl-pds">"</span>options<span class="pl-pds">"</span></span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L15" class="blob-num js-line-number" data-line-number="15">
                </td>
                
                <td id="file-repositoryfactory-cs-LC15" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L16" class="blob-num js-line-number" data-line-number="16">
                </td>
                
                <td id="file-repositoryfactory-cs-LC16" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">db</span> <span class="pl-k">=</span> <span class="pl-smi">_dbFactory</span>.<span class="pl-en">Connect</span>(<span class="pl-smi">options</span>.<span class="pl-smi">ConnectionString</span>, <span class="pl-smi">options</span>.<span class="pl-smi">DbName</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L17" class="blob-num js-line-number" data-line-number="17">
                </td>
                
                <td id="file-repositoryfactory-cs-LC17" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">return</span> <span class="pl-k">new</span> <span class="pl-en">Repository</span><<span class="pl-en">TEntity</span>>(<span class="pl-smi">db</span>.<span class="pl-en">GetCollection</span><<span class="pl-en">TEntity</span>>(<span class="pl-smi">options</span>.<span class="pl-smi">CollectionName</span>));
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L18" class="blob-num js-line-number" data-line-number="18">
                </td>
                
                <td id="file-repositoryfactory-cs-LC18" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-repositoryfactory-cs-L19" class="blob-num js-line-number" data-line-number="19">
                </td>
                
                <td id="file-repositoryfactory-cs-LC19" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/9e0669598fad62cc998b/raw/39a4a3224614b078a5275d3ca9e20d5b606a3b61/RepositoryFactory.cs" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/9e0669598fad62cc998b#file-repositoryfactory-cs">RepositoryFactory.cs</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

A couple of notes on this:

  1. the&nbsp;RepositoryOptions class is just a simple&nbsp;<a href="http://martinfowler.com/bliki/ValueObject.html" target="_blank">Value Object</a> encapsulating some details like the connection string and the name of the collection
  2. in the cTor we have&nbsp;a dependency on another Factory used to&nbsp;get a reference to the database. Why we do this? I guess you know the answer 😀

As you can see, this injected Factory also is very easy:

<div style="tab-size: 8" id="gist29437031" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-imongodatabasefactory-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-imongodatabasefactory-cs-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-imongodatabasefactory-cs-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-k">interface</span> <span class="pl-en">IMongoDatabaseFactory</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-imongodatabasefactory-cs-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-imongodatabasefactory-cs-LC2" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-imongodatabasefactory-cs-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-imongodatabasefactory-cs-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-en">IMongoDatabase</span> <span class="pl-en">Connect</span>(<span class="pl-k">string</span> <span class="pl-smi">connectionString</span>, <span class="pl-k">string</span> <span class="pl-smi">dbName</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-imongodatabasefactory-cs-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-imongodatabasefactory-cs-LC4" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/144f356aece4f6d30881/raw/c54cf94605b0759ac0a0c61db93e343821079380/IMongoDatabaseFactory.cs" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/144f356aece4f6d30881#file-imongodatabasefactory-cs">IMongoDatabaseFactory.cs</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

you can find the <a href="https://gist.github.com/mizrael/d9c9f061b3934a037b21" target="_blank">implementation here</a>.

Next time: [let's write some tests](https://www.davidguida.net/unit-testing-mongodb-in-c-part-4-the-tests-finally/)!

<div class="post-details-footer-widgets">
</div>