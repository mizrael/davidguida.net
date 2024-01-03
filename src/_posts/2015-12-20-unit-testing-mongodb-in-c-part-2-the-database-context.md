---
id: 6103
title: 'Unit testing MongoDB in C# part 2: the database context'
date: 2015-12-20T00:03:06-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6103
permalink: /unit-testing-mongodb-in-c-part-2-the-database-context/
dsq_thread_id:
  - "5140653078"
image: /assets/uploads/2014/12/mongodb_logo.png
categories:
  - .NET
  - MongoDB
  - Programming
  - Software Architecture
  - Testing
---
Hi All!

<a href="http://www.davidguida.net/unit-testing-mongodb-in-c-part-1-the-repository/" target="_blank">Last time</a> I rambled a little bit about TDD and how to implement a very simple MongoDB repository.

This time I want to introduce you to my cool friend, DbContext. The basic idea is to have an interface exposing all the collection on your db, or, in our case, all the repositories. Take a look at this:

<div style="tab-size: 8" id="gist29139975" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-idbcontext" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-text  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-idbcontext-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-idbcontext-LC1" class="blob-code blob-code-inner js-file-line">
                  public interface IDbContext
                </td>
              </tr>
              
              <tr>
                <td id="file-idbcontext-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-idbcontext-LC2" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-idbcontext-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-idbcontext-LC3" class="blob-code blob-code-inner js-file-line">
                  IRepository<Entities.Post> Posts { get; }
                </td>
              </tr>
              
              <tr>
                <td id="file-idbcontext-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-idbcontext-LC4" class="blob-code blob-code-inner js-file-line">
                  IRepository<Entities.User> Users { get; }
                </td>
              </tr>
              
              <tr>
                <td id="file-idbcontext-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-idbcontext-LC5" class="blob-code blob-code-inner js-file-line">
                  IRepository<Entities.Tag> Tags { get; }
                </td>
              </tr>
              
              <tr>
                <td id="file-idbcontext-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-idbcontext-LC6" class="blob-code blob-code-inner js-file-line">
                  IRepository<Entities.Taxonomy> Taxonomies { get; }
                </td>
              </tr>
              
              <tr>
                <td id="file-idbcontext-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-idbcontext-LC7" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/a06bc0bc23223fa62345/raw/2ad27d92de3d5f871dcc1975b11e7f3e346467c1/IDbContext" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/a06bc0bc23223fa62345#file-idbcontext">IDbContext</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

( I will leave to you the definition of the entities ). The implementation is pretty straightforward:

