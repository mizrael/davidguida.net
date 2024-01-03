---
id: 6447
title: 'Feature Gating part 3 : how can we check the gates?'
date: 2018-03-07T09:30:41-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6447
permalink: /feature-gating-part-3-how-check-the-gates/
image: /assets/uploads/2018/02/feature_gating-e1519643864384.jpg
categories:
  - Programming
  - Software Architecture
  - Typescript
---
In this article we&#8217;ll explore few ways to check if the feature gates are **opened or not**. This is the third episode of our series about **Feature Gating**, <a href="https://www.davidguida.net/feature-gating-part-2-how-can-we-store-the-flags/" target="_blank" rel="noopener">last time</a> we discussed about the optimal persistence method for the flags.

The first approach is a&nbsp;**static config object** injected as <a href="https://en.wikipedia.org/wiki/Dependency_injection" target="_blank" rel="noopener">dependency</a> in the class cTor:

<div style="tab-size: 8" id="gist87831952" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-feature-gating-static-config-ts" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-typescript  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-feature-gating-static-config-ts-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>interface</span> <span class=pl-smi>IFoo</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC2" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c1>bar</span><span class=pl-kos>(</span><span class=pl-kos>)</span>:<span class=pl-smi><span class=pl-k>void</span></span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC4" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC5" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>interface</span> <span class=pl-smi>FlagsConfig</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC6" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c1>featureX</span>:<span class=pl-smi>boolean</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC7" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC8" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC9" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>export</span> <span class=pl-k>class</span> <span class=pl-smi>Foo</span> <span class=pl-k>implements</span> <span class=pl-smi>IFoo</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC10" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-en>constructor</span><span class=pl-kos>(</span><span class=pl-k>private</span> <span class=pl-k>readonly</span> <span class=pl-s1>flagsConfig</span>:<span class=pl-smi>FlagsConfig</span><span class=pl-kos>)</span><span class=pl-kos>{</span><span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L11" class="blob-num js-line-number" data-line-number="11">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC11" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L12" class="blob-num js-line-number" data-line-number="12">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC12" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>public</span> <span class=pl-en>bar</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L13" class="blob-num js-line-number" data-line-number="13">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC13" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>if</span><span class=pl-kos>(</span><span class=pl-smi>this</span><span class=pl-kos>.</span><span class=pl-c1>flagsConfig</span><span class=pl-kos>.</span><span class=pl-c1>featureX</span><span class=pl-kos>)</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L14" class="blob-num js-line-number" data-line-number="14">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC14" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>/*&#8230;&#8230;.*/</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L15" class="blob-num js-line-number" data-line-number="15">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC15" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span><span class=pl-k>else</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L16" class="blob-num js-line-number" data-line-number="16">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC16" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>/*&#8230;&#8230;.*/</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L17" class="blob-num js-line-number" data-line-number="17">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC17" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L18" class="blob-num js-line-number" data-line-number="18">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC18" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-static-config-ts-L19" class="blob-num js-line-number" data-line-number="19">
                </td>
                
                <td id="file-feature-gating-static-config-ts-LC19" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span><span class=pl-kos>;</span>
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/7b327d7aa16b14a8d21c8092c919117d/raw/8013a75a2a96bf6398259f2da15e3c3f91ddaa7e/feature-gating-static-config.ts" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/7b327d7aa16b14a8d21c8092c919117d#file-feature-gating-static-config-ts">feature-gating-static-config.ts</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

It&#8217;s simple, easy to implement and does the job. The configuration object can be instantiated in the&nbsp;**composition root** reading data&nbsp;from whatever is your <a href="https://www.davidguida.net/feature-gating-part-2-how-can-we-store-the-flags/" target="_blank" rel="noopener">persistence layer</a>&nbsp;&nbsp;and you&#8217;re done.

Drawbacks? It&#8217; **static**. That means you cannot vary your flags based on custom conditions (eg. logged user, time, geolocation).

So what can we do? Something like this:

<div style="tab-size: 8" id="gist87846612" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-feature-gating-service-ts" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-typescript  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-feature-gating-service-ts-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-feature-gating-service-ts-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>interface</span> <span class=pl-smi>IFeatureService</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-feature-gating-service-ts-LC2" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c1>isEnabled</span><span class=pl-kos>(</span><span class=pl-s1>featureName</span>:<span class=pl-smi>string</span><span class=pl-kos>)</span>:<span class=pl-smi>boolean</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-feature-gating-service-ts-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-feature-gating-service-ts-LC4" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-feature-gating-service-ts-LC5" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>export</span> <span class=pl-k>class</span> <span class=pl-smi>Foo</span> <span class=pl-k>implements</span> <span class=pl-smi>IFoo</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-feature-gating-service-ts-LC6" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-en>constructor</span><span class=pl-kos>(</span><span class=pl-k>private</span> <span class=pl-k>readonly</span> <span class=pl-s1>featureService</span>:<span class=pl-smi>IFeatureService</span><span class=pl-kos>)</span><span class=pl-kos>{</span><span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-feature-gating-service-ts-LC7" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-feature-gating-service-ts-LC8" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>public</span> <span class=pl-en>bar</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-feature-gating-service-ts-LC9" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>if</span><span class=pl-kos>(</span><span class=pl-smi>this</span><span class=pl-kos>.</span><span class=pl-c1>featureService</span><span class=pl-kos>.</span><span class=pl-en>isEnabled</span><span class=pl-kos>(</span><span class=pl-s>"feature-x"</span><span class=pl-kos>)</span><span class=pl-kos>)</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-feature-gating-service-ts-LC10" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>/*&#8230;&#8230;.*/</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L11" class="blob-num js-line-number" data-line-number="11">
                </td>
                
                <td id="file-feature-gating-service-ts-LC11" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span><span class=pl-k>else</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L12" class="blob-num js-line-number" data-line-number="12">
                </td>
                
                <td id="file-feature-gating-service-ts-LC12" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>/*&#8230;&#8230;.*/</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L13" class="blob-num js-line-number" data-line-number="13">
                </td>
                
                <td id="file-feature-gating-service-ts-LC13" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L14" class="blob-num js-line-number" data-line-number="14">
                </td>
                
                <td id="file-feature-gating-service-ts-LC14" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-service-ts-L15" class="blob-num js-line-number" data-line-number="15">
                </td>
                
                <td id="file-feature-gating-service-ts-LC15" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span><span class=pl-kos>;</span>
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/d8f5898becc21274f0cc2120402d4dc3/raw/aeb098af297b302736bcda91dd2c1a472e7598ae/feature-gating-service.ts" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/d8f5898becc21274f0cc2120402d4dc3#file-feature-gating-service-ts">feature-gating-service.ts</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

