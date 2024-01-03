---
description: >
  How to detect the current culture in javascript, useful for example when in a languages dropdown you want the user's preferred one already selected.
id: 6342
title: How to detect current culture in javascript
date: 2017-08-04T13:25:49-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6342
permalink: /how-to-detect-current-culture-in-javascript/
dsq_thread_id:
  - "6040549830"
image: /assets/uploads/2017/08/javascript-js-ss-1920.jpg
categories:
  - Javascript
  - Programming
---
Detecting the current culture in javascript can be really useful in many cases, an example might be a dropdown with a list of languages and the user's one as default selection.

I am getting a little lazy these days, I would like to write more articles about software architecture, design patterns or fancy techs like MongoDb and so on&#8230;. but I am moving to another country and packing an entire house is taking away all my time and energies.

So this is just a quick post showing a couple of ways&nbsp;to detect the current culture in javascript. Probably just a reminder for my sloppy memory 🙂

Based on the <a href="https://developer.mozilla.org/it/docs/Web/API/NavigatorLanguage/language" target="_blank" rel="noopener">docs on the MDN website</a>, the <a href="https://developer.mozilla.org/it/docs/Web/API/Window/navigator" target="_blank" rel="noopener">window.navigator</a> object exposes a **language&nbsp;**property that represents &nbsp;the preferred language of the user, usually the language of the browser UI.&nbsp;

The compatibility is quite good except as usual for IE Mobile, however there are two valid alternatives, <a href="https://msdn.microsoft.com/library/ms534713.aspx" target="_blank" rel="noopener">userLanguage</a> and <a href="https://msdn.microsoft.com/library/ms533542.aspx" target="_blank" rel="noopener">browserLanguage</a>.

In case you want the list of all the preferred languages for the user, there's an experimental property you can exploit, <a href="https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages" target="_blank" rel="noopener">navigator.languages</a>. That's an "experimental technology", so the compatibility list is still short (eg. Chrome and Firefox, as usual). It's a string array containing the list of the user's preferred languages, with the most preferred language first.&nbsp;

Based on the docs, _navigator.language_ should&nbsp;be the first element of the returned array but if I check the values in Chrome I get this:

_navigator.languages_ ->_ **["it-IT", "it", "en-US", "en"]**_  
_navigator.language_&nbsp;->&nbsp;_**"en-GB"**_

Weird, isn't it?

My guess is that&nbsp;_navigator.languages_&nbsp;returns the list of the user&nbsp;**system** preferred languages, while&nbsp;_navigator.language_ gives instead the current browser's language.&nbsp;

Searching on StackOverflow there's a good answer to the question, I have extracted the code in this gist (link in the code):

<div style="tab-size: 8" id="gist73710065" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-detectculture-js" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-javascript  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-detectculture-js-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-detectculture-js-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-c>/// https://stackoverflow.com/questions/25606730/get-current-locale-of-chrome#answer-42070353</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-detectculture-js-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-detectculture-js-LC2" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>var</span> <span class=pl-s1>language</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-detectculture-js-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-detectculture-js-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>if</span> <span class=pl-kos>(</span><span class=pl-smi>window</span><span class=pl-kos>.</span><span class=pl-c1>navigator</span><span class=pl-kos>.</span><span class=pl-c1>languages</span><span class=pl-kos>)</span> <span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-detectculture-js-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-detectculture-js-LC4" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>language</span> <span class=pl-c1>=</span> <span class=pl-smi>window</span><span class=pl-kos>.</span><span class=pl-c1>navigator</span><span class=pl-kos>.</span><span class=pl-c1>languages</span><span class=pl-kos>[</span><span class=pl-c1>0</span><span class=pl-kos>]</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-detectculture-js-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-detectculture-js-LC5" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span> <span class=pl-k>else</span> <span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-detectculture-js-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-detectculture-js-LC6" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>language</span> <span class=pl-c1>=</span> <span class=pl-smi>window</span><span class=pl-kos>.</span><span class=pl-c1>navigator</span><span class=pl-kos>.</span><span class=pl-c1>userLanguage</span> <span class=pl-c1>||</span> <span class=pl-smi>window</span><span class=pl-kos>.</span><span class=pl-c1>navigator</span><span class=pl-kos>.</span><span class=pl-c1>language</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-detectculture-js-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-detectculture-js-LC7" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/50c10be8ec92264751187d7705362eb2/raw/a4bc3dc65bdbdf362ed6edbda74f224947c6c675/detectCulture.js" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/50c10be8ec92264751187d7705362eb2#file-detectculture-js">detectCulture.js</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

&nbsp;

<div class="post-details-footer-widgets">
</div>