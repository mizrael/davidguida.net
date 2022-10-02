---
id: 483
title: Using Web API as a proxy for downloading files
date: 2014-05-06T17:41:32-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=483
permalink: /using-web-api-as-a-proxy-for-downloading-files/
dsq_thread_id:
  - "5139530260"
image: /assets/uploads/2014/04/WebAPI.jpg
categories:
  - ASP.NET
  - Programming
  - WebAPI
---
Imagine this scenario: an ApiController Action that acts as a proxy to an external CDN for downloading files (yes, even large ones).

The basic idea here is to use <a title="HttpClient" href="http://msdn.microsoft.com/it-it/library/system.net.http.httpclient.aspx" target="_blank">HttpClient</a> to create an async request to the CDN passing also the optional range headers and then simply return the result to client. Easy huh?  
Let&#8217;s take a look at the code:

<div style="tab-size: 8" id="gist28840904" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-webapi-file-proxy-controller-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-en">Task</span><<span class="pl-en">HttpResponseMessage</span>> <span class="pl-en">Get</span>()
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC2" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">resourceUrl</span> <span class="pl-k">=</span> <span class="pl-s"><span class="pl-pds">"</span>&#8230;&#8230;&#8230;&#8230;..<span class="pl-pds">"</span></span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC4" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">range</span> <span class="pl-k">=</span> <span class="pl-en">ExtractRange</span>(<span class="pl-k">this</span>.<span class="pl-smi">Request</span>.<span class="pl-smi">Headers</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC5" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC6" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">request</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">HttpRequestMessage</span>(<span class="pl-smi">HttpMethod</span>.<span class="pl-smi">Get</span>, <span class="pl-smi">resourceUrl</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC7" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">if</span> (<span class="pl-c1">null</span> <span class="pl-k">!=</span> <span class="pl-smi">range</span>)
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC8" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">request</span>.<span class="pl-smi">Headers</span>.<span class="pl-smi">Range</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">RangeHeaderValue</span>(<span class="pl-smi">range</span>.<span class="pl-smi">From</span>, <span class="pl-smi">range</span>.<span class="pl-smi">To</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC9" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC10" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">client</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">HttpClient</span>();
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L11" class="blob-num js-line-number" data-line-number="11">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC11" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">response</span> <span class="pl-k">=</span> <span class="pl-smi">client</span>.<span class="pl-en">SendAsync</span>(<span class="pl-smi">request</span>).<span class="pl-en">ContinueWith</span><<span class="pl-en">HttpResponseMessage</span>>(<span class="pl-smi">t</span> <span class="pl-k">=></span> {
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L12" class="blob-num js-line-number" data-line-number="12">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC12" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">finalResp</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">HttpResponseMessage</span>(<span class="pl-smi">HttpStatusCode</span>.<span class="pl-smi">OK</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L13" class="blob-num js-line-number" data-line-number="13">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC13" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L14" class="blob-num js-line-number" data-line-number="14">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC14" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">finalResp</span>.<span class="pl-smi">Content</span> <span class="pl-k">=</span> <span class="pl-smi">t</span>.<span class="pl-smi">Result</span>.<span class="pl-smi">Content</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L15" class="blob-num js-line-number" data-line-number="15">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC15" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L16" class="blob-num js-line-number" data-line-number="16">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC16" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">if</span> (<span class="pl-c1">null</span> <span class="pl-k">!=</span> <span class="pl-smi">range</span>)
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L17" class="blob-num js-line-number" data-line-number="17">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC17" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">finalResp</span>.<span class="pl-smi">StatusCode</span> <span class="pl-k">=</span> <span class="pl-smi">HttpStatusCode</span>.<span class="pl-smi">PartialContent</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L18" class="blob-num js-line-number" data-line-number="18">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC18" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L19" class="blob-num js-line-number" data-line-number="19">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC19" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">return</span> <span class="pl-smi">finalResp</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L20" class="blob-num js-line-number" data-line-number="20">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC20" class="blob-code blob-code-inner js-file-line">
                  });
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L21" class="blob-num js-line-number" data-line-number="21">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC21" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">return</span> <span class="pl-smi">response</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L22" class="blob-num js-line-number" data-line-number="22">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC22" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L23" class="blob-num js-line-number" data-line-number="23">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC23" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L24" class="blob-num js-line-number" data-line-number="24">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC24" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">private</span> <span class="pl-k">static</span> <span class="pl-en">RangeHeaderValue</span> <span class="pl-en">ExtractRange</span>(<span class="pl-en">HttpRequestHeaders</span> <span class="pl-smi">headers</span>)
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L25" class="blob-num js-line-number" data-line-number="25">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC25" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L26" class="blob-num js-line-number" data-line-number="26">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC26" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">if</span> (<span class="pl-c1">null</span> <span class="pl-k">==</span> <span class="pl-smi">headers</span>)
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L27" class="blob-num js-line-number" data-line-number="27">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC27" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">throw</span> <span class="pl-k">new</span> <span class="pl-en">ArgumentNullException</span>(<span class="pl-s"><span class="pl-pds">"</span>headers<span class="pl-pds">"</span></span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L28" class="blob-num js-line-number" data-line-number="28">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC28" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L29" class="blob-num js-line-number" data-line-number="29">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC29" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">const</span> <span class="pl-k">int</span> <span class="pl-smi">readStreamBufferSize</span> <span class="pl-k">=</span> <span class="pl-c1">1024</span> <span class="pl-k">*</span> <span class="pl-c1">1024</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L30" class="blob-num js-line-number" data-line-number="30">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC30" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L31" class="blob-num js-line-number" data-line-number="31">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC31" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">hasRange</span> <span class="pl-k">=</span> (<span class="pl-c1">null</span> <span class="pl-k">!=</span> <span class="pl-smi">headers</span>.<span class="pl-smi">Range</span> <span class="pl-k">&&</span> <span class="pl-smi">headers</span>.<span class="pl-smi">Range</span>.<span class="pl-smi">Ranges</span>.<span class="pl-en">Any</span>());
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L32" class="blob-num js-line-number" data-line-number="32">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC32" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">rangeHeader</span> <span class="pl-k">=</span> <span class="pl-smi">hasRange</span> <span class="pl-k">?</span> <span class="pl-smi">headers</span>.<span class="pl-smi">Range</span> <span class="pl-k">:</span> <span class="pl-k">new</span> <span class="pl-en">RangeHeaderValue</span>(<span class="pl-c1"></span>, <span class="pl-smi">readStreamBufferSize</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L33" class="blob-num js-line-number" data-line-number="33">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC33" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">if</span> (<span class="pl-k">!</span><span class="pl-smi">hasRange</span>)
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L34" class="blob-num js-line-number" data-line-number="34">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC34" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">return</span> <span class="pl-smi">rangeHeader</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L35" class="blob-num js-line-number" data-line-number="35">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC35" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L36" class="blob-num js-line-number" data-line-number="36">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC36" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-c"><span class="pl-c">//</span> it is better to limit the request to a specific range in order to do no have an out-of-memory exception</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L37" class="blob-num js-line-number" data-line-number="37">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC37" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">range</span> <span class="pl-k">=</span> <span class="pl-smi">rangeHeader</span>.<span class="pl-smi">Ranges</span>.<span class="pl-en">ElementAt</span>(<span class="pl-c1"></span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L38" class="blob-num js-line-number" data-line-number="38">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC38" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">from</span> <span class="pl-k">=</span> <span class="pl-smi">range</span>.<span class="pl-smi">From</span>.<span class="pl-en">GetValueOrDefault</span>(<span class="pl-c1"></span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L39" class="blob-num js-line-number" data-line-number="39">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC39" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">rangeHeader</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">RangeHeaderValue</span>(<span class="pl-smi">@from</span>, <span class="pl-smi">@from</span> <span class="pl-k">+</span> <span class="pl-smi">range</span>.<span class="pl-smi">To</span>.<span class="pl-en">GetValueOrDefault</span>(<span class="pl-smi">readStreamBufferSize</span>));
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L40" class="blob-num js-line-number" data-line-number="40">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC40" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">return</span> <span class="pl-smi">rangeHeader</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-webapi-file-proxy-controller-cs-L41" class="blob-num js-line-number" data-line-number="41">
                </td>
                
                <td id="file-webapi-file-proxy-controller-cs-LC41" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/anonymous/23a933502d44ec1c83fc/raw/a4cfea472e56c416ba97ee61b14edd24afa47a51/webApi-File-Proxy-Controller.cs" style="float:right">view raw</a><br /> <a href="https://gist.github.com/anonymous/23a933502d44ec1c83fc#file-webapi-file-proxy-controller-cs">webApi-File-Proxy-Controller.cs</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

it&#8217;s just important to note that I&#8217;m not returning <a title="HttpResponseMessage" href="http://msdn.microsoft.com/it-it/library/system.net.http.httpresponsemessage.aspx" target="_blank">HttpResponseMessage </a> directly but I have it enclosed in a Task< > . The <a title="ContinueWith" href="http://msdn.microsoft.com/it-it/library/system.threading.tasks.task.continuewith(v=vs.110).aspx" target="_blank">ContinueWith </a>part is used to set the http status code to <a title="HTTP Status: 206 Partial Content and Range Requests" href="http://benramsey.com/blog/2008/05/206-partial-content-and-range-requests/" target="_blank">PartialContent </a>(if the range header is provided) and to return the result from the CDN.

I&#8217;m targeting .NET 4.0, that&#8217;s why there are no async/await 🙂

&nbsp;

UPDATE (11/12/2015): **Bernhard** was wondering how the ExtractRange method looks like so I decided to update the post a little bit adding it.  
Just one note: this is just an example, code like this is not testable and breaks SRP. Should definitely be placed in a different object so handle with care 🙂

<div class="post-details-footer-widgets">
</div>