Replacing the configuration object with a **specific service&nbsp;**will do the job. This is probably the most common situation and personally I&#8217;m quite a fan. The only drawback is the infamous&nbsp;**tech debt**: very soon the code will be filled with if/else statements. Should we leave them? Remove them? If yes, when? We will discuss in another article a simple strategy for that.

Speaking about **strategy**, it&#8217;s a <a href="https://en.wikipedia.org/wiki/Strategy_pattern" target="_blank" rel="noopener">very interesting pattern</a> that we can exploit:

<div style="tab-size: 8" id="gist87846815" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-feature-gating-strategy-ts" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-typescript  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-feature-gating-strategy-ts-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>export</span> <span class=pl-k>class</span> <span class=pl-smi>Foo</span> <span class=pl-k>implements</span> <span class=pl-smi>IFoo</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC2" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-en>constructor</span><span class=pl-kos>(</span><span class=pl-k>private</span> <span class=pl-k>readonly</span> <span class=pl-s1>barStrategy</span>:<span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-c1>=></span><span class=pl-smi><span class=pl-k>void</span></span><span class=pl-kos>)</span><span class=pl-kos>{</span><span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>public</span> <span class=pl-en>bar</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC4" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-smi>this</span><span class=pl-kos>.</span><span class=pl-en>barStrategy</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC5" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC6" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC7" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC8" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>// composition root</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC9" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>const</span> <span class=pl-s1>featureService</span>:<span class=pl-smi>IFeatureService</span> <span class=pl-c1>=</span> <span class=pl-k>new</span> <span class=pl-smi>FeatureService</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>,</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC10" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-en>strategy1</span> <span class=pl-c1>=</span> <span class=pl-kos>(</span><span class=pl-kos>)</span>:<span class=pl-smi><span class=pl-k>void</span></span> <span class=pl-c1>=></span><span class=pl-kos>{</span> <span class=pl-c>/*&#8230;strategy 1&#8230;*/</span> <span class=pl-kos>}</span><span class=pl-kos>,</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L11" class="blob-num js-line-number" data-line-number="11">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC11" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-en>strategy2</span> <span class=pl-c1>=</span> <span class=pl-kos>(</span><span class=pl-kos>)</span>:<span class=pl-smi><span class=pl-k>void</span></span> <span class=pl-c1>=></span><span class=pl-kos>{</span> <span class=pl-c>/*&#8230;strategy 2&#8230;*/</span> <span class=pl-kos>}</span><span class=pl-kos>,</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L12" class="blob-num js-line-number" data-line-number="12">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC12" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>barStrategy</span>:<span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-c1>=></span><span class=pl-smi><span class=pl-k>void</span></span> <span class=pl-c1>=</span> <span class=pl-s1>featureService</span><span class=pl-kos>.</span><span class=pl-en>isEnabled</span><span class=pl-kos>(</span><span class=pl-s>"feature-x"</span><span class=pl-kos>)</span> ? <span class=pl-s1>strategy1</span> : <span class=pl-s1>strategy2</span><span class=pl-kos>,</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L13" class="blob-num js-line-number" data-line-number="13">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC13" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>foo</span>:<span class=pl-smi>IFoo</span> <span class=pl-c1>=</span> <span class=pl-k>new</span> <span class=pl-smi>Foo</span><span class=pl-kos>(</span><span class=pl-s1>barStrategy</span><span class=pl-kos>)</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-feature-gating-strategy-ts-L14" class="blob-num js-line-number" data-line-number="14">
                </td>
                
                <td id="file-feature-gating-strategy-ts-LC14" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/7e785a79747fd39b390a7d4e13b75f71/raw/a42124f192acfaa827c8c5120b630c50760195a5/feature-gating-strategy.ts" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/7e785a79747fd39b390a7d4e13b75f71#file-feature-gating-strategy-ts">feature-gating-strategy.ts</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

The idea is to encapsulate the new and the old logic in two classes (lines 10 and 11) and generate a third one which will use the previous featureService to pick the right instance. Finally all you have to do is to inject that class in the consumer and you&#8217;re done.&nbsp;&nbsp;

Next time: this is nice, but is really useful? What do we&nbsp;**really** get using Feature Gating?

<div class="post-details-footer-widgets">
</div>