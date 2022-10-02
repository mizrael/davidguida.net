---
description: >
  Unit testing MongoDB in C#: how to use the Moq NuGet package to fake Db Contextes and Repositories to write unit tests.
id: 6092
title: 'Unit testing MongoDB in C# part 4: the tests, finally'
date: 2017-01-09T22:18:34-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6092
permalink: /unit-testing-mongodb-in-c-part-4-the-tests-finally/
dsq_thread_id:
  - "5449531369"
image: /assets/uploads/2014/12/mongodb_logo.png
categories:
  - .NET
  - MongoDB
  - Programming
  - Software Architecture
  - Testing
---
More than a year. Wow, that&#8217;s a lot, even for me! In the [last episode of this series](https://www.davidguida.net/unit-testing-mongodb-in-c-part-3-the-database-factories/), we discussed about how to create the Factories for our Repositories. I guess now it&#8217;s time to put a use to all those interfaces and finally see how to unit test our MongoDB repositories 🙂

Remember: we are **not testing the driver** here. The MongoDB team is responsible for that. Not us.&nbsp;

What we have to do instead is to make sure all our classes follow the <a href="https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)" target="_blank" rel="noopener noreferrer">SOLID principles</a> and are testable. This way we can create a fake implementation of the low-level data access layer and inject it in the classes we have to test. Stop.

Let&#8217;s have a look at the code:

<div style="tab-size: 8" id="gist43648319" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-createuserhandlertests-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-createuserhandlertests-cs-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">using</span> <span class="pl-en">Xunit</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC2" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">using</span> <span class="pl-en">Moq</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC3" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC4" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-k">class</span> <span class="pl-en">CreateUserHandlerTests</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC5" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC6" class="blob-code blob-code-inner js-file-line">
                  [<span class="pl-en">Fact</span>]
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC7" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-k">async</span> <span class="pl-en">Task</span> <span class="pl-en">should_create_user_when_command_valid</span>()
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC8" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC9" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">command</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">CreateUser</span>(<span class="pl-smi">id</span>: <span class="pl-smi">Guid</span>.<span class="pl-en">NewGuid</span>(), <span class="pl-smi">username</span>: <span class="pl-s"><span class="pl-pds">"</span>loremipsum<span class="pl-pds">"</span></span>, <span class="pl-smi">email</span>: <span class="pl-s"><span class="pl-pds">"</span>lorem@ipsum.com<span class="pl-pds">"</span></span>, <span class="pl-smi">firstname</span>: <span class="pl-s"><span class="pl-pds">"</span>lorem<span class="pl-pds">"</span></span>, <span class="pl-smi">lastname</span>:<span class="pl-s"><span class="pl-pds">"</span>ipsum<span class="pl-pds">"</span></span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC10" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L11" class="blob-num js-line-number" data-line-number="11">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC11" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">mockRepo</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">Mock</span><<span class="pl-en">IRepository</span><<span class="pl-k">Infrastructure</span>.<span class="pl-k">Entities</span>.<span class="pl-en">User</span>>>();
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L12" class="blob-num js-line-number" data-line-number="12">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC12" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L13" class="blob-num js-line-number" data-line-number="13">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC13" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">mockDbContext</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">Mock</span><<span class="pl-en">IDbContext</span>>();
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L14" class="blob-num js-line-number" data-line-number="14">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC14" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">mockDbContext</span>.<span class="pl-en">Setup</span>(<span class="pl-smi">db</span> <span class="pl-k">=></span> <span class="pl-smi">db</span>.<span class="pl-smi">Users</span>).<span class="pl-en">Returns</span>(<span class="pl-smi">mockRepo</span>.<span class="pl-smi">Object</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L15" class="blob-num js-line-number" data-line-number="15">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC15" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L16" class="blob-num js-line-number" data-line-number="16">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC16" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">sut</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">CreateUserHandler</span>(<span class="pl-smi">mockDbContext</span>.<span class="pl-smi">Object</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L17" class="blob-num js-line-number" data-line-number="17">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC17" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">await</span> <span class="pl-smi">sut</span>.<span class="pl-en">Handle</span>(<span class="pl-smi">command</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L18" class="blob-num js-line-number" data-line-number="18">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC18" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L19" class="blob-num js-line-number" data-line-number="19">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC19" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">mockRepo</span>.<span class="pl-en">Verify</span>(<span class="pl-smi">m</span> <span class="pl-k">=></span> <span class="pl-smi">m</span>.<span class="pl-en">InsertOneAsync</span>(<span class="pl-smi">It</span>.<span class="pl-en">IsAny</span><<span class="pl-k">Infrastructure</span>.<span class="pl-k">Entities</span>.<span class="pl-en">User</span>>()), <span class="pl-smi">Times</span>.<span class="pl-en">Once</span>());
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L20" class="blob-num js-line-number" data-line-number="20">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC20" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-createuserhandlertests-cs-L21" class="blob-num js-line-number" data-line-number="21">
                </td>
                
                <td id="file-createuserhandlertests-cs-LC21" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/ff98c513bf3a99322b7d2d12d7df9bef/raw/46b29f07e2299aa031c4f631afca16245ff3c69e/CreateUserHandlerTests.cs" style="float:right">view raw</a> <a href="https://gist.github.com/mizrael/ff98c513bf3a99322b7d2d12d7df9bef#file-createuserhandlertests-cs">CreateUserHandlerTests.cs</a> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div>
  </div>
</div>

In our little example here I am testing a <a href="http://codebetter.com/gregyoung/2010/07/12/command-handlers-and-the-domain-model/" target="_blank" rel="noopener noreferrer">CQRS Command Handler</a>, the one responsible for creating a user. Our handler has an&nbsp;IDbContext as <a href="https://en.wikipedia.org/wiki/Dependency_injection" target="_blank" rel="noopener noreferrer">dependency</a>, which being an interface allows us to use the <a href="https://www.nuget.org/packages/Moq/" target="_blank" rel="noopener noreferrer">Moq Nuget package</a> to create a fake context implementation.&nbsp;

Also, we have to instruct the&nbsp;mockDbContext instance to return a mock User Repository every time we access the _.Users_ property.

At this point, all we have to do is to create <a href="https://en.wikipedia.org/wiki/System_under_test" target="_blank" rel="noopener noreferrer">the sut</a>, execute the method we want to test, and Verify() our expectations.&nbsp;

Let&#8217;s make a more interesting example now:

<div style="tab-size: 8" id="gist43648598" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-updateuserhandlertests-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-updateuserhandlertests-cs-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">using</span> <span class="pl-en">Xunit</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC2" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">using</span> <span class="pl-en">Moq</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC3" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC4" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-k">class</span> <span class="pl-en">UpdateUserHandlerTests</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC5" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC6" class="blob-code blob-code-inner js-file-line">
                  [<span class="pl-en">Fact</span>]
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC7" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-k">async</span> <span class="pl-en">Task</span> <span class="pl-en">should_Update_user_when_command_valid</span>()
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC8" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC9" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">command</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">UpdateUser</span>(<span class="pl-smi">id</span>: <span class="pl-smi">Guid</span>.<span class="pl-en">NewGuid</span>(), <span class="pl-smi">firstname</span>: <span class="pl-s"><span class="pl-pds">"</span>lorem<span class="pl-pds">"</span></span>, <span class="pl-smi">lastname</span>: <span class="pl-s"><span class="pl-pds">"</span>ipsum<span class="pl-pds">"</span></span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC10" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L11" class="blob-num js-line-number" data-line-number="11">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC11" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">user</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-k">Infrastructure</span>.<span class="pl-k">Entities</span>.<span class="pl-en">User</span>()
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L12" class="blob-num js-line-number" data-line-number="12">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC12" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L13" class="blob-num js-line-number" data-line-number="13">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC13" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">Id</span> <span class="pl-k">=</span> <span class="pl-smi">command</span>.<span class="pl-smi">UserId</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L14" class="blob-num js-line-number" data-line-number="14">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC14" class="blob-code blob-code-inner js-file-line">
                  };
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L15" class="blob-num js-line-number" data-line-number="15">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC15" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">mockRepo</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">Mock</span><<span class="pl-en">IRepository</span><<span class="pl-k">Infrastructure</span>.<span class="pl-k">Entities</span>.<span class="pl-en">UserData</span>>>();
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L16" class="blob-num js-line-number" data-line-number="16">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC16" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">mockRepo</span>.<span class="pl-en">Setup</span>(<span class="pl-smi">r</span> <span class="pl-k">=></span> <span class="pl-smi">r</span>.<span class="pl-en">FindOneAsync</span>(<span class="pl-smi">It</span>.<span class="pl-en">IsAny</span><<span class="pl-en">Expression</span><<span class="pl-en">Func</span><<span class="pl-k">Infrastructure</span>.<span class="pl-k">Entities</span>.<span class="pl-en">UserData</span>, <span class="pl-k">bool</span>>>>()))
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L17" class="blob-num js-line-number" data-line-number="17">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC17" class="blob-code blob-code-inner js-file-line">
                  .<span class="pl-en">ReturnsAsync</span>(<span class="pl-smi">user</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L18" class="blob-num js-line-number" data-line-number="18">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC18" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L19" class="blob-num js-line-number" data-line-number="19">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC19" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">mockDbContext</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">Mock</span><<span class="pl-en">IUserServiceDbContext</span>>();
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L20" class="blob-num js-line-number" data-line-number="20">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC20" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">mockDbContext</span>.<span class="pl-en">Setup</span>(<span class="pl-smi">db</span> <span class="pl-k">=></span> <span class="pl-smi">db</span>.<span class="pl-smi">UsersData</span>).<span class="pl-en">Returns</span>(<span class="pl-smi">mockRepo</span>.<span class="pl-smi">Object</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L21" class="blob-num js-line-number" data-line-number="21">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC21" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L22" class="blob-num js-line-number" data-line-number="22">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC22" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">sut</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">UpdateUserHandler</span>(<span class="pl-smi">mockDbContext</span>.<span class="pl-smi">Object</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L23" class="blob-num js-line-number" data-line-number="23">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC23" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">await</span> <span class="pl-smi">sut</span>.<span class="pl-en">Handle</span>(<span class="pl-smi">command</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L24" class="blob-num js-line-number" data-line-number="24">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC24" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L25" class="blob-num js-line-number" data-line-number="25">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC25" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">mockRepo</span>.<span class="pl-en">Verify</span>(<span class="pl-smi">m</span> <span class="pl-k">=></span> <span class="pl-smi">m</span>.<span class="pl-en">UpsertOneAsync</span>(<span class="pl-smi">It</span>.<span class="pl-en">IsAny</span><<span class="pl-en">Expression</span><<span class="pl-en">Func</span><<span class="pl-k">Infrastructure</span>.<span class="pl-k">Entities</span>.<span class="pl-en">UserData</span>, <span class="pl-k">bool</span>>>>(), <span class="pl-smi">It</span>.<span class="pl-en">IsAny</span><<span class="pl-k">Infrastructure</span>.<span class="pl-k">Entities</span>.<span class="pl-en">UserData</span>>()), <span class="pl-smi">Times</span>.<span class="pl-en">Once</span>());
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L26" class="blob-num js-line-number" data-line-number="26">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC26" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-updateuserhandlertests-cs-L27" class="blob-num js-line-number" data-line-number="27">
                </td>
                
                <td id="file-updateuserhandlertests-cs-LC27" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/3668d6163b2b577c88cb3381abaf451b/raw/e9887141132c695794da9926c9ab608ac15730a7/UpdateUserHandlerTests.cs" style="float:right">view raw</a> <a href="https://gist.github.com/mizrael/3668d6163b2b577c88cb3381abaf451b#file-updateuserhandlertests-cs">UpdateUserHandlerTests.cs</a> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div>
  </div>
</div>

Now that we have created the user, we may want also to update some of his details. The idea here is to instruct the mockRepo instance to return a specific user every time the FinstOneAsync method is executed.

Again, now we just need to verify the expectations and we&#8217;re done!

Note that in this case, we are making an assumption about the inner mechanism of the Handle() method of the UpdateUserHandler class. Personally I tend to stick with Black Box Testing, but sometimes (eg. now) you might be forced to use White Box Testing instead. If you don&#8217;t know what I am talking about, there&#8217;s a <a href="http://reqtest.com/testing-blog/test-design-techniques-explained-1-black-box-vs-white-box-testing/" target="_blank" rel="noopener noreferrer">nice article here </a>you may want to read.

&nbsp;

Update 13/05/2020:

I&#8217;ve added <a href="https://www.davidguida.net/write-integration-tests-on-mongodb-with-net-core-and-docker/" target="_blank" rel="noreferrer noopener">another article</a>, which can be considered as the final missing piece to this Series. Unit tests are fine, but when it comes to connecting the parts, we&#8217;re talking of &#8220;Integration tests&#8221; instead.

<div class="post-details-footer-widgets">
</div>