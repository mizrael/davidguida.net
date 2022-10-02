---
description: >
  Last week I was invited as speaker at the monthly DevDay Salerno to talk about Feature Gating. Seems that the topic captured some interest so I thought it was a good idea to write a little about it here. So what is Feature Gating ?
id: 6426
title: 'Feature Gating part 1 : what is it?'
date: 2018-02-26T12:22:39-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6426
permalink: /feature-gating-part-1-what-is-it/
image: /assets/uploads/2018/02/feature_gating-e1519643864384.jpg
categories:
  - Programming
  - Software Architecture
---
Last week I was invited as speaker at the monthly <a href="https://www.meetup.com/en-AU/devday-salerno/" target="_blank" rel="noopener">DevDay Salerno</a> to talk about **Feature Gating**. The recording will be soon available on YouTube (even though it will be in italian, sorry).

Seems that the topic captured some interest so I thought it was a good idea to write a little about it here.&nbsp;

In this **series of articles** we will

  * discover what Feature Gating is
  * what strategy can we use to persist our data
  * some design patterns
  * how Feature Gating can help us and why should we be using it
  * how to fight the infamous tech debt

So let&#8217;s start!

As I wrote already in <a href="https://www.davidguida.net/devday-salerno-lets-talk-about-feature-gating/" target="_blank" rel="noopener">my last post</a>,&nbsp;Feature Gating is an interesting and easy tool to leverage when you want more flexibility during production deployment. It helps&nbsp;controlling and shipping new features faster allowing practices like&nbsp;<a href="https://martinfowler.com/bliki/CanaryRelease.html" target="_blank" rel="noopener">canary releases</a> and&nbsp;<a href="https://en.wikipedia.org/wiki/A/B_testing" target="_blank" rel="noopener">A/B testing</a>.

But what&#8217;s the heart of it? An **IF block**. Nothing else.&nbsp;

Suppose you&#8217;re asked to rewrite a functionality, the first thing you would probably do is commenting the old code and replace it with a new function. Something like this:

<div style="tab-size: 8" id="gist87451611" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-feature-gating-example1-js" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-javascript  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-feature-gating-example1-js-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-feature-gating-example1-js-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>function</span> <span class=pl-en>compute_stuff</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example1-js-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-feature-gating-example1-js-LC2" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>/*&#8230;*/</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example1-js-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-feature-gating-example1-js-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-en>old_tested_reliable_and_lovely_function</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example1-js-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-feature-gating-example1-js-LC4" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>/*&#8230;*/</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example1-js-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-feature-gating-example1-js-LC5" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/7dbb2b33227a4d40ef830a217ee7833b/raw/d1596d07a6d0356713861f3e296b60bfa72cdee2/feature-gating-example1.js" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/7dbb2b33227a4d40ef830a217ee7833b#file-feature-gating-example1-js">feature-gating-example1.js</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
  
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-feature-gating-example2-js" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-javascript  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-feature-gating-example2-js-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-feature-gating-example2-js-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>function</span> <span class=pl-en>compute_stuff</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example2-js-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-feature-gating-example2-js-LC2" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>/*&#8230;*/</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example2-js-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-feature-gating-example2-js-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>//old_tested_reliable_and_lovely_function();</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example2-js-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-feature-gating-example2-js-LC4" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-en>new_amazing_shiny_never_used_function</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example2-js-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-feature-gating-example2-js-LC5" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>/*&#8230;*/</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example2-js-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-feature-gating-example2-js-LC6" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/7dbb2b33227a4d40ef830a217ee7833b/raw/d1596d07a6d0356713861f3e296b60bfa72cdee2/feature-gating-example2.js" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/7dbb2b33227a4d40ef830a217ee7833b#file-feature-gating-example2-js">feature-gating-example2.js</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

Then (probably, **hopefully**) you update your tests and deploy to production. And right after you discover that maybe

  * the code is not exactly doing what it&#8217;s supposed to do
  * performances are lower than expected
  * a bug slipped through
  * whatever

So how can you control this without updating the code and deploying again? Let&#8217;s see a very simple solution:

<div style="tab-size: 8" id="gist87452168" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-feature-gating-example3-js" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-javascript  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-feature-gating-example3-js-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-feature-gating-example3-js-LC1" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example3-js-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-feature-gating-example3-js-LC2" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>function</span> <span class=pl-en>compute_stuff</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example3-js-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-feature-gating-example3-js-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>/*&#8230;*/</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example3-js-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-feature-gating-example3-js-LC4" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>if</span><span class=pl-kos>(</span><span class=pl-en>checkFeatureIsOn</span><span class=pl-kos>(</span><span class=pl-s>"foo_feature"</span><span class=pl-kos>)</span><span class=pl-kos>)</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example3-js-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-feature-gating-example3-js-LC5" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-en>new_amazing_shiny_never_used_function</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example3-js-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-feature-gating-example3-js-LC6" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span><span class=pl-k>else</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example3-js-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-feature-gating-example3-js-LC7" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-en>old_tested_reliable_and_lovely_function</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example3-js-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-feature-gating-example3-js-LC8" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example3-js-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-feature-gating-example3-js-LC9" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>/*&#8230;*/</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-example3-js-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-feature-gating-example3-js-LC10" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/6d453d03b3f7b3d2e194064651ad70ea/raw/23a5408aa1c394a216de0990b81a85b7ef3ee1c8/feature-gating-example3.js" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/6d453d03b3f7b3d2e194064651ad70ea#file-feature-gating-example3-js">feature-gating-example3.js</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

We introduced another actor, this &#8220;checkFeatureIsOn&#8221; function. It will take the name of the feature and return a **boolean** **flag** indicating whether or not use the new codepath.

<a href="https://www.davidguida.net/feature-gating-part-2-how-can-we-store-the-flags/" target="_blank" rel="noopener">In the next article</a> we will explore how would you store all the flags. Stay tuned!

<div class="post-details-footer-widgets">
</div>