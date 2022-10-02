---
description: >
  Bad things can happen when using EntityFramework Core in a multithreading environment. Special care is needed. Don't be foolish, read this article!
id: 6746
title: 'Remember kids: DbContext is not threadsafe'
date: 2019-09-05T15:06:09-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6746
permalink: /remember-kids-dbcontext-is-not-threadsafe/
dsq_thread_id:
  - "7620480355"
image: /assets/uploads/2019/09/servers.png
categories:
  - .NET
  - ASP.NET
  - Programming
tags:
  - programming
---
Let me say that again: **DbContext is NOT threadsafe.**

Not clear enough? Well, let&#8217;s make an example. Actually, I&#8217;ll show something that happened to me at work.

Let me give you some context just for the sake of it, even though it&#8217;s not extremely relevant to the issue.

In this project I have a CQRS-like architecture with a pub/sub mechanism that I use to regenerate the Query models. All nice and clean, works like a charm. On a single machine. Mine.

Actually it worked pretty well also when deployed to the Dev server. Still a single instance per service though.

Things started getting messy when I moved to Staging: for some reason that will remain unknown, the deploy script decided to create multiple instances of the subscriber.

I don&#8217;t mind as I&#8217;m always striving for immutability and statelessness so IDEALLY, I should be able to deploy as many instances of my services as I want. And that was true except for a single event handler in that subscriber.

Code was somewhat like this:<figure class="wp-block-embed">

<div class="wp-block-embed__wrapper">
  <div style="tab-size: 8" id="gist98083056" class="gist">
    <div class="gist-file">
      <div class="gist-data">
        <div class="js-gist-file-update-container js-task-list-container file-box">
          <div id="file-faultyasynctransaction-cs" class="file my-2">
            <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
              <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
                <tr>
                  <td id="file-faultyasynctransaction-cs-L1" class="blob-num js-line-number" data-line-number="1">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC1" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-k">using</span> (<span class="pl-en">var</span> <span class="pl-en">tran</span> <span class="pl-k">=</span> <span class="pl-en">await</span> <span class="pl-en">_dbContext</span>.<span class="pl-en">BeginTransactionAsync</span>())
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L2" class="blob-num js-line-number" data-line-number="2">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC2" class="blob-code blob-code-inner js-file-line">
                    {
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L3" class="blob-num js-line-number" data-line-number="3">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC3" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-en">try</span>
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L4" class="blob-num js-line-number" data-line-number="4">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC4" class="blob-code blob-code-inner js-file-line">
                    {
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L5" class="blob-num js-line-number" data-line-number="5">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC5" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-en">var</span> <span class="pl-en">modelsToRemove</span> <span class="pl-k">=</span> <span class="pl-en">await</span> <span class="pl-en">_dbContext</span>.<span class="pl-en">QueryModels</span>
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L6" class="blob-num js-line-number" data-line-number="6">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC6" class="blob-code blob-code-inner js-file-line">
                    .<span class="pl-en">Where</span>(<span class="pl-en">f</span> <span class="pl-k">=</span>> <span class="pl-c"><span class="pl-c">/*</span> some filter here <span class="pl-c">*/</span></span>)
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L7" class="blob-num js-line-number" data-line-number="7">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC7" class="blob-code blob-code-inner js-file-line">
                    .<span class="pl-en">ToArrayAsync</span>();
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L8" class="blob-num js-line-number" data-line-number="8">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC8" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-k">if</span> (<span class="pl-smi">modelsToRemove</span>.<span class="pl-en">Any</span>())
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L9" class="blob-num js-line-number" data-line-number="9">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC9" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-smi">_dbContext</span>.<span class="pl-smi">QueryModels</span>.<span class="pl-en">RemoveRange</span>(<span class="pl-smi">modelsToRemove</span>);
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L10" class="blob-num js-line-number" data-line-number="10">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC10" class="blob-code blob-code-inner js-file-line">
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L11" class="blob-num js-line-number" data-line-number="11">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC11" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-k">if</span> (<span class="pl-smi">newModels</span><span class="pl-k">?</span>.<span class="pl-en">Any</span>())
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L12" class="blob-num js-line-number" data-line-number="12">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC12" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-smi">_dbContext</span>.<span class="pl-smi">QueryModels</span>.<span class="pl-en">AddRange</span>(<span class="pl-smi">newModels</span>);
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L13" class="blob-num js-line-number" data-line-number="13">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC13" class="blob-code blob-code-inner js-file-line">
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L14" class="blob-num js-line-number" data-line-number="14">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC14" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-k">await</span> <span class="pl-smi">_dbContext</span>.<span class="pl-en">SaveChangesAsync</span>();
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L15" class="blob-num js-line-number" data-line-number="15">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC15" class="blob-code blob-code-inner js-file-line">
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L16" class="blob-num js-line-number" data-line-number="16">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC16" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-smi">tran</span>.<span class="pl-en">Commit</span>();
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L17" class="blob-num js-line-number" data-line-number="17">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC17" class="blob-code blob-code-inner js-file-line">
                    }
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L18" class="blob-num js-line-number" data-line-number="18">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC18" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-k">catch</span> (<span class="pl-en">Exception</span> <span class="pl-smi">ex</span>)
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L19" class="blob-num js-line-number" data-line-number="19">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC19" class="blob-code blob-code-inner js-file-line">
                    {
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L20" class="blob-num js-line-number" data-line-number="20">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC20" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-smi">tran</span>.<span class="pl-en">Rollback</span>();
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L21" class="blob-num js-line-number" data-line-number="21">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC21" class="blob-code blob-code-inner js-file-line">
                    }
                  </td>
                </tr>
                
                <tr>
                  <td id="file-faultyasynctransaction-cs-L22" class="blob-num js-line-number" data-line-number="22">
                  </td>
                  
                  <td id="file-faultyasynctransaction-cs-LC22" class="blob-code blob-code-inner js-file-line">
                    }
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div class="gist-meta">
        <a href="https://gist.github.com/mizrael/4718a854aeac21273ad2a4969478626e/raw/c153204c67e26d1765158f3a52fd65fec09c4f8a/FaultyAsyncTransaction.cs" style="float:right">view raw</a> <a href="https://gist.github.com/mizrael/4718a854aeac21273ad2a4969478626e#file-faultyasynctransaction-cs">FaultyAsyncTransaction.cs</a> hosted with &#10084; by <a href="https://github.com">GitHub</a>
      </div>
    </div>
  </div>