<div style="tab-size: 8" id="gist29161118" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-dbcontext-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-dbcontext-cs-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-dbcontext-cs-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-k">class</span> <span class="pl-en">DbContext</span> : <span class="pl-en">IDbContext</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-dbcontext-cs-LC2" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-dbcontext-cs-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-en">DbContext</span>(<span class="pl-en">IRepositoryFactory</span> <span class="pl-smi">repoFactory</span>, <span class="pl-k">string</span> <span class="pl-smi">connectionString</span>, <span class="pl-k">string</span> <span class="pl-smi">dbName</span>)
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-dbcontext-cs-LC4" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-dbcontext-cs-LC5" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">if</span> (<span class="pl-smi">string</span>.<span class="pl-en">IsNullOrWhiteSpace</span>(<span class="pl-smi">connectionString</span>))
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-dbcontext-cs-LC6" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">throw</span> <span class="pl-k">new</span> <span class="pl-en">ArgumentNullException</span>(<span class="pl-s"><span class="pl-pds">"</span>connectionString<span class="pl-pds">"</span></span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-dbcontext-cs-LC7" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">if</span> (<span class="pl-smi">string</span>.<span class="pl-en">IsNullOrWhiteSpace</span>(<span class="pl-smi">dbName</span>))
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-dbcontext-cs-LC8" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">throw</span> <span class="pl-k">new</span> <span class="pl-en">ArgumentNullException</span>(<span class="pl-s"><span class="pl-pds">"</span>dbName<span class="pl-pds">"</span></span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-dbcontext-cs-LC9" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-dbcontext-cs-LC10" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">this</span>.<span class="pl-smi">Posts</span> <span class="pl-k">=</span> <span class="pl-smi">repoFactory</span>.<span class="pl-en">Create</span><<span class="pl-k">Entities</span>.<span class="pl-en">Video</span>>(<span class="pl-k">new</span> <span class="pl-en">RepositoryOptions</span>(<span class="pl-smi">connectionString</span>, <span class="pl-smi">dbName</span>, <span class="pl-s"><span class="pl-pds">"</span>posts<span class="pl-pds">"</span></span>));
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L11" class="blob-num js-line-number" data-line-number="11">
                </td>
                
                <td id="file-dbcontext-cs-LC11" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">this</span>.<span class="pl-smi">Users</span> <span class="pl-k">=</span> <span class="pl-smi">repoFactory</span>.<span class="pl-en">Create</span><<span class="pl-k">Entities</span>.<span class="pl-en">User</span>>(<span class="pl-k">new</span> <span class="pl-en">RepositoryOptions</span>(<span class="pl-smi">connectionString</span>, <span class="pl-smi">dbName</span>,<span class="pl-s"><span class="pl-pds">"</span>users<span class="pl-pds">"</span></span>) );
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L12" class="blob-num js-line-number" data-line-number="12">
                </td>
                
                <td id="file-dbcontext-cs-LC12" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">this</span>.<span class="pl-smi">Tags</span> <span class="pl-k">=</span> <span class="pl-smi">repoFactory</span>.<span class="pl-en">Create</span><<span class="pl-k">Entities</span>.<span class="pl-en">Tag</span>>(<span class="pl-k">new</span> <span class="pl-en">RepositoryOptions</span>(<span class="pl-smi">connectionString</span>, <span class="pl-smi">dbName</span>, <span class="pl-s"><span class="pl-pds">"</span>tags<span class="pl-pds">"</span></span>));
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L13" class="blob-num js-line-number" data-line-number="13">
                </td>
                
                <td id="file-dbcontext-cs-LC13" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">this</span>.<span class="pl-smi">Taxonomies</span> <span class="pl-k">=</span> <span class="pl-smi">repoFactory</span>.<span class="pl-en">Create</span><<span class="pl-k">Entities</span>.<span class="pl-en">Taxonomy</span>>(<span class="pl-k">new</span> <span class="pl-en">RepositoryOptions</span>(<span class="pl-smi">connectionString</span>, <span class="pl-smi">dbName</span>, <span class="pl-s"><span class="pl-pds">"</span>taxonomies<span class="pl-pds">"</span></span>));
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L14" class="blob-num js-line-number" data-line-number="14">
                </td>
                
                <td id="file-dbcontext-cs-LC14" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L15" class="blob-num js-line-number" data-line-number="15">
                </td>
                
                <td id="file-dbcontext-cs-LC15" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L16" class="blob-num js-line-number" data-line-number="16">
                </td>
                
                <td id="file-dbcontext-cs-LC16" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-en">IRepository</span><<span class="pl-k">Entities</span>.<span class="pl-en">Post</span>> <span class="pl-smi">Posts</span> { <span class="pl-k">get</span>; <span class="pl-k">private</span> <span class="pl-k">set</span>; }
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L17" class="blob-num js-line-number" data-line-number="17">
                </td>
                
                <td id="file-dbcontext-cs-LC17" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-en">IRepository</span><<span class="pl-k">Entities</span>.<span class="pl-en">User</span>> <span class="pl-smi">Users</span> { <span class="pl-k">get</span>; <span class="pl-k">private</span> <span class="pl-k">set</span>; }
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L18" class="blob-num js-line-number" data-line-number="18">
                </td>
                
                <td id="file-dbcontext-cs-LC18" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-en">IRepository</span><<span class="pl-k">Entities</span>.<span class="pl-en">Tag</span>> <span class="pl-smi">Tags</span> { <span class="pl-k">get</span>; <span class="pl-k">private</span> <span class="pl-k">set</span>; }
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L19" class="blob-num js-line-number" data-line-number="19">
                </td>
                
                <td id="file-dbcontext-cs-LC19" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-en">IRepository</span><<span class="pl-k">Entities</span>.<span class="pl-en">Taxonomy</span>> <span class="pl-smi">Taxonomies</span> { <span class="pl-k">get</span>; <span class="pl-k">private</span> <span class="pl-k">set</span>; }
                </td>
              </tr>
              
              <tr>
                <td id="file-dbcontext-cs-L20" class="blob-num js-line-number" data-line-number="20">
                </td>
                
                <td id="file-dbcontext-cs-LC20" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/bec897d4f397ddc7b750/raw/a1f5898d158089793d1f97426e99b7970e2f5eb3/DbContext.cs" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/bec897d4f397ddc7b750#file-dbcontext-cs">DbContext.cs</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

A couple of details worth noting here:  
1) the repositories are exposed as interfaces and not as specific implementation, making tests easier to write  
2) again, all the repositories are generated via a factory, injected directly in the ctor.

<a href="https://en.wikipedia.org/wiki/Abstract_factory_pattern" target="_blank">The Factory Pattern</a> allows us to add more repositories without much hassle and, moreover, to inject a "fake" factory during our tests.

[Next time](http://www.davidguida.net/unit-testing-mongodb-in-c-part-3-the-database-factories/) we'll discuss about how to implement a factory for our repo-needs 🙂

<div class="post-details-footer-widgets">
</div>