</div></figure> 

It is removing the old models and replacing them with new data. Plain and simple. Everything is also wrapped in a transaction.

So where&#8217;s the problem? Apparently, combining the two operations may lead to unexpected results, like bad data being persisted. Or not persisted at all.

This fixed the issue:<figure class="wp-block-embed">

<div class="wp-block-embed__wrapper">
  <div style="tab-size: 8" id="gist98083089" class="gist">
    <div class="gist-file">
      <div class="gist-data">
        <div class="js-gist-file-update-container js-task-list-container file-box">
          <div id="file-asynctransaction-cs" class="file my-2">
            <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
              <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
                <tr>
                  <td id="file-asynctransaction-cs-L1" class="blob-num js-line-number" data-line-number="1">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC1" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-k">using</span> (<span class="pl-en">var</span> <span class="pl-en">tran</span> <span class="pl-k">=</span> <span class="pl-en">await</span> <span class="pl-en">_dbContext</span>.<span class="pl-en">BeginTransactionAsync</span>())
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L2" class="blob-num js-line-number" data-line-number="2">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC2" class="blob-code blob-code-inner js-file-line">
                    {
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L3" class="blob-num js-line-number" data-line-number="3">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC3" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-en">try</span>
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L4" class="blob-num js-line-number" data-line-number="4">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC4" class="blob-code blob-code-inner js-file-line">
                    {
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L5" class="blob-num js-line-number" data-line-number="5">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC5" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-en">var</span> <span class="pl-en">modelsToRemove</span> <span class="pl-k">=</span> <span class="pl-en">await</span> <span class="pl-en">_dbContext</span>.<span class="pl-en">QueryModels</span>
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L6" class="blob-num js-line-number" data-line-number="6">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC6" class="blob-code blob-code-inner js-file-line">
                    .<span class="pl-en">Where</span>(<span class="pl-en">f</span> <span class="pl-k">=</span>> <span class="pl-c"><span class="pl-c">/*</span> some filter here <span class="pl-c">*/</span></span>)
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L7" class="blob-num js-line-number" data-line-number="7">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC7" class="blob-code blob-code-inner js-file-line">
                    .<span class="pl-en">ToArrayAsync</span>();
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L8" class="blob-num js-line-number" data-line-number="8">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC8" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-k">if</span> (<span class="pl-smi">modelsToRemove</span>.<span class="pl-en">Any</span>())
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L9" class="blob-num js-line-number" data-line-number="9">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC9" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-smi">_dbContext</span>.<span class="pl-smi">QueryModels</span>.<span class="pl-en">RemoveRange</span>(<span class="pl-smi">modelsToRemove</span>);
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L10" class="blob-num js-line-number" data-line-number="10">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC10" class="blob-code blob-code-inner js-file-line">
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L11" class="blob-num js-line-number" data-line-number="11">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC11" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-c"><span class="pl-c">//</span> remenber to call SaveChangesAsync() after every write in order to</span>
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L12" class="blob-num js-line-number" data-line-number="12">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC12" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-c"><span class="pl-c">//</span> ensure that the operation has been performed.</span>
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L13" class="blob-num js-line-number" data-line-number="13">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC13" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-c"><span class="pl-c">//</span> The Ef DbContext is not thread safe and if there are multiple instances of the</span>
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L14" class="blob-num js-line-number" data-line-number="14">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC14" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-c"><span class="pl-c">//</span> service, data might not be persisted correctly.</span>
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L15" class="blob-num js-line-number" data-line-number="15">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC15" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-k">await</span> <span class="pl-smi">_dbContext</span>.<span class="pl-en">SaveChangesAsync</span>();
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L16" class="blob-num js-line-number" data-line-number="16">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC16" class="blob-code blob-code-inner js-file-line">
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L17" class="blob-num js-line-number" data-line-number="17">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC17" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-k">if</span> (<span class="pl-smi">newModels</span><span class="pl-k">?</span>.<span class="pl-en">Any</span>())
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L18" class="blob-num js-line-number" data-line-number="18">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC18" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-smi">_dbContext</span>.<span class="pl-smi">QueryModels</span>.<span class="pl-en">AddRange</span>(<span class="pl-smi">newModels</span>);
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L19" class="blob-num js-line-number" data-line-number="19">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC19" class="blob-code blob-code-inner js-file-line">
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L20" class="blob-num js-line-number" data-line-number="20">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC20" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-k">await</span> <span class="pl-smi">_dbContext</span>.<span class="pl-en">SaveChangesAsync</span>();
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L21" class="blob-num js-line-number" data-line-number="21">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC21" class="blob-code blob-code-inner js-file-line">
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L22" class="blob-num js-line-number" data-line-number="22">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC22" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-smi">tran</span>.<span class="pl-en">Commit</span>();
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L23" class="blob-num js-line-number" data-line-number="23">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC23" class="blob-code blob-code-inner js-file-line">
                    }
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L24" class="blob-num js-line-number" data-line-number="24">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC24" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-k">catch</span> (<span class="pl-en">Exception</span> <span class="pl-smi">ex</span>)
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L25" class="blob-num js-line-number" data-line-number="25">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC25" class="blob-code blob-code-inner js-file-line">
                    {
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L26" class="blob-num js-line-number" data-line-number="26">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC26" class="blob-code blob-code-inner js-file-line">
                    <span class="pl-smi">tran</span>.<span class="pl-en">Rollback</span>();
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L27" class="blob-num js-line-number" data-line-number="27">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC27" class="blob-code blob-code-inner js-file-line">
                    }
                  </td>
                </tr>
                
                <tr>
                  <td id="file-asynctransaction-cs-L28" class="blob-num js-line-number" data-line-number="28">
                  </td>
                  
                  <td id="file-asynctransaction-cs-LC28" class="blob-code blob-code-inner js-file-line">
                    }
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div class="gist-meta">
        <a href="https://gist.github.com/mizrael/987d3b72ace169c3f34ab9c9072c1f21/raw/5edbc991f7bb71ed387e6ecb467a9f9285e30183/AsyncTransaction.cs" style="float:right">view raw</a> <a href="https://gist.github.com/mizrael/987d3b72ace169c3f34ab9c9072c1f21#file-asynctransaction-cs">AsyncTransaction.cs</a> hosted with &#10084; by <a href="https://github.com">GitHub</a>
      </div>
    </div>
  </div>
</div></figure> 

Calling <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontext.savechangesasync?view=efcore-2.1" target="_blank" rel="noreferrer noopener" aria-label="SaveChangesAsync (opens in a new tab)">SaveChangesAsync</a>() for every operation did the trick.

I&#8217;m not 100% sure why this is working, but I suspect the reason lies here:

<blockquote class="wp-block-quote">
  <p>
    EF Core does not support multiple parallel operations being run on the same context instance. You should always wait for an operation to complete before beginning the next operation. This is typically done by using the&nbsp;<code>await</code>&nbsp;keyword on each asynchronous operation.
  </p>
  
  <cite> <a href="https://docs.microsoft.com/en-us/ef/core/saving/async" target="_blank" rel="noreferrer noopener" aria-label="Asynchronous Saving  (opens in a new tab)">Asynchronous Saving </a></cite>
</blockquote>

This basically means that it&#8217;s a very bad idea to share instances of DbContext between classes. Or between instances of the same classes in different threads. 

Using a proper DI container, the solution would be to setup the DbContext with a <a href="https://dotnetcoretutorials.com/2017/03/25/net-core-dependency-injection-lifetimes-explained/" target="_blank" rel="noreferrer noopener" aria-label="Transient lifetime (opens in a new tab)">Transient lifetime</a>:

<pre class="wp-block-code"><code>services.AddDbContext&lt;ApplicationDbContext>(options =>         options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")), 
         ServiceLifetime.Transient);</code></pre>

this way a new instance will be created when needed and disposed as soon as possible.

Avoid setting the lifetime to Scoped or Singleton, otherwise you might be sharing the state, which is always a bad idea.

<div class="post-details-footer-widgets">
</div>